import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
export async function middleware(request: NextRequest) {
let response = NextResponse.next({
request: { headers: request.headers },
})

// Usando o seu padrão de cookies, que é o mais atual
const supabase = createServerClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
{
cookies: {
getAll() {
return request.cookies.getAll()
},
setAll(cookiesToSet) {
cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
response = NextResponse.next({
request,
})
cookiesToSet.forEach(({ name, value, options }) =>
response.cookies.set(name, value, options)
)
},
},
}
)

// Pega o usuário da sessão atual
const { data: { user } } = await supabase.auth.getUser()

const { pathname } = request.nextUrl

// REGRA 1: Se o usuário NÃO está logado, expulse-o para o login.
// (Ignora as rotas que já são de autenticação).
if (!user && !pathname.startsWith('/login') && !pathname.startsWith('/completar-cadastro')) {
const url = request.nextUrl.clone()
url.pathname = '/login'
return NextResponse.redirect(url)
}

// REGRA 2: Se o usuário ESTÁ logado, verifique o status do onboarding.
if (user) {
// Buscamos o perfil diretamente no middleware.
const { data: profile } = await supabase
.from('profiles')
.select('has_completed_onboarding')
.eq('id', user.id)
.single()

// Se o onboarding não foi completo E o usuário NÃO está na página de completar cadastro...
if (profile && !profile.has_completed_onboarding && pathname !== '/completar-cadastro') {
  // ...force o redirecionamento para lá.
  const url = request.nextUrl.clone()
  url.pathname = '/completar-cadastro'
  return NextResponse.redirect(url)
}
// (Bônus) Se o onboarding FOI completo e o usuário tenta acessar as páginas de auth...
if (profile && profile.has_completed_onboarding && (pathname.startsWith('/login') || pathname.startsWith('/completar-cadastro'))) {
   // ...mande-o para o dashboard principal.
   const url = request.nextUrl.clone()
   url.pathname = '/'
   return NextResponse.redirect(url)
}
}

return response
}

export const config = {
matcher: [
/**
 * Corresponde a todos os caminhos, exceto os de arquivos estáticos.
 */
'/((?!_next/static|_next/image|favicon.ico).*)',
],
}
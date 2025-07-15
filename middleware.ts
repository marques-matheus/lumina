import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
export async function middleware(request: NextRequest) {
// A resposta inicial permite que a requisição continue por padrão
let response = NextResponse.next({
request: { headers: request.headers },
})

const supabase = createServerClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
{
cookies: {
getAll() { return request.cookies.getAll() },
setAll(cookiesToSet) {
cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
response = NextResponse.next({ request })
cookiesToSet.forEach(({ name, value, options }) =>
response.cookies.set(name, value, options)
)
},
},
}
)

// Atualiza a sessão e pega o usuário
const { data: { user } } = await supabase.auth.getUser()

const { pathname } = request.nextUrl

// --- LIVRO DE REGRAS DO PORTEIRO ---

// REGRA 1: Se o visitante NÃO está logado E está a tentar aceder a qualquer página
// que NÃO seja uma página de autenticação...
if (!user && !pathname.startsWith('/auth')) {
// ...expulse-o para a página de login.
return NextResponse.redirect(new URL('/auth/login', request.url))
}

// REGRA 2: Se o usuário ESTÁ logado E tenta aceder às páginas de login/cadastro...
if (user && pathname.startsWith('/auth')) {
// ...mande-o para a página principal, pois ele já está autenticado.
return NextResponse.redirect(new URL('/', request.url))
}

// Se nenhuma das regras acima foi acionada, o acesso é permitido.
return response
}

// O config do matcher continua o mesmo, para rodar em todas as páginas.
export const config = {
matcher: [
'/((?!api|_next/static|_next/image|favicon.ico).*)',
],
}
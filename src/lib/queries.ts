import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
export async function getUserProfile() {

// Usamos um cliente de apenas leitura aqui
const cookieStore = cookies();
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      async getAll() {
        // Return all cookies as an array of { name, value }
        return Array.from((await cookieStore).getAll()).map(cookie => {
          const typedCookie = cookie as { name: string; value: string };
          return {
            name: typedCookie.name,
            value: typedCookie.value,
          };
        });
      },
    },
  }
);

// 1. Buscamos o usuário da sessão
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
console.log('[getUserProfile] Nenhum usuário encontrado na sessão.');
return null;
}

// 2. Buscamos o perfil na nossa tabela 'profiles'
console.log(`$[getUserProfile] Buscando perfil para o usuário ID: ${user.id}`);
const { data: profile, error } = await supabase
.from('profiles')
.select('*')
.eq('id', user.id)

if (error) {
console.error('[getUserProfile] Erro ao buscar perfil:', error.message);
// Se o perfil não for encontrado, retornamos apenas os dados básicos do usuário
return user;
}

console.log('[getUserProfile] Perfil encontrado:', profile);

// 3. A MÁGICA: Fundimos os dois objetos em um só.
// As propriedades de 'profile' sobrescreverão as de 'user' se tiverem o mesmo nome.
const sessionUser = {
...user,
...profile,
};

console.log('[getUserProfile] Objeto de sessão final retornado:', sessionUser);

return sessionUser;
}

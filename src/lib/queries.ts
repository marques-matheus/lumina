import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
export async function getUserProfile() {

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

const { data: { user } } = await supabase.auth.getUser();

if (!user) {

return null;
}




const { data: profile, error } = await supabase
.from('profiles')
.select('*')
.eq('id', user.id)
.maybeSingle();

const {data: addresses, error: addressError} = await supabase
.from('addresses')
.select('*')
.eq('profile_id', user.id)
.maybeSingle();

if (addressError) {
console.error('[getUserProfile] Erro ao buscar endereço:', addressError.message);
}

if (error) {
console.error('[getUserProfile] Erro ao buscar perfil:', error.message);
return user;
}

const sessionUser = {
...user,
...profile,
...addresses
};

return sessionUser;
}

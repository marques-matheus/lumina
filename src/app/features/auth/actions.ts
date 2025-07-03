'use server'
import { type FormState } from "@/types"; 
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'; 


export async function login(prevState: FormState, formData: FormData): Promise<FormState> {

  
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value; },
                set(name: string, value: string, options) { cookieStore.set({ name, value, ...options }); },
                remove(name: string, options) { cookieStore.set({ name, value: '', ...options }); },
               
            },
        }
    );

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { success: false, message: 'Email e senha são obrigatórios.' };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        
        return { success: false, message: 'Credenciais inválidas.' };
    }


    revalidatePath('/', 'layout');
    redirect('/'); 
}

export async function signup(prevState: FormState, formData: FormData): Promise<FormState> {
const cookieStore = await cookies();
const supabase = createServerClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
{
cookies: {
get(name: string) { return cookieStore.get(name)?.value; },
set(name: string, value: string, options) { cookieStore.set({ name, value, ...options }); },
remove(name: string, options) { cookieStore.set({ name, value: '', ...options }); },
},
}
);

const email = formData.get('email') as string;
const password = formData.get('password') as string;

if (!email || !password) {
    return { success: false, message: 'Email e senha são obrigatórios.' };
}
if (password.length < 6) {
    return { success: false, message: 'A senha precisa ter no mínimo 6 caracteres.' };
}
const { error } = await supabase.auth.signUp({
    email,
    password,
});
if (error) {
    
    if (error.message.includes('User already registered')) {
        return { success: false, message: 'Este email já está em uso.' };
    }
    console.error('Erro ao cadastrar usuário:', error.stack);
    return { success: false, message: `Erro no cadastro: ${error.message}` };
}

return { success: true, message: 'Cadastro realizado! Verifique seu e-mail para confirmar sua conta.' };
}


export async function completeOnboarding(prevState: FormState, formData: FormData): Promise<FormState> {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value; },
                set(name: string, value: string, options) { cookieStore.set({ name, value, ...options }); },
                remove(name: string, options) { cookieStore.set({ name, value: '', ...options }); },
            },
        }
    );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: 'Usuário não autenticado.' };
  }

    const companyName = formData.get('company_name') as string;
    const cnpj = formData.get('cnpj') as string;
    const services = formData.get('services') as string;
    const doesProvideService = formData.get('does_provide_services') === 'on';
    const street = formData.get('street') as string;
    const number = formData.get('number') as string;
    const complement = formData.get('complement') as string;
    const city = formData.get('city') as string;
    const neighborhood = formData.get('neighborhood') as string;
    const state = formData.get('state') as string;
    const zipCode = formData.get('zip_code') as string;

    if (!companyName || !cnpj || !services || !street || !number || !city || !neighborhood || !state || !zipCode) {
        return { success: false, message: 'Todos os campos são obrigatórios.' };
    }

    const servicesArray = services.split(',').map(service => service.trim());
    if (servicesArray.length === 0) {
        return { success: false, message: 'Você deve informar pelo menos um serviço.' };
    }

   const { error: profileError } = await supabase
    .from('profiles')
    .update({
      company_name: companyName,
      cnpj: cnpj,
      does_provide_service: doesProvideService,
      service_types: servicesArray,
      has_completed_onboarding: true, 
    })
    .eq('id', user.id);

  if (profileError) {
    return { success: false, message: `Erro ao atualizar perfil: ${profileError.message}` };
  }


  const { error: addressError } = await supabase
    .from('addresses')
    .insert({
      profile_id: user.id,
      street: street,
      "number": number,
      complement: complement,
      city: city,
      neighborhood: neighborhood,
      state: state,
      zip_code: zipCode,
    })
    .eq('profile_id', user.id);

  if (addressError) {
    return { success: false, message: `Erro ao atualizar endereço: ${addressError.message}` };
  }
    revalidatePath('/', 'layout');
    redirect('/');

}


export async function logout() {
const cookieStore = await cookies();
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name: string) { return cookieStore.get(name)?.value; },
      set(name: string, value: string, options) { cookieStore.set({ name, value, ...options }); },
      remove(name: string, options) { cookieStore.set({ name, value: '', ...options }); },
    },
  }
);

await supabase.auth.signOut();
redirect('/auth/login'); // Redireciona para a página de login após o logout
}

export async function updateProfile(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) { return (await cookies()).get(name)?.value; },
        async set(name: string, value: string, options) { (await cookies()).set({ name, value, ...options }); },
        async remove(name: string, options) { (await cookies()).set({ name, value: '', ...options }); },
      },
    }
  )

  const {data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return { success: false, message: `Erro ao obter usuário: ${userError.message}` };
  }

  const companyName = formData.get('company_name') as string;
  const cnpj = formData.get('cnpj') as string;
  const services = formData.get('services') as string;
  const doesProvideService = formData.get('does_provide_service') === 'on';
  const street = formData.get('street') as string;
  const number = formData.get('number') as string;
  const complement = formData.get('complement') as string;
  const city = formData.get('city') as string;
  const neighborhood = formData.get('neighborhood') as string;
  const state = formData.get('state') as string;
  const zipCode = formData.get('zip_code') as string;

  if (!companyName || !cnpj || !services || !street || !number || !city || !neighborhood || !state || !zipCode) {
      return { success: false, message: 'Todos os campos são obrigatórios.' };
  }

  const servicesArray = services.split(',').map(service => service.trim());
  if (servicesArray.length === 0) {
      return { success: false, message: ' Você deve informar pelo menos um serviço.' };
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      company_name: companyName,
      cnpj: cnpj,
      does_provide_service: doesProvideService,
      service_types: servicesArray,
      has_completed_onboarding: true,
    })
    .eq('id', user?.id);

  if (profileError) {
    return { success: false, message: `Erro ao atualizar perfil: ${profileError.message}` };
  }

  const { error: addressError } = await supabase
    .from('addresses')
    .upsert({
      profile_id: user?.id,
      street: street,
      "number": number,
      complement: complement,
      city: city,
      neighborhood: neighborhood,
      state: state,
      zip_code: zipCode,
    }, {onConflict: 'profile_id' }) // Garante que o endereço seja atualizado se já existir

  if (addressError) {
    return { success: false, message: `Erro ao atualizar endereço: ${addressError.message}` };
  }
  revalidatePath('/', 'layout');

  return { success: true, message: 'Perfil atualizado com sucesso!' };

  
}
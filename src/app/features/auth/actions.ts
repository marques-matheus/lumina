'use server'

import { type FormState } from "@/types"; 
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
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
    const cookieStore = cookies(); // Corrigido: sem await
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                async get(name: string) { return (await cookieStore).get(name)?.value; },
                async set(name: string, value: string, options) { (await cookieStore).set({ name, value, ...options }); },
                async remove(name: string, options) { (await cookieStore).set({ name, value: '', ...options }); },
            }
        }
    );

    const company_name = formData.get('company_name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
 
    const does_provide_service = formData.get('does_provide_service') === 'on';
    const service_types_raw = formData.get('service_types') as string;

    if (!company_name || !email || !password) {
        return { success: false, message: 'Nome da empresa, email e senha são obrigatórios.' };
    }
    
 
    const service_types = service_types_raw ? service_types_raw.split(',').map(s => s.trim()) : [];
   
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                company_name: company_name,
                
            }
        }
    });

    if (error) {
        return { success: false, message: `Erro no cadastro: ${error.message}` };
    }

    
    if (data.user) {
        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                does_provide_service,
                service_types
            })
            .eq('id', data.user.id);

        if (profileError) {
            return { success: false, message: `Erro ao salvar perfil: ${profileError.message}` };
        }
    }
    
    return { success: true, message: 'Cadastro realizado! Verifique seu e-mail para ativar sua conta.' };
}
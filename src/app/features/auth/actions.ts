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
    return { success: false, message: `Erro no cadastro: ${error.message}` };
}

return { success: true, message: 'Cadastro realizado! Verifique seu e-mail para confirmar sua conta.' };
}
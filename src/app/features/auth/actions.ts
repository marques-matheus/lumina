'use server'

import { type FormState } from "@/types"; // Importe seu tipo FormState
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'; // 1. Importe a função redirect

// Nome da função e parâmetros em camelCase
export async function login(prevState: FormState, formData: FormData): Promise<FormState> {

    // 2. Precisamos de 'await' para cookies()
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
        // Retornamos uma mensagem de erro mais amigável
        return { success: false, message: 'Credenciais inválidas.' };
    }

    // 3. Em caso de sucesso, revalidamos e redirecionamos
    revalidatePath('/', 'layout'); // Revalida todo o layout para atualizar o estado de login
    redirect('/'); // Envia o usuário para a página principal
}
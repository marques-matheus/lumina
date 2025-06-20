'use server'
import { supabase } from "@/lib/supabaseClient"
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { FormState } from "@/types";


export async function addClient(prevState: FormState, formData: FormData): Promise<FormState> {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;

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

    if (!name || !phone) {
        return { success: false, message: 'Dados inválidos.' };
    }

    const { error } = await supabase
    .from('clients').insert([{
        name,
        phone
    }]);

    if (error){
        return { success: false, message: `Erro ao adicionar cliente: ${error.message}` };
    }

    revalidatePath('/clients');
    return { success: true, message: 'Cliente adicionado com sucesso!' };
}

export async function updateClient(prevState: FormState, formData: FormData): Promise<FormState> {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;


    const {error} = await supabase
    .from('clients')
    .update({ name, phone })
    .match({ id: parseInt(id) });

    if (error){
        return { success: false, message: `Erro ao atualizar cliente: ${error.message}` };
    }

    revalidatePath('/clients');
    return { success: true, message: 'Cliente atualizado com sucesso!' };

}

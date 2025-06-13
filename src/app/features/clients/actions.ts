'use server'
import { supabase } from "@/lib/supabaseClient"
import { revalidatePath } from "next/cache";


type FormState = {
  success: boolean;
  message: string;
};


export async function addClient(prevState: FormState, formData: FormData): Promise<FormState> {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;

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

'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { FormState } from "@/types";
import { clientSchema } from '@/lib/schemas';

export async function addClient(prevState: FormState, formData: FormData): Promise<FormState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { return { success: false, message: 'Não autorizado' }; }

    const validatedFields = clientSchema.safeParse({
        name: formData.get('name'),
        phone: formData.get('phone'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: validatedFields.error.flatten().fieldErrors.name?.[0] || validatedFields.error.flatten().fieldErrors.phone?.[0] || 'Dados inválidos.'
        };
    }

    const { name, phone } = validatedFields.data;

    const { error } = await supabase
        .from('clients').insert([{
            name,
            phone,
            profile_id: user.id
        }]);

    if (error) {
        return { success: false, message: `Erro ao adicionar cliente: ${error.message}` };
    }

    revalidatePath('/clientes');
    return { success: true, message: 'Cliente adicionado com sucesso!' };
}

export async function updateClient(prevState: FormState, formData: FormData): Promise<FormState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { return { success: false, message: 'Não autorizado' }; }

    const id = formData.get('id') as string;

    const validatedFields = clientSchema.safeParse({
        name: formData.get('name'),
        phone: formData.get('phone'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: validatedFields.error.flatten().fieldErrors.name?.[0] || validatedFields.error.flatten().fieldErrors.phone?.[0] || 'Dados inválidos.'
        };
    }

    const { name, phone } = validatedFields.data;

    const { error } = await supabase
        .from('clients')
        .update({ name, phone })
        .match({ id: parseInt(id), profile_id: user.id });

    if (error) {
        return { success: false, message: `Erro ao atualizar cliente: ${error.message}` };
    }

    revalidatePath('/clientes');
    return { success: true, message: 'Cliente atualizado com sucesso!' };
}
'use server'

import { supabase } from "@/lib/supabaseClient"
import { revalidatePath } from "next/cache";


type FormState = {
  success: boolean;
  message: string;
};

export async function addServiceOrder(prevState: FormState, formData: FormData): Promise<FormState> {
    const clientId = formData.get('clientId') as string;
    const equip_brand = formData.get('equip_brand') as string;
    const equip_model = formData.get('equip_model') as string;
    const serial_number = formData.get('serial_number') as string;
    const problem_description = formData.get('problem_description') as string;
    const items = formData.get('items') as string;
    const type = formData.get('type') as string;
    const total = formData.get('total') as string;
    
    if (!clientId || !equip_brand || !equip_model || !serial_number || !problem_description || !type || !total ) {
        return { success: false, message: 'Preencha todos os campos obrigatórios.' };
    }
    const { error } = await supabase
    .from('service_orders').insert([{
        client_id: parseInt(clientId, 10),
        type,
        equip_brand,
        equip_model,
        serial_number,
        status: 'Aguardando Avaliação',
        items,
        problem_description,
        total: parseFloat(total) || 0,
    }]);


    if (error) {
        return { success: false, message: `Erro ao adicionar O.S.: ${error.message}` };
    }
    revalidatePath('/services');
    return { success: true, message: 'Nova Ordem de Serviço criada com sucesso!' };
}


export async function updateServiceOrder(prevState: FormState, formData: FormData): Promise<FormState> {
    const id = formData.get('id') as string;
    const equip_brand = formData.get('equip_brand') as string;
    const equip_model = formData.get('equip_model') as string;
    const serial_number = formData.get('serial_number') as string;
    const problem_description = formData.get('problem_description') as string;
    const items = formData.get('items') as string;
    const type = formData.get('type') as string;
    const total = formData.get('total') as string;
    
    const { error } = await supabase
    .from('service_orders')
    .update({
        equip_brand,
        equip_model,
        serial_number,
        problem_description,
        items,
        type,    
        total: parseFloat(total) || 0,
    })
    .match({ id: parseInt(id) });

    if (error) {
        return {success: false, message: `Erro ao atualizar O.S.: ${error.message}` };
    }

    revalidatePath('/services');
    return { success: true, message: 'Ordem de Serviço atualizada com sucesso!' };
}
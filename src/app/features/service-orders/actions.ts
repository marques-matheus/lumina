'use server'

import { revalidatePath } from "next/cache";
import { FormState } from "@/types";
import { createClient } from "@/lib/supabase/supabaseClient"; 


export async function addServiceOrder(prevState: FormState, formData: FormData): Promise<FormState> {
    const supabase = await createClient();
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { return { success: false, message: 'Não autorizado' }; }

    const { error } = await supabase
    .from('service_orders').insert([{
        client_id: parseInt(clientId, 10),
        profile_id: user.id,
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
const supabase = await createClient();

const { data: { user } } = await supabase.auth.getUser();
if (!user) {
    return { success: false, message: 'Não autorizado.' };
}
const orderId = formData.get('id') as string;
if (!orderId) {
    return { success: false, message: 'ID da O.S. em falta.' };
}
const { data: existingOrder, error: fetchError } = await supabase
    .from('service_orders')
    .select('profile_id')
    .eq('id', parseInt(orderId, 10))
    .single();
if (fetchError || !existingOrder) {
    return { success: false, message: 'Não foi possível encontrar a ordem de serviço.' };
}
if (user.id !== existingOrder.profile_id) {
    return { success: false, message: 'Você não tem permissão para editar esta ordem de serviço.' };
}
const updateData = {
    equip_brand: formData.get('equip_brand') as string,
    equip_model: formData.get('equip_model') as string,
    serial_number: formData.get('serial_number') as string,
    problem_description: formData.get('problem_description') as string,
    items: formData.get('items') as string,
    type: formData.get('type') as string,
    total: parseFloat(formData.get('total') as string) || 0,
};
const { data, error } = await supabase
    .from('service_orders')
    .update(updateData)
    .eq('id', parseInt(orderId, 10))
    .select('*, clients(name)')
    .single();
if (error) {
    return { success: false, message: `Erro ao atualizar O.S.: ${error.message}` };
}
revalidatePath('/services');
return { success: true, message: 'Ordem de Serviço atualizada com sucesso!', updatedOrder: data };
}



export async function updateOrderStatus(orderId: number, newStatus: string) {
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
throw new Error('Não autorizado');
}

const { data, error } = await supabase
.from('service_orders')
.update({ status: newStatus })
.eq('id', orderId)
.select('*, clients(name)') 
.single();

if (error) {
throw new Error(`Erro ao atualizar o status: ${error.message}`);
}

revalidatePath('/services');
return data;
}
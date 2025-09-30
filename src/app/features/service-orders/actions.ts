'use server'


import { ServiceOrder } from "@/types";
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { FormState } from "@/types";
import { serviceOrderSchema, serviceOrderStatusSchema } from "@/lib/schemas";
import { z } from "zod";

export async function addServiceOrder(prevState: FormState, formData: FormData): Promise<FormState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { return { success: false, message: 'Não autorizado' }; }

    const validatedFields = serviceOrderSchema.safeParse({
        clientId: formData.get('clientId'),
        equip_brand: formData.get('equip_brand'),
        equip_model: formData.get('equip_model'),
        serial_number: formData.get('serial_number'),
        problem_description: formData.get('problem_description'),
        items: formData.get('items'),
        type: formData.get('type'),
        total: formData.get('total'),
    });

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        const firstError = Object.values(errors)[0]?.[0];
        return {
            success: false,
            message: firstError || 'Dados inválidos.'
        };
    }

    const { clientId, equip_brand, equip_model, serial_number, problem_description, items, type, total } = validatedFields.data;

    const { error } = await supabase
    .from('service_orders').insert([{
        client_id: clientId,
        profile_id: user.id,
        type,
        equip_brand,
        equip_model,
        serial_number,
        status: 'Aguardando Avaliação',
        items,
        problem_description,
        total,
    }]);


    if (error) {
        return { success: false, message: `Erro ao adicionar O.S.: ${error.message}` };
    }
    revalidatePath('/servicos');
    return { success: true, message: 'Nova Ordem de Serviço criada com sucesso!' };
}


export async function updateServiceOrder(prevState: FormState, formData: FormData): Promise<FormState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { return { success: false, message: 'Não autorizado' }; }

    const id = formData.get('id') as string;
    const validatedId = z.coerce.number().int().positive().safeParse(id);

    if (!validatedId.success) {
        return { success: false, message: 'ID da ordem de serviço inválido.' };
    }

    const validatedFields = serviceOrderSchema.partial().safeParse({
        equip_brand: formData.get('equip_brand'),
        equip_model: formData.get('equip_model'),
        serial_number: formData.get('serial_number'),
        problem_description: formData.get('problem_description'),
        items: formData.get('items'),
        type: formData.get('type'),
        total: formData.get('total'),
    });

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        const firstError = Object.values(errors)[0]?.[0];
        return {
            success: false,
            message: firstError || 'Dados inválidos.'
        };
    }

    const { data, error } = await supabase
    .from('service_orders')
    .update(validatedFields.data)
    .match({ id: validatedId.data, profile_id: user.id })
    .select(`*, clients(name)`) 
    .maybeSingle();

    if (error) {
        return {success: false, message: `Erro ao atualizar O.S.: ${error.message}`, updatedOrder: undefined};
    }

    revalidatePath('/servicos');
    return { success: true, message: 'Ordem de Serviço atualizada com sucesso!', updatedOrder: data};
}
export async function updateOrderStatus(orderId: number, newStatus: string): Promise<ServiceOrder> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Não autorizado');
    }

    const validatedId = z.number().int().positive().safeParse(orderId);
    const validatedStatus = serviceOrderStatusSchema.safeParse(newStatus);

    if (!validatedId.success) {
        throw new Error('ID da ordem de serviço inválido');
    }
    if (!validatedStatus.success) {
        throw new Error('Status inválido');
    }

    const { data: currentOrder, error: fetchError } = await supabase
        .from('service_orders')
        .select('status')
        .match({ id: validatedId.data, profile_id: user.id }) 
        .single();

    if (fetchError) {
        throw new Error("Ordem de serviço não encontrada ou você não tem permissão para a ver.");
    }
    
    const isFinalStatus = currentOrder.status === 'Entregue' || currentOrder.status === 'Cancelado';
    if (isFinalStatus) {
        throw new Error("Não é possível alterar o status de uma ordem finalizada.");
    }
    const isRevertingFromCompleted = currentOrder.status === 'Concluído' && validatedStatus.data !== 'Entregue';
    if (isRevertingFromCompleted) {
        throw new Error("Uma ordem concluída só pode ser marcada como 'Entregue'.");
    }
   

    const updateData: { status: string; completed_at?: string; delivered_at?: string } = {
        status: validatedStatus.data,
    };

    if (validatedStatus.data === 'Concluído') {
        updateData.completed_at = new Date().toISOString();
    }
    if (validatedStatus.data === 'Entregue') {
        updateData.delivered_at = new Date().toISOString();
    }

    const { data, error } = await supabase
        .from('service_orders')
        .update(updateData)
        .match({ id: validatedId.data, profile_id: user.id })
        .select('*, clients(name)')
        .single();

    if (error) {
        throw new Error(`Erro ao atualizar status: ${error.message}`);
    }

    revalidatePath('/servicos');
    revalidatePath('/'); 
    return data;
}
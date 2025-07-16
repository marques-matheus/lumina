'use server'

import { supabase } from "@/lib/supabaseClient"
import { ServiceOrder } from "@/types";
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { FormState } from "@/types";

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
    const id = formData.get('id') as string;
    const equip_brand = formData.get('equip_brand') as string;
    const equip_model = formData.get('equip_model') as string;
    const serial_number = formData.get('serial_number') as string;
    const problem_description = formData.get('problem_description') as string;
    const items = formData.get('items') as string;
    const type = formData.get('type') as string;
    const total = formData.get('total') as string;
    
    const { data, error } = await supabase
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
    .match({ id: parseInt(id) })
    .select(`*, clients(name)`) // Pedimos os dados completos de volta;
    .maybeSingle();

    if (error) {
        return {success: false, message: `Erro ao atualizar O.S.: ${error.message}`, updatedOrder: undefined};
    }

    revalidatePath('/services');
    return { success: true, message: 'Ordem de Serviço atualizada com sucesso!', updatedOrder: data};
}
// Nova ação, dedicada apenas a mudar o status
export async function updateOrderStatus(orderId: number, newStatus: string): Promise<ServiceOrder> {
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
        throw new Error('Não autorizado');
    }

    const { data, error } = await supabase
        .from('service_orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .select('*, clients(name)')
        .single();

    if (error) {
        throw new Error(`Erro ao atualizar status: ${error.message}`);
    }

    revalidatePath('/services');
    return data;
}
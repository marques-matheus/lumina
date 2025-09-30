'use server'
import { type FormState } from "@/types";
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { purchaseSchema } from "@/lib/schemas";

export async function createPurchase(prevState: FormState, formData: FormData): Promise<FormState> {

const supabase = await createClient();


const { data: { user } } = await supabase.auth.getUser();
if (!user) {
    return { success: false, message: 'Não autorizado.' };
}

const validatedFields = purchaseSchema.safeParse({
    product_id: formData.get('product_id'),
    quantity: formData.get('quantity'),
    cost_per_unit: formData.get('cost_per_unit'),
    purchase_date: formData.get('purchase_date'),
    supplier: formData.get('supplier'),
});

if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errors)[0]?.[0];
    return {
        success: false,
        message: firstError || 'Dados inválidos.'
    };
}

const { product_id, quantity, cost_per_unit, purchase_date, supplier } = validatedFields.data;

const { error } = await supabase.rpc('create_new_purchase', {
    p_profile_id: user.id,
    p_product_id: product_id,
    p_quantity: quantity,
    p_cost_per_unit: cost_per_unit,
    p_supplier: supplier,
    p_purchase_date: purchase_date.toISOString()
});

if (error) {
    console.error("Erro na transação de compra:", error);
    return { success: false, message: 'Ocorreu um erro ao registrar a compra.' };
}
revalidatePath('/compras');
revalidatePath('/');
return { success: true, message: 'Compra registrada com sucesso!' };
}
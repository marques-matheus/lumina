'use server'
import { type FormState } from "@/types";
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createPurchase(prevState: FormState, formData: FormData): Promise<FormState> {

const supabase = await createClient();


const { data: { user } } = await supabase.auth.getUser();
if (!user) {
    return { success: false, message: 'Não autorizado.' };
}
// --- CORREÇÃO NA EXTRAÇÃO DOS DADOS ---
// 1. Lemos 'product_id', que é o que o nosso formulário envia.
const productId = formData.get('product_id') as string; 
const quantity = formData.get('quantity') as string;
const costPerUnit = formData.get('cost_per_unit') as string;
const purchaseDate = formData.get('purchase_date') as string;
const supplier = formData.get('supplier') as string;
if(!productId || !quantity || !costPerUnit || !purchaseDate) {
    return { success: false, message: 'Produto, quantidade, custo e data são obrigatórios.' };
}
// --- CORREÇÃO NA CHAMADA RPC ---
// 2. Passamos os parâmetros com os nomes e tipos exatos que a nossa função no BD espera.
const { error } = await supabase.rpc('create_new_purchase', {
    p_profile_id: user.id,
    p_product_id: parseInt(productId, 10),
    p_quantity: parseInt(quantity, 10),
    p_cost_per_unit: parseFloat(costPerUnit),
    p_supplier: supplier,
    p_purchase_date: new Date(purchaseDate).toISOString()
});
if (error) {
    console.error("Erro na transação de compra:", error);
    return { success: false, message: 'Ocorreu um erro ao registrar a compra.' };
}
revalidatePath('/compras');
revalidatePath('/');
return { success: true, message: 'Compra registrada com sucesso!' };
}
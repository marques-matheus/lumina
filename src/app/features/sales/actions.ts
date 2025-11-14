'use server'
import { type FormState } from "@/types";
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { saleSchema, cancelSaleSchema } from "@/lib/schemas";

export async function createSale(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: 'Não autorizado. Faça login para continuar.' };
  }

  const validatedFields = saleSchema.safeParse({
    cartItems: formData.get('cartItems'),
    totalAmount: formData.get('totalAmount'),
    discountAmount: formData.get('discountAmount'),
    clientId: formData.get('clientId'),
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errors)[0]?.[0];
    return {
        success: false,
        message: firstError || 'Dados da venda inválidos.'
    };
  }

  const { totalAmount, discountAmount, clientId } = validatedFields.data;
  // The cartItems are validated as a string, now we can safely parse it.
  const cartItems = JSON.parse(validatedFields.data.cartItems);

  const itemsForDb = cartItems.map((item: any) => ({
      product_id: item.product.id,
      quantity: item.quantity,
      sale_price: item.product.sale_price
  }));

 
  const { data: saleId, error } = await supabase.rpc('create_new_sale', {
      p_profile_id: user.id,
      p_client_id: clientId,
      p_total_amount: totalAmount,
      p_discount_amount: discountAmount,
      p_cart_items: itemsForDb
  });

  if (error) {
      console.error('Erro na transação de venda:', error);
      return { success: false, message: `Erro ao criar venda: ${error.message}` };
  }

  revalidatePath('/vendas'); // Atualiza a futura página de histórico de vendas
  revalidatePath('/');     // E a de produtos, pois o estoque mudou

  return { success: true, message: `Venda #${saleId} criada com sucesso!` };
}

export async function cancelSale(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, message: 'Não autorizado. Faça login para continuar.' };
  }

  const validatedFields = cancelSaleSchema.safeParse({
    saleId: formData.get('saleId'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errors)[0]?.[0];
    return {
        success: false,
        message: firstError || 'Dados inválidos.'
    };
  }

  const { saleId, password } = validatedFields.data;

  // TODO: Implementar verificação de senha de forma mais segura
  // Por enquanto, apenas verificamos se a senha foi fornecida
  if (!password || password.length < 6) {
    return { success: false, message: 'Senha inválida. Digite sua senha para confirmar o cancelamento.' };
  }

  // Verificar se a venda pertence ao usuário
  const { data: sale, error: saleError } = await supabase
    .from('sales')
    .select('*, sale_items(product_id, quantity)')
    .eq('id', saleId)
    .eq('profile_id', user.id)
    .single();

  if (saleError || !sale) {
    return { success: false, message: 'Venda não encontrada.' };
  }

  // Restaurar estoque dos produtos
  for (const item of sale.sale_items) {
    const { error: updateError } = await supabase.rpc('increment_product_quantity', {
      p_product_id: item.product_id,
      p_quantity: item.quantity
    });

    if (updateError) {
      console.error('Erro ao restaurar estoque:', updateError);
      return { success: false, message: 'Erro ao restaurar estoque dos produtos.' };
    }
  }

  // Deletar itens da venda
  const { error: deleteItemsError } = await supabase
    .from('sale_items')
    .delete()
    .eq('sale_id', saleId);

  if (deleteItemsError) {
    return { success: false, message: 'Erro ao cancelar itens da venda.' };
  }

  // Deletar a venda
  const { error: deleteSaleError } = await supabase
    .from('sales')
    .delete()
    .eq('id', saleId);

  if (deleteSaleError) {
    return { success: false, message: 'Erro ao cancelar a venda.' };
  }

  revalidatePath('/vendas');
  revalidatePath('/');

  return { success: true, message: `Venda #${saleId} cancelada com sucesso!` };
}
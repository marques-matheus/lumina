'use server'
import { type FormState } from "@/types";
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createSale(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: 'Não autorizado. Faça login para continuar.' };
  }

  const cartItemsRaw = formData.get('cartItems') as string;
  const totalAmountRaw = formData.get('totalAmount') as string;
  const clientIdRaw = formData.get('clientId') as string; // O ID do cliente, se houver

  if (!cartItemsRaw || !totalAmountRaw) {
    return { success: false, message: 'Dados da venda incompletos.' };
  }
  const cartItems = JSON.parse(cartItemsRaw);
  if (cartItems.length === 0) {
    return { success: false, message: 'O carrinho não pode estar vazio.' };
  }
  const totalAmount = parseFloat(totalAmountRaw);
  const clientId = clientIdRaw ? parseInt(clientIdRaw) : null;

  const itemsForDb = cartItems.map((item: any) => ({
      product_id: item.product.id,
      quantity: item.quantity,
      sale_price: item.product.sale_price
  }));

 
  const { data: saleId, error } = await supabase.rpc('create_new_sale', {
      p_profile_id: user.id,
      p_client_id: clientId,
      p_total_amount: totalAmount,
      p_cart_items: itemsForDb
  });

  if (error) {
      console.error('Erro na transação de venda:', error);
      return { success: false, message: 'Ocorreu um erro ao processar a venda. O estoque não foi alterado.' };
  }

  revalidatePath('/sales'); // Atualiza a futura página de histórico de vendas
  revalidatePath('/');     // E a de produtos, pois o estoque mudou

  return { success: true, message: `Venda #${saleId} criada com sucesso!` };
}
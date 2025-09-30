'use server'
import { type FormState } from "@/types";
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { saleSchema } from "@/lib/schemas";

export async function createSale(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: 'Não autorizado. Faça login para continuar.' };
  }

  const validatedFields = saleSchema.safeParse({
    cartItems: formData.get('cartItems'),
    totalAmount: formData.get('totalAmount'),
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

  const { totalAmount, clientId } = validatedFields.data;
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
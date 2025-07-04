'use server'
import { type FormState } from "@/types";
import { createServerClient } from '@supabase/ssr'; // Usando o nosso padrão
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function createSale(prevState: FormState, formData: FormData): Promise<FormState> {
  // 1. Criamos o cliente Supabase para Server Actions
const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
      }
    }
  );
  
  // 2. Pegamos o utilizador logado para saber quem está a fazer a venda
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: 'Não autorizado. Faça login para continuar.' };
  }

  // 3. Recolhemos os dados que o nosso componente de UI enviou
  const cartItemsRaw = formData.get('cartItems') as string;
  const totalAmountRaw = formData.get('totalAmount') as string;
  const clientIdRaw = formData.get('clientId') as string; // O ID do cliente, se houver

  // 4. Preparamos os dados para enviar para o nosso "motor"
  if (!cartItemsRaw || !totalAmountRaw) {
    return { success: false, message: 'Dados da venda incompletos.' };
  }
  const cartItems = JSON.parse(cartItemsRaw);
  if (cartItems.length === 0) {
    return { success: false, message: 'O carrinho não pode estar vazio.' };
  }
  const totalAmount = parseFloat(totalAmountRaw);
  const clientId = clientIdRaw ? parseInt(clientIdRaw) : null;

  // Limpamos os dados do carrinho para enviar apenas o necessário para o banco de dados
  const itemsForDb = cartItems.map((item: any) => ({
      product_id: item.product.id,
      quantity: item.quantity,
      sale_price: item.product.sale_price
  }));

  // 5. APERTAMOS O BOTÃO: Chamamos o nosso "motor" com .rpc()
  // '.rpc' significa "Remote Procedure Call", ou seja, "executar uma receita no banco de dados".
  const { data: saleId, error } = await supabase.rpc('create_new_sale', {
      p_profile_id: user.id,
      p_client_id: clientId,
      p_total_amount: totalAmount,
      p_cart_items: itemsForDb
  });

  // 6. Lidamos com o resultado
  if (error) {
      console.error('Erro na transação de venda:', error);
      return { success: false, message: 'Ocorreu um erro ao processar a venda. O estoque não foi alterado.' };
  }

  revalidatePath('/sales'); // Atualiza a futura página de histórico de vendas
  revalidatePath('/');     // E a de produtos, pois o estoque mudou

  // Retornamos sucesso, incluindo o ID da venda que o nosso "motor" nos devolveu.
  return { success: true, message: `Venda #${saleId} criada com sucesso!` };
}
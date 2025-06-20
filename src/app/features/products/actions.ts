'use server'
import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { FormState } from '@/types';

export async function addProduct(prevState: FormState, formData: FormData): Promise<FormState> {
 const name = formData.get('name') as string;
 const quantity = formData.get('quantity') as string;
 const description = formData.get('description') as string;
 const salePrice = formData.get('sale_price') as string;
 const brand = formData.get('brand') as string;

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

 if(!name || !quantity || !salePrice || !description || !brand) {
  return { success: false, message: 'Dados inválidos.' };
}


 const { error } = await supabase.from('products').insert([{
    name,
    quantity: parseInt(quantity),
    description,
    brand,
    sale_price: parseFloat(salePrice),
 }]);

 if (error) {
   throw new Error(`Erro ao adicionar produto: ${error.message}`);
 }
 revalidatePath('/products');
 return { success: true, message: 'Produto adicionado com sucesso!' };
}

export async function deleteProduct(productId: number){
  const {error } = await supabase
    .from('products')
    .update({ is_active: false, quantity: 0 })
    .match({ id: productId });
  if (error) {
    throw new Error(`Erro ao deletar produto: ${error.message}`);
  }
  revalidatePath('/products');
  return { success: true, message: 'Produto deletado com sucesso!' };
}

export async function updateProduct(prevState: FormState, formData: FormData): Promise<FormState> {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const quantity = formData.get('quantity') as string;
  const description = formData.get('description') as string;
  const salePrice = formData.get('sale_price') as string;
  const brand = formData.get('brand') as string;

  if(!name || !quantity || !salePrice || !id || !description || !brand) {
    return { success: false, message: 'Dados inválidos.' };
  }

  const { error } = await supabase
    .from('products')
    .update({
      name,
      quantity: parseInt(quantity),
      description,
      brand,
      sale_price: parseFloat(salePrice),
    })
    .match({ id: parseInt(id, 10) });

    if (error) {
      console.error('Erro ao atualizar produto:', error);
      return { success: false, message: 'Não foi possível atualizar o produto.' };
    }
  
    // 5. Revalidamos o caminho CORRETO e retornamos o sucesso
    revalidatePath('/');
    return { success: true, message: 'Produto atualizado com sucesso!' };
  }
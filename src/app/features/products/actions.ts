'use server'
import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

type FormState = {
    success: boolean;
    message: string;
  };
export async function addProduct(prevState: FormState, formData: FormData): Promise<FormState> {
 const name = formData.get('name') as string;
 const quantity = formData.get('quantity') as string;
 const description = formData.get('description') as string;
 const salePrice = formData.get('sale_price') as string;
 const brand = formData.get('brand') as string;


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

'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { FormState } from '@/types';
import { productSchema } from '@/lib/schemas';
import { z } from 'zod';

export async function addProduct(prevState: FormState, formData: FormData): Promise<FormState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { return { success: false, message: 'Não autorizado' }; }

    const validatedFields = productSchema.safeParse({
        name: formData.get('name'),
        quantity: formData.get('quantity'),
        description: formData.get('description'),
        sale_price: formData.get('sale_price'),
        brand: formData.get('brand'),
    });

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        const firstError = Object.values(errors)[0]?.[0];
        return {
            success: false,
            message: firstError || 'Dados inválidos.'
        };
    }

    const { name, quantity, description, sale_price, brand } = validatedFields.data;

    const { error } = await supabase.from('products').insert([{
        name,
        quantity,
        profile_id: user.id,
        description,
        brand,
        sale_price,
        is_active: quantity > 0, // Se quantidade for 0, is_active é false
    }]);

    if (error) {
        return { success: false, message: `Erro ao adicionar produto: ${error.message}` };
    }
    revalidatePath('/produtos');
    return { success: true, message: 'Produto adicionado com sucesso!' };
}

export async function deleteProduct(productId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Não autorizado');
    }

    const validatedId = z.number().int().positive().safeParse(productId);
    if (!validatedId.success) {
        throw new Error('ID do produto inválido');
    }

    const { error } = await supabase
        .from('products')
        .update({ is_active: false, quantity: 0 })
        .match({ id: validatedId.data, profile_id: user.id });

    if (error) {
        throw new Error(`Erro ao deletar produto: ${error.message}`);
    }
    revalidatePath('/produtos');
    return { success: true, message: 'Produto deletado com sucesso!' };
}

export async function updateProduct(prevState: FormState, formData: FormData): Promise<FormState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { return { success: false, message: 'Não autorizado' }; }

    const id = formData.get('id') as string;
    const validatedId = z.coerce.number().int().positive().safeParse(id);

    if (!validatedId.success) {
        return { success: false, message: 'ID do produto inválido.' };
    }

    const validatedFields = productSchema.safeParse({
        name: formData.get('name'),
        quantity: formData.get('quantity'),
        description: formData.get('description'),
        sale_price: formData.get('sale_price'),
        brand: formData.get('brand'),
    });

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        const firstError = Object.values(errors)[0]?.[0];
        return {
            success: false,
            message: firstError || 'Dados inválidos.'
        };
    }

    const { name, quantity, description, sale_price, brand } = validatedFields.data;

    const { error } = await supabase
        .from('products')
        .update({
            name,
            quantity,
            description,
            brand,
            sale_price,
            is_active: quantity > 0, // Se quantidade for 0, is_active é false
        })
        .match({ id: validatedId.data, profile_id: user.id });

    if (error) {
        console.error('Erro ao atualizar produto:', error);
        return { success: false, message: 'Não foi possível atualizar o produto.' };
    }

    revalidatePath('/produtos');
    return { success: true, message: 'Produto atualizado com sucesso!' };
}

'use server'
import { type FormState } from "@/types";
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { loginSchema, registerFormSchema, profileFormSchema } from '@/lib/schemas';

export async function login(prevState: FormState, formData: FormData): Promise<FormState> {
    const supabase = await createClient();

    const validatedFields = loginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: validatedFields.error.flatten().fieldErrors.email?.[0] || validatedFields.error.flatten().fieldErrors.password?.[0] || 'Dados inválidos.'
        };
    }

    const { email, password } = validatedFields.data;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        return { success: false, message: 'Credenciais inválidas.' };
    }

    revalidatePath('/', 'layout');
    redirect('/');
}

export async function signup(prevState: FormState, formData: FormData): Promise<FormState> {
    const supabase = await createClient();

    const validatedFields = registerFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        confirm_password: formData.get('confirm_password')
    });

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        return {
            success: false,
            message: errors.email?.[0] || errors.password?.[0] || errors.confirm_password?.[0] || 'Dados inválidos.'
        };
    }

    const { email, password } = validatedFields.data;

    const { error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        if (error.message.includes('User already registered')) {
            return { success: false, message: 'Este email já está em uso.' };
        }
        console.error('Erro ao cadastrar usuário:', error.stack);
        return { success: false, message: `Erro no cadastro: ${error.message}` };
    }

    redirect('/auth/agradecimento');
}


export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/auth/login');
}

export async function updateProfile(prevState: FormState, formData: FormData): Promise<FormState> {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { success: false, message: `Erro ao obter usuário: ${userError?.message}` };
    }

    const validatedFields = profileFormSchema.safeParse({
        company_name: formData.get('company_name'),
        cnpj: formData.get('cnpj'),
        zip_code: formData.get('zip_code'),
        street: formData.get('street'),
        number: formData.get('number'),
        neighborhood: formData.get('neighborhood'),
        city: formData.get('city'),
        state: formData.get('state'),
        complement: formData.get('complement'),
        does_provide_service: formData.get('does_provide_service') === 'true',
        service_types: formData.get('service_types'),
    });

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        const firstError = Object.values(errors)[0]?.[0];
        return {
            success: false,
            message: firstError || 'Dados inválidos.'
        };
    }
    
    const { company_name, cnpj, does_provide_service, service_types, street, number, complement, city, neighborhood, state, zip_code } = validatedFields.data;

    let servicesArray: string[] = [];
    if (does_provide_service && service_types) {
        servicesArray = service_types.split(',').map(service => service.trim());
    }

    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            company_name,
            cnpj,
            does_provide_service,
            service_types: servicesArray,
            has_completed_onboarding: true,
        })
        .eq('id', user.id);

    if (profileError) {
        return { success: false, message: `Erro ao atualizar perfil: ${profileError.message}` };
    }

    const { error: addressError } = await supabase
        .from('addresses')
        .upsert({
            profile_id: user.id,
            street,
            "number": number,
            complement,
            city,
            neighborhood,
            state,
            zip_code,
        }, { onConflict: 'profile_id' })

    if (addressError) {
        return { success: false, message: `Erro ao atualizar endereço: ${addressError.message}` };
    }
    revalidatePath('/', 'layout');

    return { success: true, message: 'Perfil atualizado com sucesso!' };
}

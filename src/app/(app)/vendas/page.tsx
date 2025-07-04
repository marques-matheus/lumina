export const dynamic = 'force-dynamic'
import AddSellDialog from "@/app/features/sells/components/AddSellDialog";
import { PageProps } from '@/types';
import { createServerClient } from '@supabase/ssr';
import { Metadata, ResolvingMetadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function generateMetadata(
    { params, searchParams }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    return {
        title: 'Lúmina - Vendas',
        description: 'Gerencie suas vendas com facilidade',
    };
}


export default async function SellsPage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: cookieStore.getAll,
            },
        }
    );
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    const { data: products } = await supabase
        .from('products')
        .select('id, name, description, brand, quantity, sale_price, is_active')
        .eq('profile_id', user.id)
        .eq('is_active', true)

    const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .eq('profile_id', user.id)
        .order('id', { ascending: true });




    return (

        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Vendas</h1>
                <AddSellDialog products={products || []} clients={clients || []} />
            </div>
        </div>
    );
}
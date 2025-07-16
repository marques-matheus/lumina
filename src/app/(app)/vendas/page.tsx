export const dynamic = 'force-dynamic'
import AddSaleDialog from "@/app/features/sales/components/AddSaleDialog";
import SalesTable from "@/app/features/sales/components/SalesTable";
import { PageProps } from '@/types';
import { Metadata, ResolvingMetadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Lúmina - Vendas',
        description: 'Gerencie suas vendas com facilidade',
    };
}


export default async function SalesPage() {
    const supabase = await createClient();
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

    const { data: salesHistory } = await supabase
        .from('sales')
        .select('*, clients(*), sale_items(*, products(*))')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });

    return (

        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Vendas</h1>
                <AddSaleDialog products={products || []} clients={clients || []} />
            </div>
            <SalesTable sales={salesHistory || []} />
        </div>
    );
}
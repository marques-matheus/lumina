import AddPurchaseDialog from "@/app/features/purchases/components/AddPurchaseDialog";
import PurchasesTable from "@/app/features/purchases/components/PurchasesTable";
import { PageProps } from "@/types";
import { ResolvingMetadata, Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Heading from "@/components/shared/Heading";

export async function generateMetadata(
    { params, searchParams }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const resolvedSearchParams = await searchParams;
    const searchTerm = (resolvedSearchParams?.search as string) || '';
    return {
        title: 'Lúmina - Compras',
        description: searchTerm
            ? `Resultados para "${searchTerm}"`
            : 'Gerencie suas compras com facilidade',
    };
}

export default async function PurchasesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/auth/login');
    }


    const { data: purchases } = await supabase
        .from('purchases')
        .select(`
            *,
            products (name, brand)
        `)
        .eq('profile_id', user.id)
        .order('purchase_date', { ascending: false });

    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('profile_id', user.id)
        .order('name', { ascending: true });

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <Heading title="Compras" subtitle="Gerencie suas compras com facilidade" />
                <AddPurchaseDialog products={products || []} />
            </div>
            <PurchasesTable purchases={purchases || []} />
        </div>
    );
}
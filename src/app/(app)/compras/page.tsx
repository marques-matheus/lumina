import AddPurchaseDialog from "@/app/features/purchases/components/AddPurchaseDialog";
import PurchasesTable from "@/app/features/purchases/components/PurchasesTable";
import { PageProps } from "@/types";
import { createServerClient } from "@supabase/ssr";
import { ResolvingMetadata, Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
                <h1 className="text-lg font-semibold">Minhas Compras</h1>
                <AddPurchaseDialog products={products || []} />
            </div>
            <PurchasesTable purchases={purchases || []} />
        </div>
    );
}
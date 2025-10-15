import AddPurchaseDialog from "@/app/features/purchases/components/AddPurchaseDialog";
import PurchasesTable from "@/app/features/purchases/components/PurchasesTable";
import { PageProps, type Purchase } from "@/types";
import { ResolvingMetadata, Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Heading from "@/components/shared/Heading";
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import SearchInput from '@/components/shared/SearchInput';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CategoryFilter } from '@/components/shared/CategoryFilter';

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

// Paginação no padrão Produtos
function PaginationControls({ hasNextPage, hasPrevPage, totalCount, pageSize, currentPage }: { hasNextPage: boolean, hasPrevPage: boolean, totalCount: number, pageSize: number, currentPage: number }) {
    const totalPages = Math.ceil(totalCount / pageSize);
    return (
        <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}. Total de {totalCount} compras.
            </div>
            <div className="flex items-center gap-2">
                <Link href={`/compras?page=${currentPage - 1}`} passHref>
                    <Button variant="outline" size="sm" disabled={!hasPrevPage}>
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Anterior
                    </Button>
                </Link>
                <Link href={`/compras?page=${currentPage + 1}`} passHref>
                    <Button variant="outline" size="sm" disabled={!hasNextPage}>
                        Próximo
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default async function PurchasesPage({ searchParams }: PageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/auth/login');
    }

    const resolvedSearchParams = await searchParams;
    const searchTerm = (resolvedSearchParams?.search as string) || '';
    const supplierFilter = (resolvedSearchParams?.supplier as string) || '';
    const page = parseInt((resolvedSearchParams?.page as string) || '1', 10);
    const pageSize = 15;

    // Query de compras com count e join básico para exibir produto
    let purchasesQuery = supabase
        .from('purchases')
        .select('id, supplier, purchase_date, cost_per_unit, quantity, products(name, brand)', { count: 'exact' })
        .eq('profile_id', user.id);

    if (searchTerm) {
        purchasesQuery = purchasesQuery.ilike('supplier', `%${searchTerm}%`);
    }
    if (supplierFilter) {
        purchasesQuery = purchasesQuery.eq('supplier', supplierFilter);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    purchasesQuery = purchasesQuery.range(from, to).order('purchase_date', { ascending: false });

    const { data: purchases, count } = await purchasesQuery;
    const normalizedPurchases: Purchase[] = (purchases || []).map((p: any) => ({
        ...p,
        products: Array.isArray(p.products) ? p.products[0] : p.products,
    }));

    // Produtos para o diálogo de adicionar
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('profile_id', user.id)
        .order('name', { ascending: true });

    // Fornecedores únicos para filtro
    const { data: suppliersRaw } = await supabase
        .from('purchases')
        .select('supplier')
        .not('supplier', 'is', null)
        .neq('supplier', '')
        .eq('profile_id', user.id);

    const uniqueSuppliers = suppliersRaw ? Array.from(new Set(suppliersRaw.map(s => s.supplier))) : [];

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return (
        <div className="flex flex-col gap-6">
            <Heading title="Compras" subtitle="Gerencie suas compras com facilidade" />
            <Card>
                <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className='flex flex-col md:flex-row items-center gap-4'>
                        <SearchInput placeholder="Buscar compra por fornecedor..." />
                        <CategoryFilter title="Filtrar por Fornecedor" paramName="supplier" options={uniqueSuppliers} />
                    </div>
                    <AddPurchaseDialog products={products || []} />
                </CardHeader>
                <CardContent>
                    <PurchasesTable purchases={normalizedPurchases} allProducts={products || []} />
                </CardContent>
                {totalCount > pageSize && (
                    <CardFooter>
                        <PaginationControls
                            hasNextPage={hasNextPage}
                            hasPrevPage={hasPrevPage}
                            totalCount={totalCount}
                            pageSize={pageSize}
                            currentPage={page}
                        />
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
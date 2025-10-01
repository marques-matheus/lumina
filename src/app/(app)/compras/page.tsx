export const dynamic = 'force-dynamic'
import AddPurchaseDialog from "@/app/features/purchases/components/AddPurchaseDialog";
import PurchasesTable from "@/app/features/purchases/components/PurchasesTable";
import { PageProps } from "@/types";
import { ResolvingMetadata, Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Heading from "@/components/shared/Heading";
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { CategoryFilter } from '@/components/shared/CategoryFilter';
import SearchInput from '@/components/shared/SearchInput';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DatePickerWithRange } from '@/components/shared/DateFilter';

// Custom Pagination Component
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

export default async function PurchasesPage({ searchParams }: PageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/auth/login');
    }

    const resolvedSearchParams = await searchParams;
    const searchTerm = (resolvedSearchParams?.search as string) || '';
    const supplierFilter = (resolvedSearchParams?.supplier as string) || '';
    const fromDate = (resolvedSearchParams?.from as string) || '';
    const toDate = (resolvedSearchParams?.to as string) || '';
    const page = parseInt((resolvedSearchParams?.page as string) || '1', 10);
    const pageSize = 15; // Items per page set to 15

    // Base query
    let query = supabase
        .from('purchases')
        .select('*, products (name, brand)', { count: 'exact' })
        .eq('profile_id', user.id);

    // Apply filters
    if (searchTerm) {
        query = query.ilike('products.name', `%${searchTerm}%`);
    }
    if (supplierFilter) {
        query = query.eq('supplier', supplierFilter);
    }
    if (fromDate) {
        query = query.gte('purchase_date', fromDate);
    }
    if (toDate) {
        query = query.lte('purchase_date', toDate);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to).order('purchase_date', { ascending: false });

    // Fetch paginated data and count
    const { data: purchases, count } = await query;

    // Fetch unique suppliers for the filter dropdown
    const { data: PurchasesForSuppliers } = await supabase
        .from('purchases')
        .select('supplier')
        .not('supplier', 'is', null)
        .eq('profile_id', user.id);
        
    const uniqueSuppliers = PurchasesForSuppliers
        ? Array.from(new Set(PurchasesForSuppliers.map((purchase) => purchase.supplier)))
        : [];

    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('profile_id', user.id)
        .order('name', { ascending: true });

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
                        <SearchInput placeholder="Buscar por produto..." />
                        <CategoryFilter title="Filtrar por Fornecedor" paramName="supplier" options={uniqueSuppliers} />
                        <DatePickerWithRange />
                    </div>
                    <AddPurchaseDialog products={products || []} />
                </CardHeader>
                <CardContent>
                    <PurchasesTable purchases={purchases || []} allProducts={products || []} />
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
export const dynamic = 'force-dynamic'
import AddSaleDialog from "@/app/features/sales/components/AddSaleDialog";
import SalesTable from "@/app/features/sales/components/SalesTable";
import { PageProps } from '@/types';
import { Metadata, ResolvingMetadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
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
                Página {currentPage} de {totalPages}. Total de {totalCount} vendas.
            </div>
            <div className="flex items-center gap-2">
                <Link href={`/vendas?page=${currentPage - 1}`} passHref>
                    <Button variant="outline" size="sm" disabled={!hasPrevPage}>
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Anterior
                    </Button>
                </Link>
                <Link href={`/vendas?page=${currentPage + 1}`} passHref>
                    <Button variant="outline" size="sm" disabled={!hasNextPage}>
                        Próximo
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Lúmina - Vendas',
        description: 'Gerencie suas vendas com facilidade',
    };
}


export default async function SalesPage({ searchParams }: PageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    const resolvedSearchParams = await searchParams;
    const searchTerm = (resolvedSearchParams?.search as string) || '';
    const clientFilter = (resolvedSearchParams?.client as string) || '';
    const fromDate = (resolvedSearchParams?.from as string) || '';
    const toDate = (resolvedSearchParams?.to as string) || '';
    const page = parseInt((resolvedSearchParams?.page as string) || '1', 10);
    const pageSize = 15;

    let query = supabase
        .from('sales')
        .select('*, clients(*), sale_items(*, products(*))', { count: 'exact' })
        .eq('profile_id', user.id);

    if (searchTerm) {
        query = query.ilike('sale_items.products.name', `%${searchTerm}%`);
    }

    if (clientFilter) {
        query = query.eq('clients.name', clientFilter);
    }

    if (fromDate) {
        query = query.gte('created_at', fromDate);
    }

    if (toDate) {
        query = query.lte('created_at', toDate);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to).order('created_at', { ascending: false });

    const { data: salesHistory, count } = await query;

    const { data: products } = await supabase
        .from('products')
        .select('id, name, description, brand, quantity, sale_price, is_active')
        .eq('profile_id', user.id)
        .eq('is_active', true)

    const { data: allClients } = await supabase
        .from('clients')
        .select('*')
        .eq('profile_id', user.id)
        .order('id', { ascending: true });

    const uniqueClients = allClients
        ? Array.from(new Set(allClients.map((c) => c.name)))
        : [];

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return (
        <div className="flex flex-col gap-6">
            <Heading title="Vendas" subtitle="Gerencie suas vendas, adicione novos registros e visualize o histórico de transações." />
            <Card>
                <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className='flex flex-col md:flex-row items-center gap-4'>
                        <SearchInput placeholder="Buscar por produto..." />
                        <CategoryFilter title="Filtrar por Cliente" paramName="client" options={uniqueClients} />
                        <DatePickerWithRange />
                    </div>
                    <AddSaleDialog products={products || []} clients={allClients || []} />
                </CardHeader>
                <CardContent>
                    <SalesTable sales={salesHistory || []} />
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
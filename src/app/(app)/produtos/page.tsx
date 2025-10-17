export const dynamic = 'force-dynamic'
import AddProductForm from '@/app/features/products/components/AddProductForm';
import ProductTable from '@/app/features/products/components/ProductTable';
import { PageProps } from '@/types';
import { Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Heading from '@/components/shared/Heading';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { CategoryFilter } from '@/components/shared/CategoryFilter';
import SearchInput from '@/components/shared/SearchInput';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Custom Pagination Component
function PaginationControls({ hasNextPage, hasPrevPage, totalCount, pageSize, currentPage }: { hasNextPage: boolean, hasPrevPage: boolean, totalCount: number, pageSize: number, currentPage: number }) {
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}. Total de {totalCount} produtos.
            </div>
            <div className="flex items-center gap-2">
                <Link href={`/produtos?page=${currentPage - 1}`} passHref>
                    <Button variant="outline" size="sm" disabled={!hasPrevPage}>
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Anterior
                    </Button>
                </Link>
                <Link href={`/produtos?page=${currentPage + 1}`} passHref>
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
        title: 'Lúmina - Produtos',
        description: searchTerm
            ? `Resultados para "${searchTerm}"`
            : 'Gerencie seus produtos com facilidade',
    };
}

export default async function ProductsPage({ searchParams }: PageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    const resolvedSearchParams = await searchParams;
    const searchTerm = (resolvedSearchParams?.search as string) || '';
    const brandFilter = (resolvedSearchParams?.brand as string) || '';
    const availabilityFilter = (resolvedSearchParams?.availability as string) || '';
    const page = parseInt((resolvedSearchParams?.page as string) || '1', 10);
    const pageSize = 15; // Items per page set to 15

    // Base query
    let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('profile_id', user?.id);

    // Apply filters
    if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
    }
    if (brandFilter) {
        query = query.eq('brand', brandFilter);
    }
    if (availabilityFilter === 'Disponível') {
        query = query.eq('is_active', true);
    } else if (availabilityFilter === 'Indisponível') {
        query = query.eq('is_active', false);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to).order('is_active', { ascending: false }).order('id', { ascending: true });

    // Fetch paginated data and count
    const { data: products, count } = await query;

    // Fetch unique brands for the filter dropdown
    const { data: ProductsForBrands } = await supabase
        .from('products')
        .select('brand')
        .not('brand', 'is', null)
        .eq('profile_id', user?.id);

    const uniqueBrands = ProductsForBrands
        ? Array.from(new Set(ProductsForBrands.map((product) => product.brand)))
        : [];

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return (
        <div className="flex flex-col gap-6">
            <Heading title="Produtos" subtitle="Gerencie seus produtos com facilidade" />
            <Card>
                <CardHeader className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
                    <div className='flex flex-col items-stretch gap-3 md:flex-row md:items-center md:gap-4'>
                        <SearchInput placeholder="Buscar produto por nome..." />
                        <CategoryFilter title="Filtrar por Marca" paramName="brand" options={uniqueBrands} />
                        <CategoryFilter title="Disponibilidade" paramName="availability" options={['Disponível', 'Indisponível']} />
                    </div>
                    <AddProductForm />
                </CardHeader>
                <CardContent>
                    <ProductTable products={products || []} />
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
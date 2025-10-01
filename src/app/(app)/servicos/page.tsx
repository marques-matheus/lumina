export const dynamic = 'force-dynamic'

import { Metadata, ResolvingMetadata } from "next";
import AddServiceOrderDialog from "@/app/features/service-orders/components/AddServiceOrderForm";
import ServiceOrderDetailsDialog from "@/app/features/service-orders/components/ServiceOrderDetailsDialog";
import ServiceOrdersTable from "@/app/features/service-orders/components/ServiceOrdersTable";
import { PageProps } from "@/types";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Heading from "@/components/shared/Heading";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { CategoryFilter } from "@/components/shared/CategoryFilter";
import SearchInput from "@/components/shared/SearchInput";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Custom Pagination Component
function PaginationControls({ hasNextPage, hasPrevPage, totalCount, pageSize, currentPage }: { hasNextPage: boolean, hasPrevPage: boolean, totalCount: number, pageSize: number, currentPage: number }) {
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}. Total de {totalCount} ordens de serviço.
            </div>
            <div className="flex items-center gap-2">
                <Link href={`/servicos?page=${currentPage - 1}`} passHref>
                    <Button variant="outline" size="sm" disabled={!hasPrevPage}>
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Anterior
                    </Button>
                </Link>
                <Link href={`/servicos?page=${currentPage + 1}`} passHref>
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
        title: 'Lúmina - Ordens de Serviço',
        description: searchTerm
            ? `Resultados para "${searchTerm}"`
            : 'Gerencie suas ordens de serviço com facilidade',
    };
}

import { DatePickerWithRange } from '@/components/shared/DateFilter';

export default async function ServicesPage({ searchParams }: PageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/auth/login');
    }
    const resolvedSearchParams = await searchParams;
    const searchTerm = (resolvedSearchParams?.search as string) || '';
    const statusFilter = (resolvedSearchParams?.status as string) || '';
    const fromDate = (resolvedSearchParams?.from as string) || '';
    const toDate = (resolvedSearchParams?.to as string) || '';
    const page = parseInt((resolvedSearchParams?.page as string) || '1', 10);
    const pageSize = 15;

    let query = supabase
        .from('service_orders')
        .select('*, clients!inner(name, phone)', { count: 'exact' })
        .eq('profile_id', user?.id);

    if (searchTerm) {
        query = query.ilike('clients.name', `%${searchTerm}%`);
    }

    if (statusFilter) {
        query = query.eq('status', statusFilter);
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

    const { data: services, count } = await query;
    
    const { data: clients } = await supabase.from('clients').select('*').eq('profile_id', user.id);
    
    const statuses = ["Aguardando Avaliação", "Aguardando Aprovação", "Aprovado", "Em Andamento", "Aguardando Peças", "Concluído", "Entregue", "Cancelado"];

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;


    return (
        <div className="flex flex-col gap-6">
            <Heading title="Ordens de Serviço" subtitle="Gerencie suas ordens de serviço com facilidade" />
            <Card>
                <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className='flex flex-col md:flex-row items-center gap-4'>
                        <SearchInput placeholder="Buscar por cliente..." />
                        <CategoryFilter title="Filtrar por Status" paramName="status" options={statuses} />
                        <DatePickerWithRange />
                    </div>
                    <AddServiceOrderDialog clients={clients || []} />
                </CardHeader>
                <CardContent>
                    <ServiceOrdersTable serviceOrders={services || []} />
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
            <ServiceOrderDetailsDialog />
        </div>
    );
}

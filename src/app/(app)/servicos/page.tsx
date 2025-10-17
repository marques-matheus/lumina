export const dynamic = 'force-dynamic'

import { Metadata, ResolvingMetadata } from "next";
import ServiceOrdersTable from "@/app/features/service-orders/components/ServiceOrdersTable";
import ServiceOrderDetailsDialog from "../../features/service-orders/components/ServiceOrderDetailsDialog";
import { PageProps } from "@/types";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Heading from "@/components/shared/Heading";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import SearchInput from "@/components/shared/SearchInput";
import { CategoryFilter } from "@/components/shared/CategoryFilter";
import { DateFilter } from "@/components/shared/DateFilter";
import AddServiceOrderDialog from "@/app/features/service-orders/components/AddServiceOrderForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";


export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Lúmina - Serviços',
        description: 'Gerencie suas ordens de serviço com facilidade',
    };
}

// Componente de paginação
function PaginationControls({ hasNextPage, hasPrevPage, totalCount, pageSize, currentPage }: { hasNextPage: boolean, hasPrevPage: boolean, totalCount: number, pageSize: number, currentPage: number }) {
    const totalPages = Math.ceil(totalCount / pageSize);
    return (
        <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}. Total de {totalCount} serviços.
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

export default async function ServicesPage({ searchParams }: PageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/auth/login');
    }
    const resolvedSearchParams = await searchParams;
    const searchTerm = (resolvedSearchParams?.search as string) || '';
    const statusFilter = (resolvedSearchParams?.status as string) || '';
    const startDate = (resolvedSearchParams?.startDate as string) || '';
    const endDate = (resolvedSearchParams?.endDate as string) || '';
    const page = parseInt((resolvedSearchParams?.page as string) || '1', 10);
    const pageSize = 15;

    // Base query with count
    let query = supabase
        .from('service_orders')
        .select('*, clients(name, phone)', { count: 'exact' })
        .eq('profile_id', user?.id);

    // Apply filters
    if (searchTerm) {
        query = query.or(`clients.name.ilike.%${searchTerm}%,equip_brand.ilike.%${searchTerm}%,equip_model.ilike.%${searchTerm}%`);
    }
    if (statusFilter) {
        query = query.eq('status', statusFilter);
    }
    if (startDate) {
        query = query.gte('created_at', `${startDate}T00:00:00`);
    }
    if (endDate) {
        query = query.lt('created_at', `${endDate}T23:59:59`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to).order('created_at', { ascending: false });

    const { data: servicesRaw, count } = await query;

    const services = (servicesRaw || []).map((s: any) => ({
        ...s,
        clients: Array.isArray(s.clients) ? s.clients[0] : s.clients,
    }));

    const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .eq('profile_id', user.id)
        .order('name', { ascending: true });

    // Status options for filter
    const statusOptions = [
        'Aguardando Avaliação',
        'Em Andamento',
        'Concluído',
        'Entregue',
        'Cancelado'
    ];

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return (
        <div className="flex flex-col gap-6">
            <Heading title="Serviços" subtitle="Gerencie suas ordens de serviço" />
            <Card>
                <CardHeader className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
                    <div className='flex flex-col items-stretch gap-3 md:flex-row md:items-center md:gap-4'>
                        <SearchInput placeholder="Buscar por cliente ou equipamento..." />
                        <CategoryFilter title="Filtrar por Status" paramName="status" options={statusOptions} />
                        <DateFilter title="Período" />
                    </div>
                    <AddServiceOrderDialog clients={clients || []} />
                </CardHeader>
                <CardContent>
                    <ServiceOrdersTable serviceOrders={services || []} />
                </CardContent>
                <CardFooter>
                    <PaginationControls
                        hasNextPage={hasNextPage}
                        hasPrevPage={hasPrevPage}
                        totalCount={totalCount}
                        pageSize={pageSize}
                        currentPage={page}
                    />
                </CardFooter>
            </Card>
            <ServiceOrderDetailsDialog />
        </div>
    );
}


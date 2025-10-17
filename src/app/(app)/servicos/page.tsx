export const dynamic = 'force-dynamic'

import { Metadata, ResolvingMetadata } from "next";
import ServiceOrdersTable from "@/app/features/service-orders/components/ServiceOrdersTable";
import ServiceOrderDetailsDialog from "../../features/service-orders/components/ServiceOrderDetailsDialog";
import { PageProps } from "@/types";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Heading from "@/components/shared/Heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SearchInput from "@/components/shared/SearchInput";
import { CategoryFilter } from "@/components/shared/CategoryFilter";
import { DateFilter } from "@/components/shared/DateFilter";
import AddServiceOrderDialog from "@/app/features/service-orders/components/AddServiceOrderForm";


export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Lúmina - Serviços',
        description: 'Gerencie suas ordens de serviço com facilidade',
    };
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

    // Base query
    let query = supabase
        .from('service_orders')
        .select('*, clients!inner(name, phone)')
        .eq('profile_id', user?.id);

    // Apply filters
    if (searchTerm) {
        query = query.or(`clients.name.ilike.%${searchTerm}%,equip_brand.ilike.%${searchTerm}%,equip_model.ilike.%${searchTerm}%`);
    }
    if (statusFilter) {
        query = query.eq('status', statusFilter);
    }
    if (startDate) {
        query = query.gte('created_at', startDate);
    }
    if (endDate) {
        // Add one day to include the end date
        const endDateTime = new Date(endDate);
        endDateTime.setDate(endDateTime.getDate() + 1);
        query = query.lt('created_at', endDateTime.toISOString().split('T')[0]);
    }

    query = query.order('created_at', { ascending: false });

    const { data: services } = await query;

    const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .eq('profile_id', user.id)
        .order('name', { ascending: true });

    // Status options for filter
    const statusOptions = ['Pendente', 'Em Andamento', 'Concluído', 'Cancelado'];

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
            </Card>
            <ServiceOrderDetailsDialog />
        </div>
    );
}


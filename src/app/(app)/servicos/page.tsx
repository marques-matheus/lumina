export const dynamic = 'force-dynamic'

import { Metadata, ResolvingMetadata } from "next";
import AddServiceOrderDialog from "@/app/features/service-orders/components/AddServiceOrderForm";
import ServiceOrdersTable from "@/app/features/service-orders/components/ServiceOrdersTable";
import ServiceOrderDetailsDialog from "../../features/service-orders/components/ServiceOrderDetailsDialog";
import { PageProps } from "@/types";
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
        title: 'Lúmina - Ordens de Serviço',
        description: searchTerm
            ? `Resultados para "${searchTerm}"`
            : 'Gerencie suas ordens de serviço com facilidade',
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

    let query = supabase
        .from('service_orders')
        .select('*, clients!inner(name, phone)')
        .eq('profile_id', user?.id);

    if (searchTerm) {
        query = query
            .ilike('clients.name', `%${searchTerm}%`)
    }

    if (statusFilter) {
        query = query.eq('status', statusFilter);
    }


    const { data: services } = await query.order('created_at', { ascending: false });
    const { data: clients } = await supabase
        .from('clients')
        .select('*')
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <Heading title="Ordens de Serviço" subtitle="Gerencie suas ordens de serviço com facilidade" />
                <AddServiceOrderDialog clients={clients || []} />
            </div>
            <ServiceOrdersTable serviceOrders={services || []} />
            <ServiceOrderDetailsDialog />
        </div>
    );
}


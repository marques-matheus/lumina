export const dynamic = 'force-dynamic'

import { Metadata, ResolvingMetadata } from "next";
import AddServiceOrderDialog from "@/app/features/service-orders/components/AddServiceOrderForm";
import ServiceOrdersTable from "@/app/features/service-orders/components/ServiceOrdersTable";
import { supabase } from "@/lib/supabaseClient";
import ServiceOrderDetailsDialog from "../features/service-orders/components/ServiceOrderDetailsDialog";
import { PageProps } from "@/types";

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

    const resolvedSearchParams = await searchParams;
    const searchTerm = (resolvedSearchParams?.search as string) || '';
    let query = supabase
        .from('service_orders')
        .select('*, clients!inner(name, phone)');

    if (searchTerm) {
        query = query
            .ilike('clients.name', `%${searchTerm}%`)
    }

    const { data: services } = await query.order('created_at', { ascending: false });
    const { data: clients } = await supabase
        .from('clients')
        .select('*')
    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-2xl font-semibold">Ordens de Serviços</h1>
            <AddServiceOrderDialog clients={clients || []} />
            <ServiceOrdersTable serviceOrders={services || []} />
            <ServiceOrderDetailsDialog />
        </div>
    );
}


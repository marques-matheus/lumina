export const dynamic = 'force-dynamic'

import { Metadata, ResolvingMetadata } from "next";
import AddServiceOrderDialog from "@/app/features/service-orders/components/AddServiceOrderForm";
import ServiceOrdersTable from "@/app/features/service-orders/components/ServiceOrdersTable";
import { supabase } from "@/lib/supabaseClient";
import ServiceOrderDetailsDialog from "../features/service-orders/components/ServiceOrderDetailsDialog";
import { PageProps } from "@/types";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

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

    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!, // Chave de admin para buscar dados
        {
            cookies: {
                async get(name: string) {
                    return (await cookieStore).get(name)?.value;
                },
            },
        }
    );

    const resolvedSearchParams = await searchParams;
    const searchTerm = (resolvedSearchParams?.search as string) || '';
    const statusFilter = (resolvedSearchParams?.status as string) || '';

    let query = supabase
        .from('service_orders')
        .select('*, clients!inner(name, phone)');

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
                <h1 className="text-lg font-semibold">Ordens de Serviços</h1>
                <AddServiceOrderDialog clients={clients || []} />
            </div>
            <ServiceOrdersTable serviceOrders={services || []} />
            <ServiceOrderDetailsDialog />
        </div>
    );
}


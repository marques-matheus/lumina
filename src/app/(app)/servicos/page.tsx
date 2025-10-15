export const dynamic = 'force-dynamic'

import { Metadata, ResolvingMetadata } from "next";
import ServiceOrdersTable from "@/app/features/service-orders/components/ServiceOrdersTable";
import ServiceOrderDetailsDialog from "../../features/service-orders/components/ServiceOrderDetailsDialog";
import { PageProps } from "@/types";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";


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
    const { data: services } = await supabase
        .from('service_orders')
        .select('*, clients!inner(name, phone)')
        .eq('profile_id', user?.id)
        .order('created_at', { ascending: false });
    const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .eq('profile_id', user.id)
        .order('name', { ascending: true });
    return (
        <div className="flex flex-col gap-8">
            <ServiceOrdersTable serviceOrders={services || []} clients={clients || []} />
            <ServiceOrderDetailsDialog />
        </div>
    );
}


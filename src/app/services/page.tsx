export const dynamic = 'force-dynamic'

import AddServiceOrderDialog from "@/app/features/service-orders/components/AddServiceOrderForm";
import ServiceOrdersTable from "@/app/features/service-orders/components/ServiceOrdersTable";
import { supabase } from "@/lib/supabaseClient";
import ServiceOrderDetailsDialog from "../features/service-orders/components/ServiceOrderDetailsDialog";


export default async function ServicesPage({ searchParams }: { searchParams: { search?: string } }) {

    const searchTerm = searchParams?.search || '';
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
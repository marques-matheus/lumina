export const dynamic = 'force-dynamic'

import AddServiceOrderDialog from "@/app/features/service-orders/components/AddServiceOrderForm";
import ServiceOrdersTable from "@/app/features/service-orders/components/ServiceOrdersTable";
import { supabase } from "@/lib/supabaseClient";


export default async function ServicesPage() {
    const { data: services } = await supabase
        .from('service_orders')
        .select('*, clients(name, phone)')
        .order('created_at', { ascending: false });

        const { data: clients } = await supabase
        .from('clients')
        .select('*')
    // O código corrigido:
    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-2xl font-semibold">Ordens de Serviços</h1>
            <AddServiceOrderDialog clients={clients || []}/>
            <ServiceOrdersTable serviceOrders={services || []} />
        </div>
    );
}
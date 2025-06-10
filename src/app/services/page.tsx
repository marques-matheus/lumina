import ServiceOrdersTable from "@/components/ServiceOrdersTable";
import { supabase } from "@/lib/supabaseClient";


export default async function ServicesPage() {
    const { data: services } = await supabase
        .from('service_orders')
        .select('*, clients(name, phone)')
        .order('created_at', { ascending: false });
    // O código corrigido:
    return (
        <ServiceOrdersTable serviceOrders={services || []} />
    );
}
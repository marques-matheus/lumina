import AddServiceOrderDialog from "@/components/AddServiceOrderForm";
import ServiceOrdersTable from "@/components/ServiceOrdersTable";
import { supabase } from "@/lib/supabaseClient";


export default async function ServicesPage() {
    const { data: services } = await supabase
        .from('service_orders')
        .select('*, clients(name, phone)')
        .order('created_at', { ascending: false });
    // O código corrigido:
    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-2xl font-semibold">Ordens de Serviços</h1>
            <AddServiceOrderDialog />
            <ServiceOrdersTable serviceOrders={services || []} />
        </div>
    );
}
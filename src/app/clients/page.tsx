import ClientTable from '@/components/ClientTable';
import { supabase } from '@/lib/supabaseClient';


export default async function ClientsPage() {
    const {data: clients} = await supabase
    .from('clients')
    .select('*')
    .order('name', { ascending: true });
  
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Meu Clientes</h1>
      <ClientTable clients={clients || []} />
    </div>
  );
}
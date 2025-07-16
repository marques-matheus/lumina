export const dynamic = 'force-dynamic'
import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardCard } from '../features/dashboard/components/Card';
import { type Product } from '@/types';




export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Lúmina - Painel',
    description: 'Bem-vindo ao painel do Lúmina',
  };
}

export default async function MainPage() {

  const supabase = await createClient();  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
  const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString();

  const { data: monthlySales, error: salesError } = await supabase
    .from('sales')
    .select('total_amount')
    .eq('profile_id', user.id)
    .gte('created_at', firstDayOfMonth)
    .lt('created_at', firstDayOfNextMonth);


  const monthlyRevenue = monthlySales?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;
  const monthlySalesCount = monthlySales?.length || 0;
  const averageTicket = monthlySalesCount > 0 ? monthlyRevenue / monthlySalesCount : 0;


  const { data: monthlyPurchases, error: purchasesError } = await supabase
    .from('purchases')
    .select('*')
    .eq('profile_id', user.id);

  const monthlyPurchasesTotal = monthlyPurchases?.reduce((sum, purchase) => sum + purchase.quantity * purchase.cost_per_unit, 0) || 0;

  const { count: pendingServicesCount, error: servicesError } = await supabase
    .from('service_orders')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', user.id)
    .in('status', ['Aguardando Avaliação', 'Em Reparo']);

  const { count: completedServicesCount, error: completedServicesError } = await supabase
    .from('service_orders')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', user.id)
    .eq('status', 'Concluído')
    .gte('updated_at', firstDayOfMonth)
    .lt('updated_at', firstDayOfNextMonth);

  const LOW_STOCK_THRESHOLD = 5;
  const { data: lowStockProducts, error: productsError } = await supabase
    .from('products')
    .select('name, quantity')
    .eq('profile_id', user.id)
    .eq('is_active', true)
    .lt('quantity', LOW_STOCK_THRESHOLD)
    .order('quantity', { ascending: true });

  const { count: newClientsCount, error: clientsError } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', user.id)
    .gte('created_at', firstDayOfMonth)
    .lt('created_at', firstDayOfNextMonth);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Faturamento do Mês"
          value={monthlyRevenue ? monthlyRevenue : 0}
          type="currency"
          description={`${monthlySalesCount} venda(s) realizada(s)`}
        />
        <DashboardCard
          title="Compras do Mês"
          value={monthlyPurchasesTotal ? monthlyPurchasesTotal : 0}
          type="currency"
          description={`${monthlyPurchases?.length} compra(s) realizada(s)`}
        />
        <DashboardCard
          title="Ticket Médio (Vendas)"
          value={averageTicket ? averageTicket : 0}
          type="currency"
          description="Valor médio por venda"
        />
        <DashboardCard
          title="Serviços Pendentes"
          value={pendingServicesCount || 0}
          type="number"
          description="Ordens aguardando sua atenção"
        />
        <DashboardCard
          title="Serviços Concluídos (Mês)"
          value={completedServicesCount || 0}
          type="number"
          description="Ordens de serviço finalizadas"
        />
        <DashboardCard
          title="Novos Clientes (Mês)"
          value={newClientsCount || 0}
          type="number"
          description="Novos clientes cadastrados"
        />
        <DashboardCard
          title="Produtos com Estoque Baixo"
          value={lowStockProducts?.length || 0}
          type="list"
          data={lowStockProducts as Product[]}
          description={`Itens com menos de ${LOW_STOCK_THRESHOLD} unidades`}
        />
      </div>
    </div>
  );
}
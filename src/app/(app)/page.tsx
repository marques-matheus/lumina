export const dynamic = 'force-dynamic'
import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardCard } from '../features/dashboard/components/Card';
import { type Product } from '@/types';
import { DollarSign, Package, Users, Wrench, ShoppingCart } from 'lucide-react';
import Heading from '@/components/shared/Heading';
import LowStockDialog from '../features/dashboard/components/LowStockDialog';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Lúmina - Painel',
        description: 'Bem-vindo ao painel do Lúmina',
    };
}

export default async function MainPage() {
    // Mantendo o seu padrão de criação de cliente
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // --- BUSCA DE DADOS OTIMIZADA COM Promise.all ---
    // Datas para filtros diários e mensais
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const tomorrowStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString();

    // 1. Preparamos todas as "perguntas" ao banco de dados

    // -- QUERIES DIÁRIAS --
    const dailySalesPromise = supabase
        .from('sales')
        .select('total_amount, sale_items(quantity, products(name))')
        .eq('profile_id', user.id)
        .gte('created_at', todayStart)
        .lt('created_at', tomorrowStart);

    // -- QUERIES MENSAIS --
    const monthlySalesPromise = supabase
        .from('sales')
        .select('total_amount')
        .eq('profile_id', user.id)
        .gte('created_at', firstDayOfMonth)
        .lt('created_at', firstDayOfNextMonth);

    const monthlyServicesPromise = supabase
        .from('service_orders')
        .select('total')
        .eq('profile_id', user.id)
        .in('status', ['Concluído', 'Entregue'])
        .gte('updated_at', firstDayOfMonth)
        .lt('updated_at', firstDayOfNextMonth);

    const monthlyPurchasesPromise = supabase
        .from('purchases')
        .select('quantity, cost_per_unit')
        .eq('profile_id', user.id)
        .gte('purchase_date', firstDayOfMonth)
        .lt('purchase_date', firstDayOfNextMonth);

    const dailyPurchasesPromise = supabase
        .from('purchases')
        .select('quantity, cost_per_unit')
        .eq('profile_id', user.id)
        .gte('purchase_date', todayStart)
        .lt('purchase_date', tomorrowStart);

    const pendingServicesPromise = supabase
        .from('service_orders')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', user.id)
        .in('status', ['Aguardando Avaliação', 'Em Reparo']);

    const completedServicesPromise = supabase
        .from('service_orders')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', user.id)
        .in('status', ['Concluído', 'Entregue'])
        .gte('completed_at', firstDayOfMonth)
        .lt('completed_at', firstDayOfNextMonth);

    const LOW_STOCK_THRESHOLD = 5;
    const lowStockProductsPromise = supabase
        .from('products')
        .select('*')
        .eq('profile_id', user.id)
        .eq('is_active', true)
        .lt('quantity', LOW_STOCK_THRESHOLD)
        .order('quantity', { ascending: true });

    const newClientsPromise = supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', user.id)
        .gte('created_at', firstDayOfMonth)
        .lt('created_at', firstDayOfNextMonth);

    const allProductsPromise = supabase
        .from('products')
        .select('*')
        .eq('profile_id', user.id)
        .order('name', { ascending: true });

    // 2. Disparamos todas as buscas ao mesmo tempo
    const [
        { data: dailySales },
        { data: monthlySales },
        { data: monthlyServices },
        { data: monthlyPurchases },
        { data: dailyPurchases },
        { count: pendingServicesCount },
        { count: completedServicesCount },
        { data: lowStockProducts },
        { count: newClientsCount },
        { data: allProducts }
    ] = await Promise.all([
        dailySalesPromise,
        monthlySalesPromise,
        monthlyServicesPromise,
        monthlyPurchasesPromise,
        dailyPurchasesPromise,
        pendingServicesPromise,
        completedServicesPromise,
        lowStockProductsPromise,
        newClientsPromise,
        allProductsPromise
    ]);

    // --- CÁLCULOS DIÁRIOS ---
    const dailyRevenue = dailySales?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;
    const dailyCosts = dailyPurchases?.reduce((sum, purchase) => sum + (purchase.quantity * purchase.cost_per_unit), 0) || 0;
    const dailyProfit = dailyRevenue - dailyCosts;
    const dailySoldItems = dailySales
        ?.flatMap(sale => sale.sale_items)
        .map(item => ({
            // @ts-ignore
            name: item.products.name,
            quantity: item.quantity
        })) || [];


    // --- CÁLCULos MENSAIS ---
    const monthlySalesRevenue = monthlySales?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;
    const monthlyServicesRevenue = monthlyServices?.reduce((sum, service) => sum + service.total, 0) || 0;
    const totalRevenue = monthlySalesRevenue + monthlyServicesRevenue;

    const monthlyTotalCosts = monthlyPurchases?.reduce((sum, purchase) => sum + (purchase.quantity * purchase.cost_per_unit), 0) || 0;
    const monthlyGrossProfit = totalRevenue - monthlyTotalCosts;

    const monthlySalesCount = monthlySales?.length || 0;
    const averageTicket = monthlySalesCount > 0 ? monthlySalesRevenue / monthlySalesCount : 0;

    return (
        <div className="flex flex-col gap-6">
            <Heading title="Dashboard" subtitle="Painel de controle" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardCard
                    title="Faturamento (Hoje)"
                    value={dailyRevenue}
                    type="currency"
                    description="Total de vendas hoje"
                    icon={<DollarSign className="h-8 w-8 text-muted-foreground" />}
                />
                <DashboardCard
                    title="Lucro Bruto (Hoje)"
                    value={dailyProfit}
                    type="currency"
                    description={`Custos de R$ ${dailyCosts.toFixed(2)}`}
                    icon={<DollarSign className="h-8 w-8 text-muted-foreground" />}
                />
                <DashboardCard
                    title="Faturamento (Mês)"
                    value={totalRevenue}
                    type="currency"
                    description="Vendas de produtos e serviços"
                    icon={<DollarSign className="h-8 w-8 text-muted-foreground" />}
                />
                <DashboardCard
                    title="Lucro Bruto (Mês)"
                    value={monthlyGrossProfit}
                    type="currency"
                    description={`Custos de R$ ${monthlyTotalCosts.toFixed(2)}`}
                    icon={<DollarSign className="h-8 w-8 text-muted-foreground" />}
                />
                <DashboardCard
                    title="Ticket Médio (Vendas)"
                    value={averageTicket}
                    type="currency"
                    description={`${monthlySalesCount} venda(s) no mês`}
                    icon={<ShoppingCart className="h-8 w-8 text-muted-foreground" />}
                />
                <DashboardCard
                    title="Itens Vendidos (Hoje)"
                    value={dailySoldItems.length}
                    type="list"
                    data={dailySoldItems}
                    description="Produtos vendidos no dia"
                    icon={<Package className="h-8 w-8 text-muted-foreground" />}
                />
                <DashboardCard
                    title="Serviços Pendentes"
                    value={pendingServicesCount || 0}
                    type="number"
                    description="Ordens que necessitam da sua atenção"
                    icon={<Wrench className="h-8 w-8 text-muted-foreground" />}
                />
                <DashboardCard
                    title="Serviços Concluídos (Mês)"
                    value={completedServicesCount || 0}
                    type="number"
                    description="Ordens de serviço finalizadas"
                    icon={<Wrench className="h-8 w-8 text-muted-foreground" />}
                />
                <DashboardCard
                    title="Novos Clientes (Mês)"
                    value={newClientsCount || 0}
                    type="number"
                    description="Novos clientes cadastrados"
                    icon={<Users className="h-8 w-8 text-muted-foreground" />}
                />
                <DashboardCard
                    title="Alerta de Estoque Baixo"
                    value={lowStockProducts?.length || 0}
                    type="list"
                    data={(lowStockProducts?.slice(0, 5) || []) as Partial<Product>[]}
                    description={`Itens com menos de ${LOW_STOCK_THRESHOLD} unidades`}
                    icon={<Package className="h-8 w-8 text-muted-foreground" />}
                    footer={<LowStockDialog
                        allProducts={lowStockProducts || []}
                        allCatalogProducts={allProducts || []}
                    />}
                />
            </div>
        </div>
    );
}
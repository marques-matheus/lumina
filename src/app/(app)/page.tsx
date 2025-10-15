export const dynamic = 'force-dynamic'
import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardCard } from '../features/dashboard/components/Card';
import { type Product } from '@/types';
import { DollarSign, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import Heading from '@/components/shared/Heading';
import LowStockDialog from '../features/dashboard/components/LowStockDialog';
import ServiceStatusChart from '../features/dashboard/components/ServiceStatusChart';
import HorizontalBarChart from '../features/dashboard/components/HorizontalBarChart';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { ChartConfig } from '@/components/ui/chart';
import TimeSeriesLineChart from '../features/dashboard/components/TimeSeriesLineChart';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Lúmina - Painel',
        description: 'Bem-vindo ao painel do Lúmina',
    };
}

interface MainPageProps {
    searchParams: Promise<{
        mes?: string;
        ano?: string;
    }>;
}

const serviceStatusConfig = {
    aguardando: { label: 'Aguardando Avaliação', color: 'var(--chart-1)' },
    andamento: { label: 'Em Andamento', color: 'var(--chart-2)' },
    concluido: { label: 'Concluído', color: 'var(--chart-3)' },
    entregue: { label: 'Entregue', color: 'var(--chart-4)' },
    cancelado: { label: 'Cancelado', color: 'var(--chart-5)' },
} satisfies ChartConfig;

const statusMap: { [key: string]: keyof typeof serviceStatusConfig } = {
    'Aguardando Avaliação': 'aguardando',
    'Em Andamento': 'andamento',
    'Concluído': 'concluido',
    'Entregue': 'entregue',
    'Cancelado': 'cancelado',
};

export default async function MainPage({ searchParams }: MainPageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    const params = await searchParams;
    const mes = params.mes;
    const ano = params.ano;
    const today = new Date();
    const currentYear = ano ? parseInt(ano) : today.getFullYear();
    const currentMonth = mes ? parseInt(mes) - 1 : today.getMonth();
    const currentDate = new Date(currentYear, currentMonth, 1);

    const prevMonth = new Date(currentYear, currentMonth - 1, 1);
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);

    const todayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).toISOString();
    const tomorrowStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1).toISOString();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
    const firstDayOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1).toISOString();

    const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
    const year = currentDate.getFullYear();


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
        .select('total_amount, created_at, sale_items(quantity, products(name))')
        .eq('profile_id', user.id)
        .gte('created_at', firstDayOfMonth)
        .lt('created_at', firstDayOfNextMonth);

    const completedServicesRevenuePromise = supabase
        .from('service_orders')
        .select('total, completed_at')
        .eq('profile_id', user.id)
        .eq('status', 'Concluído')
        .gte('completed_at', firstDayOfMonth)
        .lt('completed_at', firstDayOfNextMonth);

    const deliveredServicesRevenuePromise = supabase
        .from('service_orders')
        .select('total, delivered_at')
        .eq('profile_id', user.id)
        .eq('status', 'Entregue')
        .gte('delivered_at', firstDayOfMonth)
        .lt('delivered_at', firstDayOfNextMonth);

    const monthlyPurchasesPromise = supabase
        .from('purchases')
        .select('quantity, cost_per_unit, purchase_date')
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
        .in('status', ['Aguardando Avaliação', 'Em Andamento']);

    const completedServicesCountPromise = supabase
        .from('service_orders')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', user.id)
        .eq('status', 'Concluído')
        .gte('completed_at', firstDayOfMonth)
        .lt('completed_at', firstDayOfNextMonth);

    const deliveredServicesCountPromise = supabase
        .from('service_orders')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', user.id)
        .eq('status', 'Entregue')
        .gte('delivered_at', firstDayOfMonth)
        .lt('delivered_at', firstDayOfNextMonth);

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

    const serviceStatusPromise = supabase
        .from('service_orders')
        .select('status, total')
        .eq('profile_id', user.id);

    // 2. Disparamos todas as buscas ao mesmo tempo
    const [
        { data: dailySales },
        { data: monthlySales },
        { data: completedServicesRevenue },
        { data: deliveredServicesRevenue },
        { data: monthlyPurchases },
        { data: dailyPurchases },
        { count: pendingServicesCount },
        { count: completedCount },
        { count: deliveredCount },
        { data: lowStockProducts },
        { count: newClientsCount },
        { data: allProducts },
        { data: serviceStatus }
    ] = await Promise.all([
        dailySalesPromise,
        monthlySalesPromise,
        completedServicesRevenuePromise,
        deliveredServicesRevenuePromise,
        monthlyPurchasesPromise,
        dailyPurchasesPromise,
        pendingServicesPromise,
        completedServicesCountPromise,
        deliveredServicesCountPromise,
        lowStockProductsPromise,
        newClientsPromise,
        allProductsPromise,
        serviceStatusPromise
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


    // --- CÁLCULOS MENSAIS ---
    const completedServices = completedServicesRevenue?.map(s => ({ ...s, revenue_date: s.completed_at })) || [];
    const deliveredServices = deliveredServicesRevenue?.map(s => ({ ...s, revenue_date: s.delivered_at })) || [];
    const monthlyServices = [...completedServices, ...deliveredServices];

    const monthlySalesRevenue = monthlySales?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;
    const monthlyServicesRevenue = monthlyServices.reduce((sum, service) => sum + service.total, 0);
    const totalRevenue = monthlySalesRevenue + monthlyServicesRevenue;

    const monthlyTotalCosts = monthlyPurchases?.reduce((sum, purchase) => sum + (purchase.quantity * purchase.cost_per_unit), 0) || 0;
    const monthlyGrossProfit = totalRevenue - monthlyTotalCosts;

    const monthlySalesCount = monthlySales?.length || 0;
    const completedServicesCount = (completedCount || 0) + (deliveredCount || 0);
    const averageTicket = monthlySalesCount > 0 ? monthlySalesRevenue / monthlySalesCount : 0;

    // --- PROCESSAMENTO DE DADOS PARA GRÁFICOS ---

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    // Gráfico de Faturamento de Vendas
    const monthlySalesChartData: { [key: string]: number } = {};
    for (let i = 1; i <= daysInMonth; i++) {
        const day = i.toString().padStart(2, '0');
        monthlySalesChartData[day] = 0;
    }
    monthlySales?.forEach(sale => {
        const day = new Date(sale.created_at).getUTCDate().toString().padStart(2, '0');
        if (monthlySalesChartData[day] !== undefined) {
            monthlySalesChartData[day] += sale.total_amount;
        }
    });
    const formattedMonthlySalesChartData = Array.from({ length: daysInMonth }, (_, i) => {
        const day = (i + 1).toString().padStart(2, '0');
        return {
            name: day,
            vendas: monthlySalesChartData[day],
        };
    });

    // Gráfico de Faturamento de Serviços
    const monthlyServicesChartData: { [key: string]: number } = {};
    for (let i = 1; i <= daysInMonth; i++) {
        const day = i.toString().padStart(2, '0');
        monthlyServicesChartData[day] = 0;
    }
    monthlyServices.forEach(service => {
        // @ts-ignore
        const day = new Date(service.revenue_date).getUTCDate().toString().padStart(2, '0');
        if (monthlyServicesChartData[day] !== undefined) {
            monthlyServicesChartData[day] += service.total;
        }
    });
    const formattedMonthlyServicesChartData = Array.from({ length: daysInMonth }, (_, i) => {
        const day = (i + 1).toString().padStart(2, '0');
        return {
            name: day,
            servicos: monthlyServicesChartData[day],
        };
    });

    // Gráfico de Status de Serviços
    const statusTotals = serviceStatus?.reduce((acc, order) => {
        const statusKey = statusMap[order.status] || 'desconhecido';
        acc[statusKey] = (acc[statusKey] || 0) + order.total;
        return acc;
    }, {} as Record<string, number>) || {};

    const serviceStatusChartData = Object.keys(statusTotals).map(key => ({
        name: key,
        value: statusTotals[key],
        label: serviceStatusConfig[key as keyof typeof serviceStatusConfig]?.label || key,
        fill: `var(--color-${key})`,
    }));

    // Gráfico de Itens Vendidos Hoje
    const soldItemsAggregated = dailySoldItems.reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + item.quantity;
        return acc;
    }, {} as Record<string, number>);

    const soldItemsChartData = Object.entries(soldItemsAggregated)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 7); // Pega os 7 mais vendidos

    // Gráfico de Itens Vendidos no Mês
    const monthlySoldItems = monthlySales
        ?.flatMap(sale => sale.sale_items)
        .map(item => ({
            // @ts-ignore
            name: item.products.name,
            quantity: item.quantity
        })) || [];

    const monthlySoldItemsAggregated = monthlySoldItems.reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + item.quantity;
        return acc;
    }, {} as Record<string, number>);

    const monthlySoldItemsChartData = Object.entries(monthlySoldItemsAggregated).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 7);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Heading
                    title="Dashboard"
                    subtitle={`Exibindo dados de: ${monthName} de ${year}`}
                />
                <div className="flex items-center gap-2">
                    <Link
                        href={`?mes=${prevMonth.getMonth() + 1}&ano=${prevMonth.getFullYear()}`}
                        className={buttonVariants({ variant: 'outline' })}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Mês Anterior
                    </Link>
                    <Link
                        href={`?mes=${nextMonth.getMonth() + 1}&ano=${nextMonth.getFullYear()}`}
                        className={buttonVariants({ variant: 'outline' })}
                    >
                        Mês Seguinte
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TimeSeriesLineChart
                    title="Faturamento de Vendas"
                    description=""
                    data={formattedMonthlySalesChartData}
                    lineDataKey="vendas"
                    lineLabel="Vendas"
                    lineColor="var(--chart-2)"
                    footer={<p className="text-sm text-muted-foreground">Faturamento total de vendas no mês: <strong className="text-primary">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlySalesRevenue)}</strong></p>}
                />
                <TimeSeriesLineChart
                    title="Faturamento de Serviços"
                    description=""
                    data={formattedMonthlyServicesChartData}
                    lineDataKey="servicos"
                    lineLabel="Serviços"
                    lineColor="var(--chart-1)"
                    footer={<p className="text-sm text-muted-foreground">Faturamento total de serviços no mês: <strong className="text-primary">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyServicesRevenue)}</strong></p>}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardCard
                    title="Lucro Bruto Total"
                    value={monthlyGrossProfit}
                    description="Vendas e Serviços - Compras"
                    icon={<DollarSign className="h-8 w-8 text-muted-foreground" />}
                    type="currency"
                />
                <ServiceStatusChart data={serviceStatusChartData} chartConfig={serviceStatusConfig} valueType="currency" />
                <DashboardCard
                    title="Alerta de Estoque Baixo"
                    value={lowStockProducts?.length || 0}
                    type="list"
                    data={(lowStockProducts?.slice(0, 10) || []) as Partial<Product>[]}
                    description={`Itens com menos de ${LOW_STOCK_THRESHOLD} unidades`}
                    icon={<Package className="h-8 w-8 text-muted-foreground" />}
                    footer={<LowStockDialog
                        allProducts={lowStockProducts || []}
                        allCatalogProducts={allProducts || []}
                    />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <HorizontalBarChart title="Itens Mais Vendidos (Hoje)" description="Produtos mais populares do dia." data={soldItemsChartData} barDataKey="value" barFill="var(--chart-2)" className="col-span-1 lg:col-span-2" />
                <HorizontalBarChart
                    title="Itens Mais Vendidos (Mês)"
                    description="Produtos mais populares do mês."
                    data={monthlySoldItemsChartData}
                    barDataKey="value"
                    barFill="var(--chart-1)"
                    className="col-span-1 lg:col-span-2"
                />
            </div>
        </div>
    );
}
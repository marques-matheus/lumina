export const dynamic = 'force-dynamic'
import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardCard } from '../features/dashboard/components/Card';
import { type Product } from '@/types';
import { DollarSign, Package, Users, Wrench, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import Heading from '@/components/shared/Heading';
import LowStockDialog from '../features/dashboard/components/LowStockDialog';
import MonthlyRevenueChart from '../features/dashboard/components/MonthlyRevenueChart';
import ServiceStatusChart from '../features/dashboard/components/ServiceStatusChart';
import HorizontalBarChart from '../features/dashboard/components/HorizontalBarChart';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Lúmina - Painel',
        description: 'Bem-vindo ao painel do Lúmina',
    };
}

interface MainPageProps {
    searchParams: {
        mes?: string;
        ano?: string;
    };
}

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

    const monthlyServicesPromise = supabase
        .from('service_orders')
        .select('total, updated_at')
        .eq('profile_id', user.id)
        .in('status', ['Concluído', 'Entregue'])
        .gte('updated_at', firstDayOfMonth)
        .lt('updated_at', firstDayOfNextMonth);

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

    const serviceStatusPromise = supabase
        .from('service_orders')
        .select('status')
        .eq('profile_id', user.id);

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
        { data: allProducts },
        { data: serviceStatus }
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


    // --- CÁLCULos MENSAIS ---
    const monthlySalesRevenue = monthlySales?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;
    const monthlyServicesRevenue = monthlyServices?.reduce((sum, service) => sum + service.total, 0) || 0;
    const totalRevenue = monthlySalesRevenue + monthlyServicesRevenue;

    const monthlyTotalCosts = monthlyPurchases?.reduce((sum, purchase) => sum + (purchase.quantity * purchase.cost_per_unit), 0) || 0;
    const monthlyGrossProfit = totalRevenue - monthlyTotalCosts;

    const monthlySalesCount = monthlySales?.length || 0;
    const averageTicket = monthlySalesCount > 0 ? monthlySalesRevenue / monthlySalesCount : 0;

    // --- PROCESSAMENTO DE DADOS PARA GRÁFICOS ---

    // Gráfico de Faturamento Mensal
    const monthlyChartData: { [key: string]: number } = {};
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
        const day = i.toString().padStart(2, '0');
        monthlyChartData[day] = 0;
    }

    monthlySales?.forEach(sale => {
        const day = new Date(sale.created_at).getDate().toString().padStart(2, '0');
        if (monthlyChartData[day] !== undefined) {
            monthlyChartData[day] += sale.total_amount;
        }
    });
    monthlyServices?.forEach(service => {
        const day = new Date(service.updated_at).getDate().toString().padStart(2, '0');
        if (monthlyChartData[day] !== undefined) {
            monthlyChartData[day] += service.total;
        }
    });

    const sortedDays = Object.keys(monthlyChartData).sort();
    const formattedMonthlyChartData = sortedDays.map(day => ({
        name: day,
        Faturamento: monthlyChartData[day],
    }));

    // Gráfico de Status de Serviços
    const statusCounts = serviceStatus?.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>) || {};

    const serviceStatusChartData = Object.keys(statusCounts).map(status => ({
        name: status,
        value: statusCounts[status],
    }));

    // Gráfico de Lucro Mensal
    const monthlyProfitChartData: { [key: string]: { revenue: number, cost: number } } = {};
    for (let i = 1; i <= daysInMonth; i++) {
        const day = i.toString().padStart(2, '0');
        monthlyProfitChartData[day] = { revenue: 0, cost: 0 };
    }
    monthlySales?.forEach(sale => {
        const day = new Date(sale.created_at).getDate().toString().padStart(2, '0');
        if (monthlyProfitChartData[day]) monthlyProfitChartData[day].revenue += sale.total_amount;
    });
    monthlyServices?.forEach(service => {
        const day = new Date(service.updated_at).getDate().toString().padStart(2, '0');
        if (monthlyProfitChartData[day]) monthlyProfitChartData[day].revenue += service.total;
    });
    monthlyPurchases?.forEach(purchase => {
        const day = new Date(purchase.purchase_date).getDate().toString().padStart(2, '0');
        if (monthlyProfitChartData[day]) monthlyProfitChartData[day].cost += purchase.quantity * purchase.cost_per_unit;
    });
    const sortedProfitDays = Object.keys(monthlyProfitChartData).sort();
    const formattedMonthlyProfitChartData = sortedProfitDays.map(day => ({
        name: day,
        Lucro: monthlyProfitChartData[day].revenue - monthlyProfitChartData[day].cost,
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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <MonthlyRevenueChart data={formattedMonthlyChartData} />
                <MonthlyRevenueChart data={formattedMonthlyProfitChartData} title="Lucro no Mês" barDataKey="Lucro" barFill="#3b82f6" />
                <HorizontalBarChart title="Itens Mais Vendidos (Hoje)" description="Produtos mais populares do dia." data={soldItemsChartData} barDataKey="value" barFill="#34d399" className="col-span-1 lg:col-span-2" />
                <HorizontalBarChart
                    title="Itens Mais Vendidos (Mês)"
                    description="Produtos mais populares do mês."
                    data={monthlySoldItemsChartData}
                    barDataKey="value"
                    barFill="#8b5cf6" // violet-500
                    className="col-span-1 lg:col-span-2"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <ServiceStatusChart data={serviceStatusChartData} />
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
        </div>
    );
}

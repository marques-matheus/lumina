'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ReferenceLine, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ChartData {
    name: string;
    [key: string]: string | number;
}

interface MonthlyRevenueChartProps {
    data: ChartData[];
    title?: string;
    description?: string;
    barDataKey?: string;
    barFill?: string;
}

export default function MonthlyRevenueChart({ data, title = "Faturamento no Mês", description = "Faturamento de vendas e serviços dia a dia.", barDataKey = "Faturamento", barFill = "#14b8a6" }: MonthlyRevenueChartProps) {
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                        <Tooltip formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
                        <Legend />
                        <ReferenceLine y={0} stroke="#888888" strokeDasharray="3 3" />
                        {barDataKey === 'Lucro' ? (
                            <Bar dataKey="Lucro" name="Lucro/Prejuízo">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={Number(entry.Lucro) >= 0 ? '#22c55e' : '#ef4444'} />
                                ))}
                            </Bar>
                        ) : (
                            <Bar dataKey={barDataKey} fill={barFill} radius={[4, 4, 0, 0]} name={barDataKey} />
                        )}
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
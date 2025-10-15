'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ChartData {
    name: string;
    value: number;
    [key: string]: string | number;
}

interface ServiceStatusChartProps {
    data: ChartData[];
    valueType?: 'currency' | 'number';
}

const COLORS = {
    'Aguardando Avaliação': '#f97316',
    'Em Andamento': '#3b82f6',
    'Concluído': '#22c55e',
    'Entregue': '#14b8a6',
    'Cancelado': '#ef4444',
};

export default function ServiceStatusChart({ data, valueType = 'number' }: ServiceStatusChartProps) {
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Status das Ordens de Serviço</CardTitle>
                <CardDescription>Distribuição de todas as ordens de serviço ativas.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={(props) => {
                                const { name, percent } = props as { name?: string; percent?: number };
                                return name && percent !== undefined
                                    ? `${name} (${(percent * 100).toFixed(0)}%)`
                                    : name || '';
                            }}
                        >
                            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#8884d8'} />)}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => {
                                if (valueType === 'currency') {
                                    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
                                }
                                return `${value} O.S.`;
                            }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
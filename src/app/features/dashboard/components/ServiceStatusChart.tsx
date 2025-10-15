'use client';

import { Pie, PieChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

interface ChartData {
    name: string;
    value: number;
    fill: string;
    label: string;
}

interface ServiceStatusChartProps {
    data: ChartData[];
    chartConfig: ChartConfig;
    valueType?: 'currency' | 'number';
}

export default function ServiceStatusChart({ data, chartConfig, valueType = 'number' }: ServiceStatusChartProps) {
    return (
        <Card className="col-span-1 lg:col-span-2 flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Status das Ordens de Serviço</CardTitle>
                <CardDescription>Distribuição do valor por status</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent
                                formatter={(value) => valueType === 'currency' ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value as number) : `${value} O.S.`}
                            />}
                        />
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="label"
                            innerRadius={60}
                            outerRadius={120}
                        />
                        <ChartLegend
                            content={<ChartLegendContent nameKey="name" />}
                            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';

interface ChartData {
    name: string;
    [key: string]: string | number;
}

interface TimeSeriesLineChartProps {
    data: ChartData[];
    title: string;
    description?: string;
    lineDataKey: string;
    lineLabel: string;
    lineColor: string;
    footer?: React.ReactNode;
}

export default function TimeSeriesLineChart({ data, title, description, lineDataKey, lineLabel, lineColor, footer }: TimeSeriesLineChartProps) {

    const chartConfig = {
        [lineDataKey]: {
            label: lineLabel,
            color: lineColor,
        },
    } satisfies ChartConfig;

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className="pl-2">
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={data} accessibilityLayer>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="name"
                                type="category"
                                allowDuplicatedCategory={false}
                                interval="preserveStartEnd"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey={lineDataKey} stroke={`var(--color-${lineDataKey})`} strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            {footer && <CardFooter>{footer}</CardFooter>}
        </Card>
    );
}
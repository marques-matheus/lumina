'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, LabelList } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';

interface ChartData {
    name: string;
    value: number;
}

interface HorizontalBarChartProps {
    data: ChartData[];
    title: string;
    description: string;
    barDataKey: string;
    barFill: string;
    className?: string;
}

export default function HorizontalBarChart({ data, title, description, barDataKey, barFill, className }: HorizontalBarChartProps) {

    const chartConfig = {
        [barDataKey]: {
            label: title,
            color: barFill,
        },
    } satisfies ChartConfig;

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }} accessibilityLayer>
                            <XAxis type="number" hide />
                            <YAxis
                                type="category"
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={120}
                                tick={{ dx: -5 }}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Bar dataKey={barDataKey} fill={`var(--color-${barDataKey})`} radius={4} background={{ fill: '#eee', radius: 4 }}>
                                <LabelList dataKey={barDataKey} position="right" style={{ fill: '#333', fontSize: 12 }} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
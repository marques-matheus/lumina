'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LabelList } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
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
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey={barDataKey} fill={barFill} radius={[0, 4, 4, 0]} background={{ fill: '#eee', radius: 4 }}>
                            <LabelList dataKey={barDataKey} position="right" style={{ fill: '#333', fontSize: 12 }} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
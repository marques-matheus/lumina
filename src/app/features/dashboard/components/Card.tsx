// src/features/dashboard/components/DashboardCard.tsx

import { Card, CardContent,  CardHeader, CardTitle } from "@/components/ui/card";
import { type Product } from "@/types";

type CardProps = {
    title: string;
    value: number;
    description: string;
    type: 'currency' | 'number' | 'list';
    icon?: React.ReactNode; // Ícone agora é uma prop opcional
    data?: Partial<Product>[]; // Lista de dados para o tipo 'list'
};

export function DashboardCard({ title, value, description, type, icon, data }: CardProps) {

    const formatValue = () => {
        if (type === 'currency') {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
        }
        return value.toString();
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatValue()}</div>
                <p className="text-xs text-muted-foreground">{description}</p>

                {type === 'list' && data && data.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {data.slice(0, 3).map(item => ( 
                            <div key={item.id || item.name} className="flex justify-between items-center text-sm">
                                <span className="truncate pr-2">{item.name}</span>
                                <span className="font-semibold text-red-500">{item.quantity} un.</span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
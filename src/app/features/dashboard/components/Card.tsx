import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { type Product } from "@/types";

type CardProps = {
    title: string;
    value: number;
    description: string;
    footer?: React.ReactNode;
    type: 'currency' | 'number' | 'list';
    icon?: React.ReactNode;
    data?: Partial<Product>[] | { name: string, quantity: number }[];
};

export function DashboardCard({ title, value, description, type, icon, data, footer }: CardProps) {
    const formatValue = () => {
        if (type === 'currency') {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
        }
        if (type === 'list') {
            return value;
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
                    <div className="mt-4 space-y-2 text-sm">
                        {data.map((item, index) => (
                            <div key={(item as any).id || item.name || index} className="flex justify-between items-center">
                                <span className="truncate pr-2">{item.name}</span>
                                <span className="font-semibold">{item.quantity} un.</span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            {footer && (
                <CardFooter>
                    {footer}
                </CardFooter>
            )}
        </Card>
    );
}
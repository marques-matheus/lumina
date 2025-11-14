'use client';

import { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductSpecificationsProps {
    product: Product;
}

export default function ProductSpecifications({ product }: ProductSpecificationsProps) {
    if (!product.specifications || Object.keys(product.specifications).length === 0) {
        return null;
    }

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle className="text-base">Especificações Técnicas</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground font-medium">{key}</span>
                            <Badge variant="default" className="w-fit text-xs">
                                {value}
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

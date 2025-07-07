'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { type SalesHistoryEntry } from '@/types'; // Precisaremos criar este tipo

export default function SalesTable({ sales }: { sales: SalesHistoryEntry[] }) {

    const handleViewDetails = (saleId: number) => {
        // No futuro, aqui abriríamos um modal para ver todos os detalhes da venda
        console.log("Ver detalhes da venda #", saleId);
    };
    return (
        <Card>
            <CardHeader>
                
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="responsive-table-header">
                            <TableHead>ID Venda</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Itens</TableHead>
                            <TableHead>Valor Total</TableHead>
                            {/* <TableHead className="text-right">Ações</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sales.map(sale => (
                            <TableRow key={sale.id} className={`responsive-table-row odd:bg-secondary even:bg-white dark:even:bg-zinc-700`}>
                                <TableCell className="font-medium">#{sale.id}</TableCell>
                                <TableCell>{new Date(sale.created_at).toLocaleDateString('pt-BR')}</TableCell>
                                <TableCell>{sale.clients?.name || 'Venda Avulsa'}</TableCell>
                                <TableCell>
                                    {/* Mostramos o nome do primeiro produto e indicamos se há mais */}
                                    {sale.sale_items[0]?.products?.name}
                                    {sale.sale_items.length > 1 && ` e mais ${sale.sale_items.length - 1}...`}
                                </TableCell>
                                <TableCell>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.total_amount)}</TableCell>
                                {/* <TableCell className="text-right">
                                    <Button variant="outline" size="icon" onClick={() => handleViewDetails(sale.id)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
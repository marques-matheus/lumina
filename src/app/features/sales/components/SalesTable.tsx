"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type SalesHistoryEntry } from "@/types";
import SaleDetailsDialog from "./SaleDetailsDialog";

export default function SalesTable({ sales }: { sales: SalesHistoryEntry[] }) {
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
                            <TableHead className="text-right">Ações</TableHead>
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
                                <TableCell className="text-right">
                                    <SaleDetailsDialog sale={sale} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
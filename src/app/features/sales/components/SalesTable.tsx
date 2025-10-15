"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type SalesHistoryEntry } from "@/types";
import SaleDetailsDialog from "./SaleDetailsDialog";

export default function SalesTable({ sales }: { sales: SalesHistoryEntry[] }) {
    return (
        <>
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
                    {sales.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhuma venda encontrada.</TableCell>
                        </TableRow>
                    ) : (
                        sales.map(sale => (
                            <TableRow key={sale.id} className={`responsive-table-row odd:bg-secondary even:bg-white in-dark:even:bg-zinc-700`}>
                                <TableCell className="responsive-table-cell font-medium" data-label="ID Venda:">#{sale.id}</TableCell>
                                <TableCell className="responsive-table-cell" data-label="Data:">{new Date(sale.created_at).toLocaleDateString('pt-BR')}</TableCell>
                                <TableCell className="responsive-table-cell" data-label="Cliente:">{sale.clients?.name || 'Venda Avulsa'}</TableCell>
                                <TableCell className="responsive-table-cell" data-label="Itens:">
                                    {sale.sale_items[0]?.products?.name}
                                    {sale.sale_items.length > 1 && ` e mais ${sale.sale_items.length - 1}...`}
                                </TableCell>
                                <TableCell className="responsive-table-cell" data-label="Valor Total:">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.total_amount)}</TableCell>
                                <TableCell className="responsive-actions-cell text-right">
                                    <SaleDetailsDialog sale={sale} />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </>
    )
}
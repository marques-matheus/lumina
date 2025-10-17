"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type SalesHistoryEntry } from "@/types";
import SaleDetailsDialog from "./SaleDetailsDialog";

export default function SalesTable({ sales }: { sales: SalesHistoryEntry[] }) {
    return (
        <div className="rounded-md border md:border-0">
            <Table>
                <TableHeader>
                    <TableRow className="responsive-table-header">
                        <TableHead>ID</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Itens</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sales.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-sm">Nenhuma venda encontrada.</p>
                                    <p className="text-xs">Registre uma venda para começar.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        sales.map(sale => (
                            <TableRow key={sale.id} className="responsive-table-row md:odd:bg-secondary md:even:bg-white md:dark:even:bg-zinc-700 hover:bg-muted/50 transition-colors">
                                <TableCell className="responsive-table-cell font-medium" data-label="ID">#{sale.id}</TableCell>
                                <TableCell className="responsive-table-cell" data-label="Data">
                                    {new Date(sale.created_at).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell className="responsive-table-cell" data-label="Cliente">
                                    {sale.clients?.name || <span className="text-muted-foreground italic">Venda Avulsa</span>}
                                </TableCell>
                                <TableCell className="responsive-table-cell" data-label="Itens">
                                    <div className="flex flex-col">
                                        <span className="text-sm">{sale.sale_items[0]?.products?.name}</span>
                                        {sale.sale_items.length > 1 && (
                                            <span className="text-xs text-muted-foreground">+ {sale.sale_items.length - 1} {sale.sale_items.length === 2 ? 'item' : 'itens'}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="responsive-table-cell md:text-right font-medium" data-label="Total">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.total_amount)}
                                </TableCell>
                                <TableCell className="responsive-actions-cell md:text-right">
                                    <SaleDetailsDialog sale={sale} />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
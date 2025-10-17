'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type Purchase, type Product } from "@/types/index"

export default function PurchasesTable({ purchases, allProducts }: { purchases: Purchase[], allProducts: Product[] }) {
    return (
        <div className="rounded-md border md:border-0">
            <Table>
                <TableHeader>
                    <TableRow className="responsive-table-header">
                        <TableHead>Data</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Fornecedor</TableHead>
                        <TableHead className="text-center">Qtd</TableHead>
                        <TableHead>Valor Un.</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {purchases.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-sm">Nenhuma compra encontrada.</p>
                                    <p className="text-xs">Registre uma compra para começar.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        purchases.map((purchase) => (
                            <TableRow key={purchase.id} className="responsive-table-row md:odd:bg-secondary md:even:bg-white md:dark:even:bg-zinc-700 hover:bg-muted/50 transition-colors">
                                <TableCell data-label="Data" className="responsive-table-cell">
                                    {new Date(purchase.purchase_date).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell data-label="Produto" className="responsive-table-cell font-medium">
                                    <div className="flex flex-col">
                                        <span>{purchase.products?.name || 'Produto Desconhecido'}</span>
                                        <span className="text-xs text-muted-foreground">{purchase.products?.brand || 'Sem marca'}</span>
                                    </div>
                                </TableCell>
                                <TableCell data-label="Fornecedor" className="responsive-table-cell">
                                    {purchase.supplier || '-'}
                                </TableCell>
                                <TableCell data-label="Quantidade" className="responsive-table-cell md:text-center">
                                    {purchase.quantity}
                                </TableCell>
                                <TableCell data-label="Valor Un." className="responsive-table-cell">
                                    {purchase.cost_per_unit.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}
                                </TableCell>
                                <TableCell data-label="Total" className="responsive-table-cell md:text-right font-medium">
                                    {(purchase.quantity * purchase.cost_per_unit).toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

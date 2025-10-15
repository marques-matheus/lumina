'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type Purchase, type Product } from "@/types/index"

export default function PurchasesTable({ purchases, allProducts }: { purchases: Purchase[], allProducts: Product[] }) {
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow className="responsive-table-header">
                        <TableHead>Data</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Fornecedor</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Valor por Unidade</TableHead>
                        <TableHead>Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {purchases.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhuma compra encontrada.</TableCell>
                        </TableRow>
                    ) : (
                        purchases.map((purchase) => (
                            <TableRow key={purchase.id} className={`responsive-table-row odd:bg-secondary even:bg-white in-dark:even:bg-zinc-700`}>
                                <TableCell data-label="Data:" className="responsive-table-cell">
                                    {new Date(purchase.purchase_date).toLocaleDateString('pt-BR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })}
                                </TableCell>
                                <TableCell data-label="Produto:" className="responsive-table-cell">
                                    {purchase.products?.name || 'Produto Desconhecido'} - {purchase.products?.brand || 'Marca Desconhecida'}
                                </TableCell>
                                <TableCell data-label="Fornecedor:" className="responsive-table-cell">
                                    {purchase.supplier || 'Fornecedor Desconhecido'}
                                </TableCell>
                                <TableCell data-label="Quantidade:" className="responsive-table-cell">
                                    {purchase.quantity}
                                </TableCell>
                                <TableCell data-label="Valor por Unidade:" className="responsive-table-cell">
                                    {purchase.cost_per_unit.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}
                                </TableCell>
                                <TableCell data-label="Total:" className="responsive-table-cell">
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
        </>
    )
}

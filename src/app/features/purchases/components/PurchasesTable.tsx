'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Purchase } from "@/types/index"

export default function PurchasesTable({ purchases }: { purchases: Purchase[] }) {
    return (
        <Card>
            <CardHeader>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Produto</TableHead>
                            <TableHead>Fornecedor</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Valor por Unidade</TableHead>
                            <TableHead>Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchases.map((purchase) => (
                            <TableRow key={purchase.id} className={`responsive-table-row odd:bg-secondary even:bg-white dark:even:bg-zinc-700`}>
                                <TableCell>
                                    {new Date(purchase.purchase_date).toLocaleDateString('pt-BR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })}
                                </TableCell>
                                <TableCell>
                                    {purchase.products?.name || 'Produto Desconhecido'} - {purchase.products?.brand || 'Marca Desconhecida'}
                                </TableCell>
                                <TableCell>{purchase.supplier || 'Fornecedor Desconhecido'}</TableCell>
                                <TableCell>{purchase.quantity}</TableCell>
                                <TableCell>
                                    {purchase.cost_per_unit.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}
                                </TableCell>
                                <TableCell>
                                    {(purchase.quantity * purchase.cost_per_unit).toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}


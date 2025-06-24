'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { type ServiceOrder } from '@/types';
import { useServiceOrderStore } from '@/stores/serviceOrderStore';
import { CategoryFilter } from '@/components/shared/CategoryFilter';
import SearchInput from '@/components/shared/SearchInput';


export default function ServiceOrdersTable({ serviceOrders }: { serviceOrders: ServiceOrder[] }) {

    const { openModal } = useServiceOrderStore()

    const handleViewDetailsClick = (order: ServiceOrder) => {
        openModal(order);
    };

    const statuses = ["Aguardando Avaliação", "Em Reparo", "Aguardando Peças", "Concluído", "Entregue", "Cancelado"];

    return (
        <Card>
            <CardHeader>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    <div className='flex flex-col md:flex-row gap-2'>
                        <CategoryFilter title="Filtrar por Status" paramName="status" options={statuses} />
                        <SearchInput placeholder="Buscar por cliente..." />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="responsive-table-header">
                            <TableHead>Cliente / O.S.</TableHead>
                            <TableHead>Equipamento</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {serviceOrders.map((order) => (
                            <TableRow key={order.id} className="responsive-table-row odd:bg-secondary even:bg-white in-dark:even:bg-zinc-700">
                                <TableCell data-label="Cliente / O.S.:" className="responsive-table-cell">
                                    <div className="font-medium">{order.clients?.name}</div>
                                    <div className="text-sm text-muted-foreground">O.S. #{order.id}</div>
                                </TableCell>
                                <TableCell data-label="Equipamento:" className="responsive-table-cell">{`${order.equip_brand} ${order.equip_model}`}</TableCell>
                                <TableCell data-label="Status:" className="responsive-table-cell">{order.status}</TableCell>
                                <TableCell data-label="Valor:" className="responsive-table-cell">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}</TableCell>
                                <TableCell className="responsive-actions-cell text-right">
                                    <Button variant="outline" size="sm" onClick={() => handleViewDetailsClick(order)}>
                                        <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
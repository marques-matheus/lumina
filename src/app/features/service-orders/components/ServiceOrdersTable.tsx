'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { ServiceOrder } from '@/types';
import { useServiceOrderStore } from '@/stores/serviceOrderStore';
import SearchInput from '@/components/shared/SearchInput';


export default function ServiceOrdersTable({ serviceOrders }: { serviceOrders: ServiceOrder[] }) {

    const { openModal } = useServiceOrderStore()

    const handleViewDetailsClick = (order: ServiceOrder) => {
        openModal(order);
    };

    return (
        <>
            <Card>
                <CardHeader><div className='flex items-center justify-between'>
                    <CardTitle>Ordens de Serviço</CardTitle>
                    <SearchInput placeholder="Buscar ordem de serviço por cliente..." /></div></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cliente / O.S.</TableHead>
                                <TableHead>Equipamento</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {serviceOrders.map((order) => (
                                <TableRow key={order.id} className={`${order.id % 2 === 0 ? 'bg-zinc-200' : 'bg-white'}`}>
                                    <TableCell>
                                        <div className="font-medium">{order.clients?.name}</div>
                                        <div className="text-sm text-muted-foreground">O.S. #{order.id}</div>
                                    </TableCell>
                                    <TableCell>{`${order.equip_brand} ${order.equip_model}`}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}</TableCell>
                                    <TableCell className="text-right">
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

        </>
    );
}
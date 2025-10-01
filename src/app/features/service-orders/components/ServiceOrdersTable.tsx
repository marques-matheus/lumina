'use client';

import { useState } from 'react';
import { type ServiceOrder } from '@/types';
import { useServiceOrderStore } from '@/stores/serviceOrderStore';

// UI Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

export default function ServiceOrdersTable({ serviceOrders }: { serviceOrders: ServiceOrder[] }) {
    const { openModal } = useServiceOrderStore();

    const getBadgeColor = (status: string) => {
        switch (status) {
            case "Aguardando Avaliação": return "waiting";
            case "Em Andamento": return "inProgress";
            case "Concluído": return "completed";
            case "Entregue": return "delivered";
            case "Cancelado": return "canceled";
            default: return "default";
        }
    };

    return (
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
                {serviceOrders.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Nenhuma ordem de serviço encontrada.</TableCell>
                    </TableRow>
                ) : (
                    serviceOrders.map((order) => (
                        <TableRow key={order.id} className="responsive-table-row odd:bg-secondary even:bg-white in-dark:even:bg-zinc-700">
                            <TableCell data-label="Cliente / O.S.:" className="responsive-table-cell">
                                <div className="font-medium">{order.clients?.name}</div>
                                <div className="text-sm text-muted-foreground">O.S. #{order.id}</div>
                            </TableCell>
                            <TableCell data-label="Equipamento:" className="responsive-table-cell">{`${order.equip_brand} ${order.equip_model}`}</TableCell>
                            <TableCell data-label="Status:" className="responsive-table-cell">
                                <Badge variant={getBadgeColor(order.status)} className="w-fit">{order.status}</Badge>
                            </TableCell>
                            <TableCell data-label="Valor:" className="responsive-table-cell">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}</TableCell>
                            <TableCell className="responsive-actions-cell text-right">
                                <Button variant="ghost" size="icon" onClick={() => openModal(order)}>
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">Ver Detalhes</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
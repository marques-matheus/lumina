'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { type ServiceOrder, type Client } from '@/types';
import { useServiceOrderStore } from '@/stores/serviceOrderStore';
import { useSession } from '@/providers/SessionProvider';
import { Badge } from '@/components/ui/badge';


export default function ServiceOrdersTable({ serviceOrders }: { serviceOrders: ServiceOrder[], clients?: Client[] }) {

    const { openModal } = useServiceOrderStore()

    const handleViewDetailsClick = (order: ServiceOrder) => {
        openModal(order);
    };
    const session = useSession();

    if (!session?.does_provide_service) {
        return (
            <div className="text-sm text-muted-foreground py-8 text-center">
                Para acessar esta página, você precisa ser prestador de serviços
            </div>
        );
    }

    const getBadgeColor = (status: string) => {
        switch (status) {
            case "Aguardando Avaliação":
                return "waiting";
            case "Em Andamento":
                return "inProgress";
            case "Concluído":
                return "completed";
            case "Entregue":
                return "delivered";
            case "Cancelado":
                return "canceled";
            default:
                return "default";
        }
    };

    return (
        <div className="rounded-md border md:border-0">
            <Table>
                <TableHeader>
                    <TableRow className="responsive-table-header">
                        <TableHead>Cliente / O.S.</TableHead>
                        <TableHead>Equipamento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {serviceOrders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-sm">Nenhuma ordem de serviço encontrada.</p>
                                    <p className="text-xs">Crie uma nova O.S. para começar.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        serviceOrders.map((order) => (
                            <TableRow key={order.id} className="responsive-table-row md:odd:bg-secondary md:even:bg-white md:dark:even:bg-zinc-700 hover:bg-muted/50 transition-colors">
                                <TableCell className="responsive-table-cell" data-label="Cliente / O.S.">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-medium">{order.clients?.name}</span>
                                        <span className="text-xs text-muted-foreground">O.S. #{order.id}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="responsive-table-cell" data-label="Equipamento">
                                    {`${order.equip_brand} ${order.equip_model}`}
                                </TableCell>
                                <TableCell className="responsive-table-cell" data-label="Status">
                                    <Badge variant={getBadgeColor(order.status)} className="w-full sm:w-fit sm:min-w-[100px] text-[10px] sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 text-center">
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="responsive-table-cell md:text-right font-medium" data-label="Valor">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                                </TableCell>
                                <TableCell className="responsive-actions-cell md:text-right">
                                    <Button variant="outline" size="sm" onClick={() => handleViewDetailsClick(order)} className="h-8 text-xs w-full md:w-auto">
                                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                                        Ver Detalhes
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
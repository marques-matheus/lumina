'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { type ServiceOrder, type Client } from '@/types';
import { useServiceOrderStore } from '@/stores/serviceOrderStore';
import { CategoryFilter } from '@/components/shared/CategoryFilter';
import SearchInput from '@/components/shared/SearchInput';
import { useSession } from '@/providers/SessionProvider';
import { Badge } from '@/components/ui/badge';
import AddServiceOrderDialog from './AddServiceOrderForm';


export default function ServiceOrdersTable({ serviceOrders, clients }: { serviceOrders: ServiceOrder[], clients: Client[] }) {

    const { openModal } = useServiceOrderStore()

    const handleViewDetailsClick = (order: ServiceOrder) => {
        openModal(order);
    };
    const session = useSession();
    const statuses = ["Aguardando Avaliação", "Em Andamento", "Concluído", "Entregue", "Cancelado"];

    if (!session?.does_provide_service) {
        return (
            <Card>
                <CardHeader>
                    <div className="text-sm text-muted-foreground">
                        Para acessar esta página, você precisa ser prestador de serviços
                    </div>
                </CardHeader>
            </Card>
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
        <Card>
            <CardHeader>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    <div className='flex flex-col md:flex-row gap-2'>
                        <CategoryFilter title="Filtrar por Status" paramName="status" options={statuses} />
                        <SearchInput placeholder="Buscar por cliente..." />
                    </div>
                    <AddServiceOrderDialog clients={clients} />
                </div>
            </CardHeader>
            <CardContent>
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
                                        <TableCell data-label="Cliente / O.S." className="responsive-table-cell">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-medium">{order.clients?.name}</span>
                                                <span className="text-xs text-muted-foreground">O.S. #{order.id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell data-label="Equipamento" className="responsive-table-cell">
                                            <span className="text-sm">{`${order.equip_brand} ${order.equip_model}`}</span>
                                        </TableCell>
                                        <TableCell data-label="Status" className="responsive-table-cell">
                                            <Badge variant={getBadgeColor(order.status)} className="w-fit text-xs">
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell data-label="Valor" className="responsive-table-cell md:text-right font-medium">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                                        </TableCell>
                                        <TableCell className="responsive-actions-cell text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleViewDetailsClick(order)} className="h-8 text-xs">
                                                <Eye className="mr-1.5 h-3.5 w-3.5" />
                                                <span className="hidden sm:inline">Ver Detalhes</span>
                                                <span className="sm:hidden">Ver</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
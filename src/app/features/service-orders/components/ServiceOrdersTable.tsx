'use client';



import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Eye, PencilIcon, PrinterIcon, SaveIcon } from 'lucide-react';
import { ServiceOrder } from '@/types';
import PrintableOrder from './PrintableOrder';

import { useServiceOrderStore } from '@/stores/serviceOrderStore';


export default function ServiceOrdersTable({ serviceOrders }: { serviceOrders: ServiceOrder[] }) {

    const { openModal } = useServiceOrderStore()

    const handleViewDetailsClick = (order: ServiceOrder) => {
        openModal(order);
    };

    return (
        <>
            <Card>
                <CardHeader><CardTitle>Ordens de Serviço</CardTitle></CardHeader>
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
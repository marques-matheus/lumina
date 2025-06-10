'use client';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Pencil, PencilIcon, Printer, PrinterIcon } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';

type ServiceOrder = {
    id: number;
    created_at: string;
    clients: {
        name: string;
    } | null;
    equip_brand: string;
    equip_model: string;
    serial_number: string;
    type: string;
    items?: string;
    status: string;
    problem_description: string;
    total: number;
    delivered_at: string | null;
};
const ServiceOrdersTable = ({ serviceOrders }: { serviceOrders: ServiceOrder[] }) => {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedServiceOrder, setSelectedServiceOrder] = useState<ServiceOrder | null>(null);

    const handleEditClick = (serviceOrder: ServiceOrder) => {
        setSelectedServiceOrder(serviceOrder);
        setIsDialogOpen(true);
    };

    const StatusChange = (newStatus: string) => {
        if (!selectedServiceOrder) return;
        const updatedServiceOrder = {
            ...selectedServiceOrder,
            status: newStatus
        };
        supabase
            .from('service_orders')
            .update({ status: newStatus })
            .match({ id: selectedServiceOrder.id })
            .then(({ error }) => {
                if (error) {
                    alert('Erro ao atualizar status da ordem de serviço.');
                } else {
                    setSelectedServiceOrder(updatedServiceOrder);
                    setIsDialogOpen(false);
                    router.refresh();
                }
            });
    };  



    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Ordens de serviço</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Data de Entrada</TableHead>
                                <TableHead className="w-[100px]">Cliente</TableHead>
                                <TableHead className="w-[100px]">Equipamento</TableHead>
                                <TableHead className="w-[100px]">Tipo</TableHead>
                                <TableHead className="w-[100px]">Total</TableHead>
                                <TableHead className="w-[100px]">Status</TableHead>
                                <TableHead className="w-[100px] text-center">Detalhes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {serviceOrders.map((serviceOrder) => (
                                <TableRow key={serviceOrder.id} className={`${serviceOrder.id % 2 === 0 ? 'bg-gray-100' : ''}`}>
                                    <TableCell>
                                        {new Date(serviceOrder.created_at).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </TableCell>
                                    <TableCell>{serviceOrder.clients?.name}</TableCell>
                                    <TableCell>{serviceOrder.equip_brand} {serviceOrder.equip_model}</TableCell>
                                    <TableCell>{serviceOrder.type}</TableCell>
                                    <TableCell>{serviceOrder.total}</TableCell>
                                    <TableCell>{serviceOrder.status}</TableCell>
                                    <TableCell className='flex items-center justify-center'>
                                        <button onClick={() => handleEditClick(serviceOrder)}>
                                            <Eye className="h-8 w-8 cursor-pointer hover:scale-105 hover:text-gray-500" />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Produto</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-3 gap-2">
                        <p className="font-semibold text-right">Cliente:</p>
                        <p className="col-span-2">{selectedServiceOrder?.clients?.name}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <p className="font-semibold text-right">Equipamento:</p>
                        <p className="col-span-2">{selectedServiceOrder?.equip_brand} {selectedServiceOrder?.equip_model}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <p className="font-semibold text-right">Número de Série:</p>
                        <p className="col-span-2">{selectedServiceOrder?.serial_number}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <p className="font-semibold text-right">Tipo:</p>
                        <p className="col-span-2">{selectedServiceOrder?.type}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <p className="font-semibold text-right">Itens:</p>
                        <p className="col-span-2">{selectedServiceOrder?.items}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <p className="font-semibold text-right">Descrição do Problema:</p>
                        <p className="col-span-2">{selectedServiceOrder?.problem_description}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <p className="font-semibold text-right">Total:</p>
                        <p className="col-span-2">{selectedServiceOrder?.total}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <p className="font-semibold text-right">Status:</p>
                        <Select
                            defaultValue={selectedServiceOrder?.status}
                            onValueChange={(value) => StatusChange(value)}
                            
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={selectedServiceOrder?.status} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pendente">Pendente</SelectItem>
                                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                                <SelectItem value="Concluído">Concluído</SelectItem>
                                <SelectItem value="Cancelado">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <p className="font-semibold text-right">Data de Entrega:</p>
                        <p className="col-span-2">
                            {selectedServiceOrder?.delivered_at
                                ? new Date(selectedServiceOrder.delivered_at).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                })
                                : 'Não entregue'}
                        </p>
                    </div>
                    <DialogFooter>
                        <Button><PencilIcon size={35} /></Button>
                        <Button><PrinterIcon size={35} /></Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
export default ServiceOrdersTable;
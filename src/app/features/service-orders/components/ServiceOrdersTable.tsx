'use client';

import { useState, FormEvent, ChangeEvent, useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

import { updateServiceOrder } from '../actions';
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
import { toast } from 'sonner';


type ServiceOrderFormData = {
    type: string;
    equip_brand: string;
    equip_model: string;
    serial_number: string;
    items: string;
    problem_description: string;
    total: string;
};

export default function ServiceOrdersTable({ serviceOrders }: { serviceOrders: ServiceOrder[] }) {
    const router = useRouter();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedServiceOrder, setSelectedServiceOrder] = useState<ServiceOrder | null>(null);
    const [editFormData, setEditFormData] = useState<ServiceOrderFormData | null>(null);

    const initialState = { success: false, message: '' };
    const [state, formAction] = useActionState(updateServiceOrder, initialState);

    const handleViewDetailsClick = (serviceOrder: ServiceOrder) => {
        setSelectedServiceOrder(serviceOrder);
        setIsDialogOpen(true);
        setIsEditing(false);
    };

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            setIsDialogOpen(false);
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

    const handleEnterEditMode = () => {
        if (!selectedServiceOrder) return;
        setEditFormData({
            type: selectedServiceOrder.type,
            equip_brand: selectedServiceOrder.equip_brand,
            equip_model: selectedServiceOrder.equip_model,
            serial_number: selectedServiceOrder.serial_number,
            items: selectedServiceOrder.items || '',
            problem_description: selectedServiceOrder.problem_description,
            total: selectedServiceOrder.total.toString(),
        });
        setIsEditing(true);
    };

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editFormData) return;
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!selectedServiceOrder) return;
        const { error } = await supabase
            .from('service_orders').update({ status: newStatus }).match({ id: selectedServiceOrder.id });

        if (error) {
            alert('Erro ao atualizar o status.');
        } else {
            router.refresh();
            setSelectedServiceOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }
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
                                <TableRow key={order.id}>
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
            <div className='hidden print:block'>
                <PrintableOrder order={selectedServiceOrder} />
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detalhes da O.S. #{selectedServiceOrder?.id}</DialogTitle>
                    </DialogHeader>

                    {isEditing ? (
                        <form id="edit-form" action={formAction} className="grid grid-cols-2 gap-4 py-4">
                            <Input type="hidden" name="id" defaultValue={selectedServiceOrder?.id || ''} />
                            <div className="space-y-1"><Label htmlFor="type">Tipo</Label><Input id="type" name="type" value={editFormData?.type} onChange={handleFormChange} /></div>
                            <div className="space-y-1"><Label htmlFor="equip_brand">Marca</Label><Input id="equip_brand" name="equip_brand" value={editFormData?.equip_brand} onChange={handleFormChange} /></div>
                            <div className="space-y-1"><Label htmlFor="equip_model">Modelo</Label><Input id="equip_model" name="equip_model" value={editFormData?.equip_model} onChange={handleFormChange} /></div>
                            <div className="space-y-1"><Label htmlFor="serial_number">Nº de Série</Label><Input id="serial_number" name="serial_number" value={editFormData?.serial_number} onChange={handleFormChange} /></div>
                            <div className="col-span-2 space-y-1"><Label htmlFor="items">Itens Acompanhantes</Label><Input id="items" name="items" value={editFormData?.items} onChange={handleFormChange} /></div>
                            <div className="col-span-2 space-y-1"><Label htmlFor="problem_description">Problema Relatado</Label><Textarea id="problem_description" name="problem_description" value={editFormData?.problem_description} onChange={handleFormChange} /></div>
                            <div className="space-y-1"><Label htmlFor="total">Valor Total</Label><Input id="total" name="total" type="number" step="0.01" value={editFormData?.total} onChange={handleFormChange} /></div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-2 gap-y-2 gap-x-8 py-4">
                            <p className="font-semibold">Cliente:</p><p>{selectedServiceOrder?.clients?.name}</p>
                            <p className="font-semibold">Equipamento:</p><p>{`${selectedServiceOrder?.equip_brand} ${selectedServiceOrder?.equip_model}`}</p>
                            <p className="font-semibold">Nº de Série:</p><p>{selectedServiceOrder?.serial_number}</p>
                            <p className="font-semibold">Itens:</p><p>{selectedServiceOrder?.items || 'N/A'}</p>
                            <p className="font-semibold col-span-2">Problema Relatado:</p><p className="col-span-2">{selectedServiceOrder?.problem_description}</p>
                            <p className="font-semibold">Valor Total:</p><p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedServiceOrder?.total || 0)}</p>
                            <p className="font-semibold">Status:</p>
                            <Select value={selectedServiceOrder?.status} onValueChange={handleStatusChange}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Aguardando Avaliação">Aguardando Avaliação</SelectItem>
                                    <SelectItem value="Em Reparo">Em Reparo</SelectItem>
                                    <SelectItem value="Concluído">Concluído</SelectItem>
                                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                                    <SelectItem value="Entregue">Entregue</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <DialogFooter>
                        {isEditing ? (
                            <>
                                <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancelar</Button>
                                <Button type="submit" form="edit-form"><SaveIcon className="mr-2 h-4 w-4" /> Salvar Alterações</Button>
                            </>
                        ) : (
                            <>
                                <DialogClose asChild><Button variant="secondary">Fechar</Button></DialogClose>
                                <Button variant="outline" onClick={() => window.print()} ><PrinterIcon className="mr-2 h-4 w-4" /> Imprimir</Button>
                                <Button onClick={handleEnterEditMode}><PencilIcon className="mr-2 h-4 w-4" /> Editar</Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
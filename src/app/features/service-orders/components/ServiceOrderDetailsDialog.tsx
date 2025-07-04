'use client';

import { useState, ChangeEvent, useEffect, useActionState } from 'react';
import { useServiceOrderStore } from '@/stores/serviceOrderStore';
import { updateServiceOrder } from '@/app/features/service-orders/actions';
import { type ServiceOrder } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PencilIcon, PrinterIcon } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { SubmitButton } from '@/components/shared/submitButton';
import PrintableOrder from './PrintableOrder';


type ServiceOrderFormData = {
    type: string;
    equip_brand: string;
    equip_model: string;
    serial_number: string;
    items: string;
    problem_description: string;
    total_value: string;
};



export default function ServiceOrderDetailsDialog() {

    const {
        isDialogOpen,
        isEditing,
        selectedOrder,
        closeModal,
        enterEditMode,
        exitEditMode,
        updateSelectedOrder,
    } = useServiceOrderStore();


    const [editFormData, setEditFormData] = useState<ServiceOrderFormData | null>(null);
    const initialState = { success: false, message: '', updatedOrder: undefined };
    const [state, formAction] = useActionState(updateServiceOrder, initialState);


    useEffect(() => {
        if (isEditing && selectedOrder) {
            setEditFormData({
                type: selectedOrder.type,
                equip_brand: selectedOrder.equip_brand,
                equip_model: selectedOrder.equip_model,
                serial_number: selectedOrder.serial_number,
                items: selectedOrder.items || '',
                problem_description: selectedOrder.problem_description,
                total_value: selectedOrder.total.toString(),
            });
        } else {
            setEditFormData(null);
        }
    }, [isEditing, selectedOrder]);

    useEffect(() => {
        if (state.success && state.updatedOrder) {
            toast.success(state.message);
            updateSelectedOrder(state.updatedOrder);
            exitEditMode();
        } else if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state, exitEditMode, updateSelectedOrder]);


    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editFormData) return;
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!selectedOrder) return;


        const { data, error } = await supabase
            .from('service_orders')
            .update({ status: newStatus })
            .match({ id: selectedOrder.id })
            .select(`*, clients(name)`)
            .single();

        if (error) {
            toast.error('Erro ao atualizar o status.');
        } else {
            toast.success(`Status atualizado para ${newStatus}.`);
            updateSelectedOrder(data);
        }
    };

    if (!isDialogOpen || !selectedOrder) {
        return null;
    }

    return (
        <>
            <div className='hidden print:block'>
                <PrintableOrder order={selectedOrder} />
            </div>

            <Dialog open={isDialogOpen} onOpenChange={closeModal}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detalhes da O.S. #{selectedOrder.id}</DialogTitle>
                    </DialogHeader>

                    {isEditing ? (
                        <form id="edit-form" action={formAction} className="grid grid-cols-2 gap-4 py-4">
                            <Input type="hidden" name="id" value={selectedOrder.id} />
                            <div className="space-y-1"><Label htmlFor="type">Tipo</Label><Input id="type" name="type" value={editFormData?.type || ''} onChange={handleFormChange} /></div>
                            <div className="space-y-1"><Label htmlFor="equip_brand">Marca</Label><Input id="equip_brand" name="equip_brand" value={editFormData?.equip_brand || ''} onChange={handleFormChange} /></div>
                            <div className="space-y-1"><Label htmlFor="equip_model">Modelo</Label><Input id="equip_model" name="equip_model" value={editFormData?.equip_model || ''} onChange={handleFormChange} /></div>
                            <div className="space-y-1"><Label htmlFor="serial_number">Nº de Série</Label><Input id="serial_number" name="serial_number" value={editFormData?.serial_number || ''} onChange={handleFormChange} /></div>
                            <div className="col-span-2 space-y-1"><Label htmlFor="items">Itens Acompanhantes</Label><Input id="items" name="items" value={editFormData?.items || ''} onChange={handleFormChange} /></div>
                            <div className="col-span-2 space-y-1"><Label htmlFor="problem_description">Problema Relatado</Label><Textarea id="problem_description" name="problem_description" value={editFormData?.problem_description || ''} onChange={handleFormChange} /></div>
                            <div className="space-y-1"><Label htmlFor="total_value">Valor Total</Label><Input id="total_value" name="total_value" type="number" step="0.01" value={editFormData?.total_value || ''} onChange={handleFormChange} /></div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-2 gap-y-2 gap-x-8 py-4">
                            <p className="font-semibold">Cliente:</p><p>{selectedOrder.clients?.name}</p>
                            <p className="font-semibold">Equipamento:</p><p>{`${selectedOrder.equip_brand} ${selectedOrder.equip_model}`}</p>
                            <p className="font-semibold">Tipo:</p><p>{selectedOrder.type}</p>
                            <p className="font-semibold">Nº de Série:</p><p>{selectedOrder.serial_number}</p>
                            <p className="font-semibold">Itens Acompanhantes:</p><p>{selectedOrder.items || 'Nenhum'}</p>
                            <p className="font-semibold">Problema Relatado:</p>
                            <p>{selectedOrder.problem_description || 'Nenhum problema relatado.'}</p>
                            <p className="font-semibold">Valor Total:</p>
                            <p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedOrder.total)}</p>
                            <p className="font-semibold">Data de Abertura:</p>
                            <p>{new Date(selectedOrder.created_at).toLocaleDateString('pt-BR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            })}</p>
                            <p className="font-semibold">Data de Conclusão:</p>
                            <p className="font-semibold">Status:</p>
                            <Select value={selectedOrder.status} onValueChange={handleStatusChange}>
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
                                <Button variant="secondary" onClick={exitEditMode}>Cancelar</Button>
                                {/* <SubmitButton /> */}
                                <Button type="submit" form="edit-form">Salvar Alterações</Button>
                            </>
                        ) : (
                            <>
                                <DialogClose asChild><Button variant="secondary">Fechar</Button></DialogClose>
                                <Button variant="outline" onClick={() => window.print()}><PrinterIcon className="mr-2 h-4 w-4" /> Imprimir</Button>
                                <Button onClick={enterEditMode}><PencilIcon className="mr-2 h-4 w-4" /> Editar</Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
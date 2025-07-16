'use client';

import { useState, ChangeEvent, useEffect, useActionState, useTransition } from 'react';
import { useServiceOrderStore } from '@/stores/serviceOrderStore';
import { updateServiceOrder, updateOrderStatus } from '@/app/features/service-orders/actions';
import { type ServiceOrder } from '@/types';
import { toast } from 'sonner';

// Imports dos componentes ShadCN e ícones...
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PencilIcon, PrinterIcon } from 'lucide-react';
import { SubmitButton } from '@/components/shared/submitButton';
import PrintableOrder from './PrintableOrder';

// O tipo para o nosso formulário, usando os nomes corretos das colunas
type ServiceOrderFormData = {
    type: string;
    equip_brand: string;
    equip_model: string;
    serial_number: string;
    items: string;
    problem_description: string;
    total: string;
};

// Sub-componente para a visualização dos dados (mais limpo)
const OrderView = ({ order }: { order: ServiceOrder }) => (
    <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <div><p className="font-semibold text-muted-foreground">Cliente</p><p>{order.clients?.name}</p></div>
            <div><p className="font-semibold text-muted-foreground">Equipamento</p><p>{`${order.equip_brand} ${order.equip_model}`}</p></div>
            <div><p className="font-semibold text-muted-foreground">Tipo</p><p>{order.type}</p></div>
            <div><p className="font-semibold text-muted-foreground">Itens Acompanhantes</p><p>{order.items || 'Nenhum'}</p></div>
            <div><p className="font-semibold text-muted-foreground">Nº de Série</p><p>{order.serial_number || 'N/A'}</p></div>
            <div><p className="font-semibold text-muted-foreground">Valor Total</p><p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}</p></div>
        </div>
        <div>
            <p className="font-semibold text-muted-foreground">Problema Relatado</p>
            <p className="text-sm p-2 rounded-md mt-1">{order.problem_description}</p>
        </div>
    </div>
);

// Sub-componente para o formulário de edição
const OrderEdit = ({ formData, onFormChange }: { formData: ServiceOrderFormData, onFormChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void }) => (
    <div className="grid grid-cols-2 gap-4 py-4">
        <div className="space-y-1"><Label htmlFor="type">Tipo</Label><Input id="type" name="type" value={formData.type} onChange={onFormChange} /></div>
        <div className="space-y-1"><Label htmlFor="equip_brand">Marca</Label><Input id="equip_brand" name="equip_brand" value={formData.equip_brand} onChange={onFormChange} /></div>
        <div className="space-y-1"><Label htmlFor="equip_model">Modelo</Label><Input id="equip_model" name="equip_model" value={formData.equip_model} onChange={onFormChange} /></div>
        <div className="space-y-1"><Label htmlFor="serial_number">Nº de Série</Label><Input id="serial_number" name="serial_number" value={formData.serial_number} onChange={onFormChange} /></div>
        <div className="col-span-2 space-y-1"><Label htmlFor="items">Itens Acompanhantes</Label><Input id="items" name="items" value={formData.items} onChange={onFormChange} /></div>
        <div className="col-span-2 space-y-1"><Label htmlFor="problem_description">Problema Relatado</Label><Textarea id="problem_description" name="problem_description" value={formData.problem_description} onChange={onFormChange} /></div>
        <div className="space-y-1"><Label htmlFor="total">Valor Total</Label><Input id="total" name="total" type="number" step="0.01" value={formData.total} onChange={onFormChange} /></div>
    </div>
);

// O Componente Principal que orquestra tudo
export default function ServiceOrderDetailsDialog() {
    const { isDialogOpen, isEditing, selectedOrder, closeModal, enterEditMode, exitEditMode, updateSelectedOrder } = useServiceOrderStore();
    const [editFormData, setEditFormData] = useState<ServiceOrderFormData | null>(null);
    const [editFormState, formAction] = useActionState(updateServiceOrder, { success: false, message: '' });
    const [isStatusUpdating, startStatusTransition] = useTransition();

    useEffect(() => {
        if (isEditing && selectedOrder) {
            setEditFormData({
                type: selectedOrder.type,
                equip_brand: selectedOrder.equip_brand,
                equip_model: selectedOrder.equip_model,
                serial_number: selectedOrder.serial_number,
                items: selectedOrder.items || '',
                problem_description: selectedOrder.problem_description,
                total: selectedOrder.total.toString(),
            });
        }
    }, [isEditing, selectedOrder]);

    useEffect(() => {
        if (editFormState.success && editFormState.updatedOrder) {
            toast.success(editFormState.message);
            updateSelectedOrder(editFormState.updatedOrder);
            exitEditMode();
        } else if (editFormState.message && !editFormState.success) {
            toast.error(editFormState.message);
        }
    }, [editFormState, exitEditMode, updateSelectedOrder]);

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editFormData) return;
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleStatusChange = (newStatus: string) => {
        if (!selectedOrder || selectedOrder.status === newStatus) return;
        startStatusTransition(async () => {
            try {
                const updatedOrder = await updateOrderStatus(selectedOrder.id, newStatus);
                updateSelectedOrder(updatedOrder);
                toast.success(`Status atualizado para ${newStatus}.`);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Falha ao atualizar o status.");
            }
        });
    };

    if (!isDialogOpen || !selectedOrder) return null;

    return (
        <>
            <div className='hidden print:block'>
                <PrintableOrder order={selectedOrder} />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detalhes da O.S. #{selectedOrder.id}</DialogTitle>
                    </DialogHeader>

                    {isEditing ? (
                        <form id="edit-form" action={formAction}>
                            <Input type="hidden" name="id" value={selectedOrder.id} />
                            {editFormData && <OrderEdit formData={editFormData} onFormChange={handleFormChange} />}
                        </form>
                    ) : (
                        <OrderView order={selectedOrder} />
                    )}

                    {!isEditing && (
                        <div className="grid grid-cols-2 items-center gap-4 pt-4 border-t">
                            <Label className="font-semibold">Alterar Status</Label>
                            <Select value={selectedOrder.status} onValueChange={handleStatusChange} disabled={isStatusUpdating}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Aguardando Avaliação">Aguardando Avaliação</SelectItem>
                                    <SelectItem value="Em Reparo">Em Reparo</SelectItem>
                                    <SelectItem value="Concluído">Concluído</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <DialogFooter>
                        {isEditing ? (
                            <>
                                <Button variant="secondary" onClick={exitEditMode}>Cancelar</Button>
                                <SubmitButton form="edit-form" text="Salvar Alterações" />
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
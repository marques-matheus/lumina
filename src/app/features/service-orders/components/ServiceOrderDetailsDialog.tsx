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
import { PencilIcon, PrinterIcon, ChevronDown } from 'lucide-react';
import { SubmitButton } from '@/components/shared/submitButton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import PrintableOrder from './PrintableOrder';
import { useSession } from '@/providers/SessionProvider';

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
    <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-8 sm:gap-y-2">
            <div><p className="font-semibold text-muted-foreground text-xs uppercase mb-1">Cliente</p><p className="text-sm">{order.clients?.name}</p></div>
            <div><p className="font-semibold text-muted-foreground text-xs uppercase mb-1">Equipamento</p><p className="text-sm">{`${order.equip_brand} ${order.equip_model}`}</p></div>
            <div><p className="font-semibold text-muted-foreground text-xs uppercase mb-1">Tipo</p><p className="text-sm">{order.type}</p></div>
            <div><p className="font-semibold text-muted-foreground text-xs uppercase mb-1">Itens Acompanhantes</p><p className="text-sm">{order.items || <span className="italic text-muted-foreground">Nenhum</span>}</p></div>
            <div><p className="font-semibold text-muted-foreground text-xs uppercase mb-1">Nº de Série</p><p className="text-sm">{order.serial_number || <span className="italic text-muted-foreground">N/A</span>}</p></div>
            <div><p className="font-semibold text-muted-foreground text-xs uppercase mb-1">Valor Total</p><p className="font-bold text-lg sm:text-xl">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}</p></div>
        </div>
        <div className="border-t pt-3 sm:pt-4">
            <p className="font-semibold text-muted-foreground text-xs uppercase mb-2">Problema Relatado</p>
            <p className="text-sm p-3 bg-muted rounded-md">{order.problem_description}</p>
        </div>
    </div>
);

// Sub-componente para o formulário de edição
const OrderEdit = ({ formData, onFormChange }: { formData: ServiceOrderFormData, onFormChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 py-3 sm:py-4">
        <div className="space-y-1"><Label htmlFor="type" className="text-xs sm:text-sm">Tipo</Label><Input id="type" name="type" value={formData.type} onChange={onFormChange} className="h-8 sm:h-9 text-xs sm:text-sm" /></div>
        <div className="space-y-1"><Label htmlFor="equip_brand" className="text-xs sm:text-sm">Marca</Label><Input id="equip_brand" name="equip_brand" value={formData.equip_brand} onChange={onFormChange} className="h-8 sm:h-9 text-xs sm:text-sm" /></div>
        <div className="space-y-1"><Label htmlFor="equip_model" className="text-xs sm:text-sm">Modelo</Label><Input id="equip_model" name="equip_model" value={formData.equip_model} onChange={onFormChange} className="h-8 sm:h-9 text-xs sm:text-sm" /></div>
        <div className="space-y-1"><Label htmlFor="serial_number" className="text-xs sm:text-sm">Nº de Série</Label><Input id="serial_number" name="serial_number" value={formData.serial_number} onChange={onFormChange} className="h-8 sm:h-9 text-xs sm:text-sm" /></div>
        <div className="col-span-1 sm:col-span-2 space-y-1"><Label htmlFor="items" className="text-xs sm:text-sm">Itens Acompanhantes</Label><Input id="items" name="items" value={formData.items} onChange={onFormChange} className="h-8 sm:h-9 text-xs sm:text-sm" /></div>
        <div className="col-span-1 sm:col-span-2 space-y-1"><Label htmlFor="problem_description" className="text-xs sm:text-sm">Problema Relatado</Label><Textarea id="problem_description" name="problem_description" value={formData.problem_description} onChange={onFormChange} className="text-xs sm:text-sm min-h-20" /></div>
        <div className="space-y-1"><Label htmlFor="total" className="text-xs sm:text-sm">Valor Total</Label><Input id="total" name="total" type="number" step="0.01" value={formData.total} onChange={onFormChange} className="h-8 sm:h-9 text-xs sm:text-sm" /></div>
    </div>
);

// O Componente Principal que orquestra tudo
export default function ServiceOrderDetailsDialog() {
    const { isDialogOpen, isEditing, selectedOrder, closeModal, enterEditMode, exitEditMode, updateSelectedOrder } = useServiceOrderStore();
    const [editFormData, setEditFormData] = useState<ServiceOrderFormData | null>(null);
    const [editFormState, formAction] = useActionState(updateServiceOrder, { success: false, message: '' });
    const [isStatusUpdating, startStatusTransition] = useTransition();
    const user = useSession();

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR');
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const handlePrintA5 = () => {
        window.print();
    };

    const handlePrintThermal = () => {
        if (!selectedOrder) return;

        const printContent = generateOrderReceiptContent();

        const printWindow = window.open('', '_blank', 'width=300,height=600');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Ordem de Serviço #${selectedOrder.id}</title>
                        <style>
                            @media print {
                                @page { 
                                    size: 68mm auto; 
                                    margin: 0; 
                                }
                                body { 
                                    width: 68mm; 
                                    margin: 0; 
                                    padding: 2mm;
                                    font-family: 'Courier New', monospace;
                                    font-size: 11px;
                                    line-height: 1.1;
                                    color: #000 !important;
                                    -webkit-print-color-adjust: exact;
                                    print-color-adjust: exact;
                                }
                                * {
                                    color: #000 !important;
                                    font-weight: bold !important;
                                }
                            }
                            body { 
                                width: 68mm; 
                                margin: 0; 
                                padding: 8px;
                                font-family: 'Courier New', monospace;
                                font-size: 11px;
                                line-height: 1.3;
                                color: #000;
                                background: white;
                            }
                            .center { 
                                text-align: center; 
                                font-weight: bold;
                            }
                            .right { 
                                text-align: right; 
                                font-weight: bold;
                            }
                            .bold { 
                                font-weight: 900 !important; 
                                color: #000 !important;
                            }
                            .separator { 
                                border-top: 2px dashed #000; 
                                margin: 3px 0; 
                                width: 100%;
                            }
                            .item-line {
                                display: flex;
                                justify-content: space-between;
                                margin: 1px 0;
                                font-weight: bold;
                            }
                            strong {
                                font-weight: 900 !important;
                                color: #000 !important;
                            }
                        </style>
                    </head>
                    <body>
                        ${printContent}
                    </body>
                </html>
            `);
            printWindow.document.close();

            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 250);
            };
        }
    };

    const generateOrderReceiptContent = () => {
        if (!selectedOrder) return '';

        return `
            <div class="center bold">
                ${user?.company_name}
            </div>
            <div class="center">
                Ordem de Serviço
            </div>
            <div class="center">
                ${user?.street},${user?.number} - ${user?.city}
            </div>
            <div class="separator"></div>
            
            <div>
                <strong>O.S. Nº:</strong> ${selectedOrder.id}
            </div>
            <div>
                <strong>Data de Entrada:</strong> ${formatDate(selectedOrder.created_at)}
            </div>
            <div>
                <strong>Status:</strong> ${selectedOrder.status}
            </div>
            ${selectedOrder.clients ? `
            <div>
                <strong>Cliente:</strong> ${selectedOrder.clients.name}
            </div>
            ${selectedOrder.clients.phone ? `
            <div>
                <strong>Telefone:</strong> ${selectedOrder.clients.phone}
            </div>
            ` : ''}
            ` : ''}
            
            <div class="separator"></div>
            
            <div class="bold">DADOS DO EQUIPAMENTO:</div>
            <div>
                <strong>Tipo:</strong> ${selectedOrder.type}
            </div>
            <div>
                <strong>Marca/Modelo:</strong> ${selectedOrder.equip_brand} ${selectedOrder.equip_model}
            </div>
            ${selectedOrder.serial_number ? `
            <div>
                <strong>Nº de Série:</strong> ${selectedOrder.serial_number}
            </div>
            ` : ''}
            ${selectedOrder.items ? `
            <div>
                <strong>Itens Acompanhantes:</strong> ${selectedOrder.items}
            </div>
            ` : ''}
            
            <div class="separator"></div>
            
            <div class="bold">PROBLEMA RELATADO:</div>
            <div style="margin-bottom: 8px; text-align: justify;">
                ${selectedOrder.problem_description}
            </div>
            
            <div class="separator"></div>
            
            <div class="item-line bold" style="font-size: 14px;">
                <span>VALOR TOTAL:</span>
                <span>${formatCurrency(selectedOrder.total)}</span>
            </div>
            
            <div class="separator"></div>
            
            <div class="center">
                <strong>CONDIÇÕES GERAIS</strong>
            </div>
            <div style="font-size: 10px; text-align: justify;">
                - Equipamento será entregue mediante
                apresentação desta ordem de serviço.
            </div>
            <div style="font-size: 10px; text-align: justify;">
                - Não nos responsabilizamos por 
                equipamentos não retirados em 90 dias.
            </div>
            <div style="font-size: 10px; text-align: justify;">
                - Garantia de 90 dias para serviços
                realizados (não cobre defeitos de fábrica).
            </div>
            
            <div class="separator"></div>
            
            <div class="center">
                ________________________________
            </div>
            <div class="center">
                Assinatura do Cliente
            </div>
            
            <div class="separator"></div>
            
            <div class="center">
                Obrigado pela confiança!
            </div>
        `;
    };

    if (!isDialogOpen || !selectedOrder) return null;

    return (
        <>
            <div className='hidden print:block'>
                <PrintableOrder order={selectedOrder} />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="w-screen h-screen max-w-full sm:w-auto sm:h-auto sm:max-w-2xl sm:max-h-[90vh] p-4 sm:p-6 overflow-y-auto m-0 sm:m-auto rounded-none sm:rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg">Detalhes da O.S. #{selectedOrder.id}</DialogTitle>
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
                        <div className="flex flex-col sm:grid sm:grid-cols-2 items-start sm:items-center gap-2 sm:gap-4 pt-3 sm:pt-4 border-t">
                            <Label className="font-semibold text-xs sm:text-sm">Alterar Status</Label>
                            <Select value={selectedOrder.status} onValueChange={handleStatusChange} disabled={isStatusUpdating || selectedOrder.status === 'Entregue' || selectedOrder.status === 'Cancelado'}>
                                <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem disabled={selectedOrder.status === 'Entregue' || selectedOrder.status === 'Cancelado' || selectedOrder.status === 'Concluído'} value="Aguardando Avaliação" className="text-xs sm:text-sm">Aguardando Avaliação</SelectItem>
                                    <SelectItem disabled={selectedOrder.status === 'Entregue' || selectedOrder.status === 'Cancelado' || selectedOrder.status === 'Concluído'} value="Em Andamento" className="text-xs sm:text-sm">Em Andamento</SelectItem>
                                    <SelectItem disabled={selectedOrder.status === 'Entregue' || selectedOrder.status === 'Cancelado'} value="Concluído" className="text-xs sm:text-sm">Concluído</SelectItem>
                                    <SelectItem disabled={selectedOrder.status === 'Entregue' || selectedOrder.status === 'Cancelado'} value="Entregue" className="text-xs sm:text-sm">Entregue</SelectItem>
                                    <SelectItem disabled={selectedOrder.status === 'Entregue' || selectedOrder.status === 'Cancelado'} value="Cancelado" className="text-xs sm:text-sm">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        {isEditing ? (
                            <>
                                <Button variant="secondary" size="sm" onClick={exitEditMode} className="w-full sm:w-auto h-9 text-xs sm:text-sm">Cancelar</Button>
                                <SubmitButton form="edit-form" text="Salvar Alterações" />
                            </>
                        ) : (
                            <>
                                <DialogClose asChild><Button variant="secondary" size="sm" className="w-full sm:w-auto h-9 text-xs sm:text-sm">Fechar</Button></DialogClose>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="w-full sm:w-auto h-9 text-xs sm:text-sm">
                                            <PrinterIcon className="mr-2 h-3.5 w-3.5" />
                                            Imprimir
                                            <ChevronDown className="ml-2 h-3.5 w-3.5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={handlePrintA5} className="text-xs sm:text-sm">
                                            <PrinterIcon className="mr-2 h-3.5 w-3.5" />
                                            Imprimir A5
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handlePrintThermal} className="text-xs sm:text-sm">
                                            <PrinterIcon className="mr-2 h-3.5 w-3.5" />
                                            Impressora Térmica
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button disabled={isStatusUpdating || selectedOrder.status === 'Entregue' || selectedOrder.status === 'Cancelado'} onClick={enterEditMode} size="sm" className="w-full sm:w-auto h-9 text-xs sm:text-sm">
                                    <PencilIcon className="mr-2 h-3.5 w-3.5" /> Editar
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
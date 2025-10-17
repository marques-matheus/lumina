'use client';

import { useState, useEffect, useActionState } from 'react';
import { type Client } from '@/types'; // Importando o tipo Client
import { toast } from 'sonner';
import { addServiceOrder } from '../actions';

// ShadCN Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ChevronsUpDown, Check } from 'lucide-react';
import { SubmitButton } from '@/components/shared/submitButton';

export default function AddServiceOrderDialog({ clients }: { clients: Client[] }) {

    // --- ESTADOS UNIFICADOS ---
    const [isOpen, setIsOpen] = useState(false);
    // Estado para o Combobox
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const initialState = { success: false, message: '' };
    const [state, formAction] = useActionState(addServiceOrder, initialState);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            setIsOpen(false);
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state]);


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className='self-end'>Novo Serviço</Button>
            </DialogTrigger>
            <DialogContent className="w-screen h-screen max-w-full sm:w-auto sm:h-auto sm:max-w-2xl sm:max-h-[90vh] p-4 sm:p-6 overflow-y-auto m-0 sm:m-auto rounded-none sm:rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg">Nova Ordem de Serviço</DialogTitle>
                </DialogHeader>
                <form action={formAction}>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 py-3 sm:py-4'>

                        <div className="col-span-1 sm:col-span-2">
                            <Label className="text-xs sm:text-sm">Cliente</Label>
                            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" role="combobox" className="w-full justify-between text-left h-8 sm:h-9 text-xs sm:text-sm">
                                        <span className="truncate">{selectedClientId ? clients.find(c => c.id.toString() === selectedClientId)?.name : "Selecione um cliente..."}</span>
                                        <ChevronsUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Buscar cliente..." className="text-xs sm:text-sm" />
                                        <CommandEmpty className="text-xs sm:text-sm">Nenhum cliente encontrado.</CommandEmpty>
                                        <CommandGroup className="max-h-60 overflow-y-auto">
                                            {clients.map((client) => (
                                                <CommandItem key={client.id} value={client.name} onSelect={() => { setSelectedClientId(client.id.toString()); setPopoverOpen(false); }} className="text-xs sm:text-sm">
                                                    <Check className={cn("mr-2 h-3 w-3 sm:h-4 sm:w-4", selectedClientId === client.id.toString() ? "opacity-100" : "opacity-0")} />
                                                    <span className="truncate">{client.name}</span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Input type="hidden" name="clientId" value={selectedClientId || ''} />
                        <div><Label htmlFor="type" className="text-xs sm:text-sm">Tipo</Label><Input id="type" name="type" className="h-8 sm:h-9 text-xs sm:text-sm" /></div>
                        <div><Label htmlFor="equip_brand" className="text-xs sm:text-sm">Marca</Label><Input id="equip_brand" name='equip_brand' className="h-8 sm:h-9 text-xs sm:text-sm" /></div>
                        <div><Label htmlFor="equip_model" className="text-xs sm:text-sm">Modelo</Label><Input id="equip_model" name='equip_model' className="h-8 sm:h-9 text-xs sm:text-sm" /></div>
                        <div><Label htmlFor="serial_number" className="text-xs sm:text-sm">Nº de Série</Label><Input id="serial_number" name='serial_number' className="h-8 sm:h-9 text-xs sm:text-sm" /></div>
                        <div className="col-span-1 sm:col-span-2"><Label htmlFor="items" className="text-xs sm:text-sm">Itens Acompanhantes</Label><Input id="items" name='items' className="h-8 sm:h-9 text-xs sm:text-sm" /></div>
                        <div className="col-span-1 sm:col-span-2"><Label htmlFor="problem_description" className="text-xs sm:text-sm">Problema Relatado</Label><Textarea id="problem_description" name='problem_description' className="text-xs sm:text-sm min-h-20" /></div>
                        <div><Label htmlFor="total" className="text-xs sm:text-sm">Valor Inicial (R$)</Label><Input id="total" type="number" step="0.01" name='total' className="h-8 sm:h-9 text-xs sm:text-sm" /></div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <DialogClose asChild><Button type="button" variant="secondary" size="sm" className="w-full sm:w-auto h-9 text-xs sm:text-sm">Cancelar</Button></DialogClose>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
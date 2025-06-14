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
import { SubmitButton } from '@/components/ui/submitButton';

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
                <Button className='w-64 self-end'>Novo Serviço</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Nova Ordem de Serviço</DialogTitle>
                </DialogHeader>
                <form action={formAction}>

                    <div className='grid grid-cols-2 gap-4 py-4'>

                        <div className="col-span-2">
                            <Label>Cliente</Label>
                            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" className="w-full justify-between">
                                        {selectedClientId ? clients.find(c => c.id.toString() === selectedClientId)?.name : "Selecione um cliente..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command><CommandInput placeholder="Buscar cliente..." /><CommandEmpty>Nenhum cliente encontrado.</CommandEmpty><CommandGroup>
                                        {clients.map((client) => (
                                            <CommandItem key={client.id} value={client.name} onSelect={() => { setSelectedClientId(client.id.toString()); setPopoverOpen(false); }}>
                                                <Check className={cn("mr-2 h-4 w-4", selectedClientId === client.id.toString() ? "opacity-100" : "opacity-0")} />
                                                {client.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup></Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Input type="hidden" name="clientId" value={selectedClientId || ''} />
                        <div><Label htmlFor="type">Tipo</Label><Input id="type" name="type" /></div>
                        <div><Label htmlFor="equip_brand">Marca</Label><Input id="equip_brand" name='equip_brand' /></div>
                        <div><Label htmlFor="equip_model">Modelo</Label><Input id="equip_model" name='equip_model' /></div>
                        <div><Label htmlFor="serial_number">Nº de Série</Label><Input id="serial_number" name='serial_number' /></div>
                        <div className="col-span-2"><Label htmlFor="items">Itens Acompanhantes</Label><Input id="items" name='items' /></div>
                        <div className="col-span-2"><Label htmlFor="problem_description">Problema Relatado</Label><Textarea id="problem_description" name='problem_description' /></div>
                        <div><Label htmlFor="total">Valor Inicial (R$)</Label><Input id="total" type="number" step="0.01" name='total' /></div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
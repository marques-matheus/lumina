'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { type Client } from '@/types'; // Importando o tipo Client

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

export default function AddServiceOrderDialog({ clients }: { clients: Client[] }) {
    const router = useRouter();

    // --- ESTADOS UNIFICADOS ---
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Estado para o Combobox
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

    // Estados para os outros campos do formulário
    const [equipBrand, setEquipBrand] = useState('');
    const [equipModel, setEquipModel] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [problemDescription, setProblemDescription] = useState('');
    const [items, setItems] = useState('');
    const [equipType, setEquipType] = useState(''); // Renomeado de 'type' para 'equipType'
    const [totalValue, setTotalValue] = useState(''); // Renomeado de 'total' para 'totalValue'
    
    // Limpa todos os campos do formulário
    const clearForm = () => {
        setSelectedClientId(null);
        setEquipBrand('');
        setEquipModel('');
        setSerialNumber('');
        setProblemDescription('');
        setItems('');
        setTotalValue('');
        setEquipType('');
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault(); // <-- CORRIGIDO
        setIsSubmitting(true);

        // --- VALIDAÇÃO ADICIONADA ---
        if (!selectedClientId || !equipBrand || !equipModel || !problemDescription) {
            alert("Por favor, preencha os campos obrigatórios: Cliente, Marca, Modelo e Defeito.");
            setIsSubmitting(false);
            return;
        }

        const { error } = await supabase.from('service_orders').insert([
            {
                client_id: parseInt(selectedClientId, 10), 
                type: equipType,
                equip_brand: equipBrand,
                equip_model: equipModel,
                serial_number: serialNumber,
                status: 'Aguardando Avaliação', 
                items: items,
                problem_description: problemDescription,
                total: parseFloat(totalValue) || 0, 
            }
        ]);

        if (error) {
            alert(`Erro ao adicionar O.S.: ${error.message}`);
        } else {
            alert('Nova Ordem de Serviço criada com sucesso!');
            clearForm(); 
            setIsOpen(false); 
            router.refresh();
        }
        setIsSubmitting(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className='w-64 self-end'>Novo Serviço</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Nova Ordem de Serviço</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    
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
                                                <Check className={cn("mr-2 h-4 w-4", selectedClientId === client.id.toString() ? "opacity-100" : "opacity-0")}/>
                                                {client.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup></Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                       
                        <div><Label htmlFor="type">Tipo</Label><Input id="type" value={equipType} onChange={(e) => setEquipType(e.target.value)} /></div>
                        <div><Label htmlFor="equip_brand">Marca</Label><Input id="equip_brand" value={equipBrand} onChange={(e) => setEquipBrand(e.target.value)} /></div>
                        <div><Label htmlFor="equip_model">Modelo</Label><Input id="equip_model" value={equipModel} onChange={(e) => setEquipModel(e.target.value)} /></div>
                        <div><Label htmlFor="serial_number">Nº de Série</Label><Input id="serial_number" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} /></div>
                        <div className="col-span-2"><Label htmlFor="items">Itens Acompanhantes</Label><Input id="items" value={items} onChange={(e) => setItems(e.target.value)} /></div>
                        <div className="col-span-2"><Label htmlFor="problem_description">Problema Relatado</Label><Textarea id="problem_description" value={problemDescription} onChange={(e) => setProblemDescription(e.target.value)} /></div>
                        <div><Label htmlFor="total">Valor Inicial (R$)</Label><Input id="total" type="number" step="0.01" value={totalValue} onChange={(e) => setTotalValue(e.target.value)} /></div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar Serviço'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
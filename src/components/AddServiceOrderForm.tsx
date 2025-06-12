'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// ShadCN Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from './ui/textarea';


export default function AddServiceOrderDialog() {
    const router = useRouter()

    const [isOpen, setIsOpen] = useState(false)
    const [model, setmodel] = useState('')
    const [clientId, setClientId] = useState(1)
    const [equipBrand, setEquipBrand] = useState('')
    const [equipModel, setEquipModel] = useState('')
    const [serialNumber, setSerialNumber] = useState('')
    const [problemDescription, setProblemDescription] = useState('')
    const [items, setItems] = useState('')
    const [type, setType] = useState('')
    const [status, setStatus] = useState('Aguardando Revisão')
    const [total, setTotal] = useState('')


    const [isSubmitting, setIsSubmitting] = useState(false)


    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        setIsSubmitting(true)

      
        const { error } = await supabase.from('service_orders').insert([
            { client_id: clientId,
                type,
                equip_brand: equipBrand,
                equip_model: equipModel,
                serial_number: serialNumber,
                status,
                items,
                problem_description: problemDescription,
                total: parseFloat(total) || 0,}
        ])

        if (error) {
            alert(`Erro ao adicionar OS: ${error.message}`)
        } else {
            setClientId(1)
            setmodel('')
            setEquipBrand('')
            setEquipModel('')
            setSerialNumber('')            
            setProblemDescription('')
            setItems('')
            setTotal('')
            setType('')
            setIsOpen(false)
            router.refresh()
        }
        setIsSubmitting(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className='w-64 self-end'>
                    Novo Serviço
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Novo serviço</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className='grid gap-4 py-4'>
                        <Input id="client_id" type="hidden" value={clientId} />
                        <div className='grid grid-cols-2 items-center gap-4'>
                            <Label htmlFor="brand">Marca</Label>
                            <Input
                                id="brand"
                                value={equipBrand}
                                onChange={(e) => setEquipBrand(e.target.value)}
                                className="col-span-1"
                            />
                        </div>
                        <div className='grid grid-cols-2 items-center gap-4'>
                            <Label htmlFor="model">Modelo</Label>
                            <Input
                                id="model"
                                value={model}
                                onChange={(e) => setmodel(e.target.value)}
                                className="col-span-1"
                            />
                        </div>
                        <div className='grid grid-cols-2 items-center gap-4'>
                            <Label htmlFor="serial_number">Nº de Série</Label>
                            <Input
                                id="serial_number"
                                value={serialNumber}
                                onChange={(e) => setSerialNumber(e.target.value)}
                                className="col-span-1"
                            />
                            <Label htmlFor="client_id">Defeito</Label>
                            <Textarea
                                id="problem_description"
                                value={problemDescription}
                                onChange={(e) => setProblemDescription(e.target.value)}
                                className="col-span-1"
                            />
                        </div>
                        <div className='grid grid-cols-2 items-center gap-4'>
                            <Label htmlFor="items">Itens</Label>
                            <Input
                                id="items"
                                value={items}
                                onChange={(e) => setItems(e.target.value)}
                                className="col-span-1"
                            />
                        </div>
                        <div className='grid grid-cols-2 items-center gap-4'>
                            <Label htmlFor="type">Tipo</Label>
                            <Input
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="col-span-1"
                            />
                        </div>
                        <div className='grid grid-cols-2 items-center gap-4'>
                            <Label htmlFor="total">Total</Label>
                            <Input
                                id="total"
                                value={total}
                                onChange={(e) => setTotal(e.target.value)}
                                className="col-span-1"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Adicionando...' : 'Salvar Serviço'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
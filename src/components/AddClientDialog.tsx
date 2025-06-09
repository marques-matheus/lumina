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


export default function AddClientDialog() {
    const router = useRouter()

    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')

    const [isSubmitting, setIsSubmitting] = useState(false)


    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        setIsSubmitting(true)

        if (!name || !phone) {
            alert("Por favor, preencha todos os campos")
            setIsSubmitting(false)
            return
        }
        const { error } = await supabase.from('clients').insert([
            { name, phone }
        ])

        if (error) {
            alert(`Erro ao adicionar cliente: ${error.message}`)
        } else {
            setName('')
            setPhone('')
            setIsOpen(false)
            router.refresh()
        }
        setIsSubmitting(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                 <Button className='w-64 self-end'>
                    Adicionar Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Adicionar Cliente</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-2 items-center gap-4'>
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-1"
                            />
                        </div>
                        <div className='grid grid-cols-2 items-center gap-4'>
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
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
                            {isSubmitting ? 'Adicionando...' : 'Salvar Cliente'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
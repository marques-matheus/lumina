'use client';

import { useState, useActionState, useEffect } from 'react';
import { addClient } from '../actions';


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
import { SubmitButton } from '@/components/shared/submitButton';
import { toast } from 'sonner';


export default function AddClientDialog() {

    const [isOpen, setIsOpen] = useState(false)
    const initialState = { success: false, message: '' };
    const [state, formAction] = useActionState(addClient, initialState);


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
                <Button className='w-40 self-end'>
                    Novo Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Adicionar Cliente</DialogTitle>
                </DialogHeader>
                <form action={formAction}>
                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-2 items-center gap-4'>
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                name='name'
                                className="col-span-1"
                                type='text'
                                placeholder='Nome do Cliente'
                                pattern="^[a-zA-ZÀ-ÿ\s]+$"
                                maxLength={50}
                                required
                            />
                        </div>
                        <div className='grid grid-cols-2 items-center gap-4'>
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                                id="phone"
                                name='phone'
                                className="col-span-1"
                                type='tel'
                                placeholder='99999-9999'
                                maxLength={11}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
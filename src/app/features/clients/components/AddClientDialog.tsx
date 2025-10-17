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
                <Button size="sm" className='w-full md:w-auto md:self-end'>
                    Novo Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="w-screen h-screen max-w-full sm:w-auto sm:h-auto sm:max-w-[500px] sm:max-h-[90vh] p-4 sm:p-6 overflow-y-auto m-0 sm:m-auto rounded-none sm:rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg">Adicionar Cliente</DialogTitle>
                </DialogHeader>
                <form action={formAction}>
                    <div className='grid gap-3 sm:gap-4 py-3 sm:py-4'>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor="name" className="text-xs sm:text-sm">Nome</Label>
                            <Input
                                id="name"
                                name='name'
                                className="h-8 sm:h-9 text-xs sm:text-sm"
                                type='text'
                                placeholder='Nome do Cliente'
                                pattern="^[a-zA-ZÀ-ÿ\s]+$"
                                maxLength={50}
                                required
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor="phone" className="text-xs sm:text-sm">Telefone</Label>
                            <Input
                                id="phone"
                                name='phone'
                                className="h-8 sm:h-9 text-xs sm:text-sm"
                                type='tel'
                                placeholder='99999-9999'
                                maxLength={11}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" size="sm" className="w-full sm:w-auto h-9 text-xs sm:text-sm">
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
'use client';
import { useClientsStore } from "@/stores/ClientsStore";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { useEffect, useActionState } from 'react';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import { updateClient } from '../actions';
import { SubmitButton } from '@/components/shared/submitButton';
import { toast } from 'sonner';

export default function EditClientDialog() {
    const { isDialogOpen, selectedClient, closeModal } = useClientsStore();
    const initialState = { success: false, message: '' };
    const [state, formAction] = useActionState(updateClient, initialState);


    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            closeModal();
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state, closeModal]);

    return (
        <Dialog open={isDialogOpen} onOpenChange={closeModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Cliente</DialogTitle>
                </DialogHeader>
                <form action={formAction}>
                    <div className="grid gap-4 py-4">
                        <Input type="hidden" name="id" defaultValue={selectedClient?.id} />
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Nome</Label>
                            <Input id="name" name="name" defaultValue={selectedClient?.name} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">Telefone</Label>
                            <Input id="phone" name="phone" type="tel" minLength={11} maxLength={11} pattern='[0-9]{11}' defaultValue={selectedClient?.phone} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
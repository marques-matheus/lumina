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
            <DialogContent className="w-screen h-screen max-w-full sm:w-auto sm:h-auto sm:max-w-[500px] sm:max-h-[90vh] p-4 sm:p-6 overflow-y-auto m-0 sm:m-auto rounded-none sm:rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg">Editar Cliente</DialogTitle>
                </DialogHeader>
                <form action={formAction}>
                    <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
                        <Input type="hidden" name="id" defaultValue={selectedClient?.id} />
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name" className="text-xs sm:text-sm">Nome</Label>
                            <Input id="name" name="name" defaultValue={selectedClient?.name} className="h-8 sm:h-9 text-xs sm:text-sm" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="phone" className="text-xs sm:text-sm">Telefone</Label>
                            <Input id="phone" name="phone" type="tel" minLength={11} maxLength={11} pattern='[0-9]{11}' defaultValue={selectedClient?.phone} className="h-8 sm:h-9 text-xs sm:text-sm" />
                        </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
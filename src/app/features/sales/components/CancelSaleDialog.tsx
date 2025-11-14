'use client';

import { useState, useActionState, useEffect, useTransition } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { XCircle, Loader2 } from 'lucide-react';
import { cancelSale } from '../actions';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

type CancelSaleDialogProps = {
    saleId: number;
    onSuccess?: () => void;
};

export default function CancelSaleDialog({ saleId, onSuccess }: CancelSaleDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [password, setPassword] = useState('');
    const [isPending, startTransition] = useTransition();
    const [state, formAction] = useActionState(cancelSale, { success: false, message: '' });

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            setIsOpen(false);
            setPassword('');
            if (onSuccess) onSuccess();
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state, onSuccess]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) {
            toast.error('Digite sua senha para confirmar o cancelamento.');
            return;
        }
        setShowConfirm(true);
    };

    const handleConfirmCancel = () => {
        setShowConfirm(false);
        const formData = new FormData();
        formData.append('saleId', saleId.toString());
        formData.append('password', password);

        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="w-full sm:w-auto h-9 text-xs sm:text-sm">
                        <XCircle className="mr-1.5 h-3.5 w-3.5" />
                        Cancelar Venda
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Cancelar Venda #{saleId}</DialogTitle>
                            <DialogDescription>
                                Para cancelar esta venda, digite sua senha de login. Esta ação irá restaurar o estoque dos produtos.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Digite sua senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isPending}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsOpen(false);
                                    setPassword('');
                                }}
                                disabled={isPending}
                            >
                                Voltar
                            </Button>
                            <Button type="submit" variant="destructive" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Cancelando...
                                    </>
                                ) : (
                                    'Confirmar Cancelamento'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. A venda #{saleId} será cancelada permanentemente e o estoque dos produtos será restaurado.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Não, voltar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Sim, cancelar venda
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

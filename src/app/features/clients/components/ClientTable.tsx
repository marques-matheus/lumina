'use client';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil } from 'lucide-react';
import { useState, useEffect, useActionState } from 'react';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import { Client } from '@/types';
import { updateClient } from '../actions';
import { SubmitButton } from '@/components/ui/submitButton';
import { toast } from 'sonner';

export default function ClientTable({ clients }: { clients: Client[] }) {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const initialState = { success: false, message: '' };
    const [state, formAction] = useActionState(updateClient, initialState);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            setIsDialogOpen(false);
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

    const handleEditClick = (client: Client) => {
        setSelectedClient(client);
        setIsDialogOpen(true);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Meus Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className='w-full '>
                                <TableHead className="w-[150px]">ID</TableHead>
                                <TableHead className="w-[150px]">Nome</TableHead>
                                <TableHead className="w-[150px]">Telefone</TableHead>
                                <TableHead className="w-[100px] text-end">Editar</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.map((client) => (
                                <TableRow key={client.id} className={`${client.id % 2 === 0 ? 'bg-zinc-200' : 'bg-white'} hover:bg-accent/50 transition-colors`}>
                                    <TableCell className="font-medium">{client.id}</TableCell>
                                    <TableCell className="font-medium">{client.name}</TableCell>
                                    <TableCell>{client.phone}</TableCell>
                                    <TableCell className='flex items-center justify-end space-x-2'>
                                        <Button onClick={() => handleEditClick(client)} variant={"ghost"}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>

                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Cliente</DialogTitle>
                    </DialogHeader>
                    <form action={formAction}>
                        <div className="grid gap-4 py-4">
                            <Input type="hidden" name="id" value={selectedClient?.id} />
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
        </>
    );
}
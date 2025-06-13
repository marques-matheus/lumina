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
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import { Client } from '@/types';

export default function ClientTable({ clients }: { clients: Client[] }) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const handleEditClick = (client: Client) => {
        setSelectedClient(client);
        setIsDialogOpen(true);
    };
    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedClient) return;
        const formData = new FormData(event.currentTarget);
        const updatedClient = {
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
        };

        const { error } = await supabase
            .from('clients')
            .update(updatedClient)
            .match({ id: selectedClient.id });

        if (error) {
            alert('Erro ao atualizar cliente.');
        } else {
            setIsDialogOpen(false);
            router.refresh();
        }
    }
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
                                <TableHead className="w-[150px]">Nome</TableHead>
                                <TableHead className="w-[150px]">Telefone</TableHead>
                                <TableHead className="w-[100px] text-end">Editar</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.map((client) => (
                                <TableRow key={client.id}>
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
                    <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Nome</Label>
                                <Input id="name" name="name" defaultValue={selectedClient?.name} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">Telefone</Label>
                                <Input id="phone" name="phone" type="tel" minLength={11} maxLength={11}  pattern='[0-9]{11}' defaultValue={selectedClient?.phone} className="col-span-3" />

                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Salvar alterações</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
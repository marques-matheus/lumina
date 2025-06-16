'use client';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil } from 'lucide-react';
import { Client } from '@/types';
import { useClientsStore } from '@/stores/ClientsStore';

export default function ClientTable({ clients }: { clients: Client[] }) {
    const { openModal } = useClientsStore();

    const handleEditClick = (client: Client) => {
        openModal(client);
    };

    return (
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
    );
}
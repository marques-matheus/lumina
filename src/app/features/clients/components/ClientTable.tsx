'use client';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Pencil } from 'lucide-react';
import { Client } from '@/types';
import { useClientsStore } from '@/stores/ClientsStore';




export default function ClientTable({ clients }: { clients: Client[] }) {
    const { openModal } = useClientsStore();

    const handleEditClick = (client: Client) => {
        openModal(client);
        console.log('Edit client:', client);
    };

    return (
        <Card>
            <CardHeader>

            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="responsive-table-header">
                            <TableHead>ID</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead className="text-end">Editar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.map((client) => (
                            <TableRow key={client.id} className="responsive-table-row  odd:bg-secondary even:bg-white in-dark:even:bg-zinc-700">
                                <TableCell data-label="ID:" className="responsive-table-cell">
                                    {client.id}
                                </TableCell>
                                <TableCell data-label="Nome:" className="responsive-table-cell">
                                    {client.name}
                                </TableCell>
                                <TableCell data-label="Telefone:" className="responsive-table-cell">
                                    {client.phone}
                                </TableCell>
                                <TableCell className="responsive-actions-cell text-right">
                                    <Button onClick={() => handleEditClick(client)} variant={"ghost"}>
                                        <Pencil className="h-4 w-4 mr-2" /> 
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
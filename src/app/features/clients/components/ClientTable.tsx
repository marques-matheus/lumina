'use client';
import { useTransition } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MoreHorizontal } from 'lucide-react';
import { Client } from '@/types';
import { useClientsStore } from '@/stores/ClientsStore';
import { toast } from 'sonner';
import { deleteClient } from '../actions';




export default function ClientTable({ clients }: { clients: Client[] }) {
    const { openModal } = useClientsStore();
    const [isDeletePending, startDeleteTransition] = useTransition();

    const handleEditClick = (client: Client) => {
        openModal(client);
    };

    const handleDelete = (clientId: number) => {
        startDeleteTransition(async () => {
            const result = await deleteClient(clientId);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message || 'Erro ao excluir cliente.');
            }
        });
    };

    return (
        <div className="rounded-md border md:border-0">
            <Table>
                <TableHeader>
                    <TableRow className="responsive-table-header">
                        <TableHead>Nome</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-sm">Nenhum cliente encontrado.</p>
                                    <p className="text-xs">Adicione um novo cliente para começar.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        clients.map((client) => (
                            <TableRow key={client.id} className="responsive-table-row md:odd:bg-secondary md:even:bg-white md:dark:even:bg-zinc-700 hover:bg-muted/50 transition-colors">
                                <TableCell data-label="Nome" className="responsive-table-cell font-medium">{client.name}</TableCell>
                                <TableCell data-label="Telefone" className="responsive-table-cell">{client.phone}</TableCell>
                                <TableCell className="responsive-actions-cell text-right">
                                    <AlertDialog>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Abrir menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel className="text-xs">Ações</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleEditClick(client)} className="text-sm">Editar</DropdownMenuItem>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem className="text-red-500 text-sm" onSelect={(e) => e.preventDefault()} disabled={isDeletePending}>Excluir</DropdownMenuItem>
                                                </AlertDialogTrigger>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <AlertDialogContent className="w-[90vw] max-w-md">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="text-base">Tem certeza?</AlertDialogTitle>
                                                <AlertDialogDescription className="text-sm">
                                                    Esta ação irá excluir o cliente "<strong>{client.name}</strong>". Esta operação não pode ser desfeita.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                                <AlertDialogCancel className="m-0">Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(client.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 m-0">
                                                    Confirmar
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
'use client';

import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil } from 'lucide-react';
import { updateClient } from '../actions';
import { SubmitButton } from '@/components/shared/submitButton';
import { Client } from '@/types';
import { toast } from 'sonner';

export default function ClientTable({ clients }: { clients: Client[] }) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const initialState = { success: false, message: '' };
  const [editState, formAction] = useActionState(updateClient, initialState);

  useEffect(() => {
    if (editState.success) {
      toast.success(editState.message);
      setSelectedClient(null); // Close dialog on success
    } else if (editState.message) {
      toast.error(editState.message);
    }
  }, [editState]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="responsive-table-header">
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Nenhum cliente encontrado.</TableCell>
            </TableRow>
          ) : (
            clients.map((client) => (
              <TableRow key={client.id} className="responsive-table-row odd:bg-secondary even:bg-white in-dark:even:bg-zinc-700">
                <TableCell data-label="ID:" className="responsive-table-cell">{client.id}</TableCell>
                <TableCell data-label="Nome:" className="responsive-table-cell">{client.name}</TableCell>
                <TableCell data-label="Telefone:" className="responsive-table-cell">{client.phone}</TableCell>
                <TableCell className="responsive-actions-cell text-right">
                  <Button variant="ghost" size="icon" onClick={() => setSelectedClient(client)}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={!!selectedClient} onOpenChange={(open) => !open && setSelectedClient(null)}>
        {selectedClient && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
            </DialogHeader>
            <form action={formAction} className="space-y-4">
              <Input type="hidden" name="id" value={selectedClient.id} />
              <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Nome</Label>
                      <Input id="name" name="name" defaultValue={selectedClient.name} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">Telefone</Label>
                      <Input id="phone" name="phone" type="tel" defaultValue={selectedClient.phone} className="col-span-3" />
                  </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
                <SubmitButton text="Salvar" />
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

'use client';

import { useEffect, useState, useTransition } from 'react';
import { useActionState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoreHorizontal } from 'lucide-react';
import { deleteProduct, updateProduct } from '../actions';
import { SubmitButton } from '@/components/shared/submitButton';
import { Product } from '@/types';
import { toast } from 'sonner';

export default function ProductTable({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeletePending, startDeleteTransition] = useTransition();

  const initialState = { success: false, message: '' };
  const [editState, formAction] = useActionState(updateProduct, initialState);

  useEffect(() => {
    if (editState.success) {
      toast.success(editState.message);
      setSelectedProduct(null); // Close dialog on success
    } else if (editState.message) {
      toast.error(editState.message);
    }
  }, [editState]);

  const handleDelete = (productId: number) => {
    startDeleteTransition(async () => {
      const result = await deleteProduct(productId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error("Ocorreu um erro ao inativar o produto.");
      }
    });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="responsive-table-header">
            <TableHead>Nome</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Preço de Venda</TableHead>
            <TableHead className="lg:text-center">Disponível</TableHead>
            <TableHead className="lg:text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhum produto encontrado.</TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className={`responsive-table-row  odd:bg-secondary even:bg-white in-dark:even:bg-zinc-700 ${!product.is_active ? 'text-muted-foreground' : ''}`}>
                <TableCell data-label="Nome:" className="responsive-table-cell font-medium">{product.name}</TableCell>
                <TableCell data-label="Marca:" className="responsive-table-cell">{product.brand}</TableCell>
                <TableCell data-label="Quantidade:" className="responsive-table-cell">{product.quantity}</TableCell>
                <TableCell data-label="Preço:" className="responsive-table-cell">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.sale_price)}</TableCell>
                <TableCell data-label="Disponível:" className="responsive-table-cell lg:text-center">{product.is_active && product.quantity > 0 ? 'Sim' : 'Não'}</TableCell>
                <TableCell className="responsive-actions-cell lg:text-right">
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={!product.is_active}>
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSelectedProduct(product)}>Editar</DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-red-500" onSelect={(e) => e.preventDefault()}>Inativar</DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação irá inativar o produto "{product.name}". Ele não aparecerá em vendas, mas seu histórico será mantido. A quantidade será zerada.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Confirmar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          <form action={formAction} className="space-y-4">
            <Input type="hidden" name="id" value={selectedProduct?.id} />
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" defaultValue={selectedProduct?.name} />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" name="description" defaultValue={selectedProduct?.description} />
            </div>
            <div>
              <Label htmlFor="brand">Marca</Label>
              <Input id="brand" name="brand" defaultValue={selectedProduct?.brand} />
            </div>
            <div>
              <Label htmlFor="quantity">Quantidade</Label>
              <Input id="quantity" name="quantity" type="number" defaultValue={selectedProduct?.quantity} readOnly />
            </div>
            <div>
              <Label htmlFor="sale_price">Preço</Label>
              <Input id="sale_price" name="sale_price" type="number" step="0.01" defaultValue={selectedProduct?.sale_price} />
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
                <SubmitButton text="Salvar" />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

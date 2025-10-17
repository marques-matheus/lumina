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
      <div className="rounded-md border md:border-0">
        <Table>
          <TableHeader>
            <TableRow className="responsive-table-header">
              <TableHead>Nome</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead className="text-center">Qtd</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-center">Disponível</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm">Nenhum produto encontrado.</p>
                    <p className="text-xs">Adicione um novo produto para começar.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className={`responsive-table-row md:odd:bg-secondary md:even:bg-white md:dark:even:bg-zinc-700 hover:bg-muted/50 transition-colors ${!product.is_active ? 'opacity-60' : ''}`}>
                  <TableCell data-label="Nome" className="responsive-table-cell font-medium">{product.name}</TableCell>
                  <TableCell data-label="Marca" className="responsive-table-cell">{product.brand || '-'}</TableCell>
                  <TableCell data-label="Quantidade" className="responsive-table-cell md:text-center">
                    <span className={product.quantity < 5 && product.quantity > 0 ? 'text-orange-500 font-medium' : product.quantity === 0 ? 'text-red-500 font-medium' : ''}>
                      {product.quantity}
                    </span>
                  </TableCell>
                  <TableCell data-label="Preço" className="responsive-table-cell">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.sale_price)}</TableCell>
                  <TableCell data-label="Disponível" className="responsive-table-cell md:text-center">
                    <span className={`inline-flex items-center gap-1.5 ${product.is_active && product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.is_active && product.quantity > 0 ? '✓ Sim' : '✗ Não'}
                    </span>
                  </TableCell>
                  <TableCell className="responsive-actions-cell text-right">
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={!product.is_active}>
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel className="text-xs">Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedProduct(product)} className="text-sm">Editar</DropdownMenuItem>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-red-500 text-sm" onSelect={(e) => e.preventDefault()}>Inativar</DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialogContent className="w-[90vw] max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-base">Tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription className="text-sm">
                            Esta ação irá inativar o produto "<strong>{product.name}</strong>". Ele não aparecerá em vendas, mas seu histórico será mantido. A quantidade será zerada.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className="m-0">Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 m-0">Confirmar</AlertDialogAction>
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

      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="w-screen h-screen max-w-full sm:w-auto sm:h-auto sm:max-w-[500px] sm:max-h-[90vh] p-4 sm:p-6 overflow-y-auto m-0 sm:m-auto rounded-none sm:rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Editar Produto</DialogTitle>
          </DialogHeader>
          <form action={formAction} className="space-y-3 sm:space-y-4">
            <Input type="hidden" name="id" value={selectedProduct?.id} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-xs sm:text-sm">Nome</Label>
              <Input id="name" name="name" defaultValue={selectedProduct?.name} className="h-8 sm:h-9 text-xs sm:text-sm" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="text-xs sm:text-sm">Descrição</Label>
              <Input id="description" name="description" defaultValue={selectedProduct?.description} className="h-8 sm:h-9 text-xs sm:text-sm" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="brand" className="text-xs sm:text-sm">Marca</Label>
              <Input id="brand" name="brand" defaultValue={selectedProduct?.brand} className="h-8 sm:h-9 text-xs sm:text-sm" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="quantity" className="text-xs sm:text-sm">Quantidade (Somente Leitura)</Label>
              <Input id="quantity" name="quantity" type="number" defaultValue={selectedProduct?.quantity} readOnly className="h-8 sm:h-9 text-xs sm:text-sm bg-muted" />
              <p className="text-xs text-muted-foreground">Use a página de Compras para adicionar estoque</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sale_price" className="text-xs sm:text-sm">Preço de Venda</Label>
              <Input id="sale_price" name="sale_price" type="number" step="0.01" defaultValue={selectedProduct?.sale_price} className="h-8 sm:h-9 text-xs sm:text-sm" />
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <DialogClose asChild><Button type="button" variant="secondary" size="sm" className="w-full sm:w-auto h-9 text-xs sm:text-sm">Cancelar</Button></DialogClose>
              <SubmitButton text="Salvar" />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

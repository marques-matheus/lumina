// src/components/ProductTable.tsx
'use client';

import { useEffect, useState } from 'react';
import { useTransition } from 'react';
import { useActionState } from 'react';

// ShadCN Components
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal } from 'lucide-react';
import { deleteProduct, updateProduct } from '../actions';
import { SubmitButton } from '@/components/shared/submitButton';
import { Product } from '@/types';
import { toast } from 'sonner';
import SearchInput from '@/components/shared/SearchInput';

// Componente principal da tabela
export default function ProductTable({ products }: { products: Product[] }) {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();

  const initialState = { success: false, message: '' };
  const [state, formAction] = useActionState(updateProduct, initialState);

  // Funções para Editar
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };


  useEffect(() => {

    if (state.success) {
      toast.success(state.message);
      setIsDialogOpen(false);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);



  // Função para Deletar
  const handleDelete = async (productId: number) => {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      startTransition(() => {
        deleteProduct(productId);
      })
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Lista de Produtos</CardTitle>
            <SearchInput placeholder="Buscar produto por nome..." />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Preço de Venda</TableHead>
                <TableHead className="text-right">Disponível</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className={`${product.is_active ? '' : 'text-gray-400'} odd:bg-white even:bg-zinc-100`}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.sale_price)}</TableCell>
                  <TableCell className="text-right">{product.is_active || product.quantity > 0 ? 'Sim' : 'Não'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={product.is_active === false}>
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditClick(product)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-red-500">Deletar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog (Modal) de Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          <form action={formAction} className="space-y-4">
            <Input type="hidden" name="id" value={selectedProduct?.id} />
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nome</Label>
                <Input id="name" name="name" defaultValue={selectedProduct?.name} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Descrição</Label>
                <Input id="description" name="description" defaultValue={selectedProduct?.description} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="brand" className="text-right">Marca</Label>
                <Input id="brand" name="brand" defaultValue={selectedProduct?.brand} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">Quantidade</Label>
                <Input id="quantity" name="quantity" type="number" defaultValue={selectedProduct?.quantity} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sale_price" className="text-right">Preço</Label>
                <Input id="sale_price" name="sale_price" type="number" step="0.01" defaultValue={selectedProduct?.sale_price} className="col-span-3" />
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

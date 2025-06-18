'use client';

import { useEffect, useState } from 'react';
import { useTransition } from 'react';
import { useActionState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal } from 'lucide-react';
import { deleteProduct, updateProduct } from '../actions';
import { SubmitButton } from '@/components/shared/submitButton';
import { Product } from '@/types';
import { toast } from 'sonner';
import { CategoryFilter } from '@/components/shared/CategoryFilter';
import SearchInput from '@/components/shared/SearchInput';

export default function ProductTable({ products, brands }: { products: Product[], brands: string[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();

  const initialState = { success: false, message: '' };
  const [state, formAction] = useActionState(updateProduct, initialState);

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

  const handleDelete = async (productId: number) => {
    if (confirm('Tem certeza que deseja inativar este produto?')) {
      startTransition(() => {
        deleteProduct(productId);
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex flex-col md:flex-row items-center md:justify-between gap-4'>
            <div className='flex flex-col md:flex-row gap-2'>
              <CategoryFilter title="Filtrar por Marca" paramName="brand" options={brands} />
              <SearchInput placeholder="Buscar produto por nome..." />
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
              {products.map((product) => (
                <TableRow key={product.id} className={`responsive-table-row  odd:bg-secondary even:bg-white ${!product.is_active ? 'text-muted-foreground' : ''}`}>
                  <TableCell data-label="Nome:" className="responsive-table-cell font-medium">{product.name}</TableCell>
                  <TableCell data-label="Marca:" className="responsive-table-cell">{product.brand}</TableCell>
                  <TableCell data-label="Quantidade:" className="responsive-table-cell">{product.quantity}</TableCell>
                  <TableCell data-label="Preço:" className="responsive-table-cell">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.sale_price)}</TableCell>
                  <TableCell data-label="Disponível:" className="responsive-table-cell lg:text-center">{product.is_active && product.quantity > 0 ? 'Sim' : 'Não'}</TableCell>
                  <TableCell className="responsive-actions-cell lg:text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={!product.is_active}>
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditClick(product)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-red-500">Inativar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
              <Input id="quantity" name="quantity" type="number" defaultValue={selectedProduct?.quantity} />
            </div>
            <div>
              <Label htmlFor="sale_price">Preço</Label>
              <Input id="sale_price" name="sale_price" type="number" step="0.01" defaultValue={selectedProduct?.sale_price} />
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
'use client';

import { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useActionState } from 'react';
import { type Client, type Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { ChevronsUpDown, Check, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createSale } from '../actions';


type CartItem = {
  product: Product;
  quantity: number;
};

export default function AddSaleDialog({ products, clients }: { products: Product[], clients: Client[] }) {

  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [productSearchOpen, setProductSearchOpen] = useState(false);
  const [clientSearchOpen, setClientSearchOpen] = useState(false);
  const initialState = { success: false, message: '' };
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(createSale, initialState);


  const handleAddToCart = () => {
    if (!selectedProduct || quantity <= 0) {
      toast.error('Selecione um produto e uma quantidade válida.');
      return;
    }

    if (selectedProduct.quantity < quantity) {
      toast.error('Quantidade insuficiente em estoque.');
      return;
    }

    const existingItem = cartItems.find(item => item.product.id === selectedProduct.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.product.id === selectedProduct.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { product: selectedProduct, quantity }]);
    }
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleRemoveFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };

  const totalAmount = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.product.sale_price * item.quantity), 0);
  }, [cartItems]);

  const handleFinalizeSale = () => {
    if (cartItems.length === 0) {
      toast.error('Adicione pelo menos um produto ao carrinho.');
      return;
    }

    const formData = new FormData();
    formData.append('cartItems', JSON.stringify(cartItems));
    formData.append('totalAmount', totalAmount.toString());
    formData.append('clientId', selectedClient?.id?.toString() || '');
    startTransition(() => {
      formAction(formData);
    });
    setIsOpen(false);
    toast.success('Venda finalizada com sucesso!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='w-auto'>Nova Venda</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar Nova Venda</DialogTitle>
        </DialogHeader>
        <div className="flex items-end gap-2 border-b pb-4">
          <div className="flex-1">
            <Label>Produto</Label>
            <Popover open={productSearchOpen} onOpenChange={setProductSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                  {selectedProduct ? selectedProduct.name : "Selecione um produto..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command><CommandInput placeholder="Buscar produto..." /><CommandEmpty>Nenhum produto encontrado.</CommandEmpty><CommandGroup>
                  {products.map((product) => (
                    <CommandItem key={product.id} value={product.name} onSelect={() => { setSelectedProduct(product); setProductSearchOpen(false); }}>
                      <Check className={cn("mr-2 h-4 w-4", selectedProduct?.id === product.id ? "opacity-100" : "opacity-0")} />
                      {product.name}
                    </CommandItem>
                  ))}
                </CommandGroup></Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex-1">
            <Label>Cliente</Label>
            <Popover open={clientSearchOpen} onOpenChange={setClientSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                  {selectedClient ? selectedClient.name : "Selecione um cliente..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command><CommandInput placeholder="Buscar cliente..." /><CommandEmpty>Nenhum cliente encontrado.</CommandEmpty><CommandGroup>
                  {clients.map((client) => (
                    <CommandItem key={client.id} value={client.name} onSelect={() => { setSelectedClient(client); setClientSearchOpen(false); }}>
                      <Check className={cn("mr-2 h-4 w-4", selectedClient?.id === client.id ? "opacity-100" : "opacity-0")} />
                      {client.name}
                    </CommandItem>
                  ))}
                </CommandGroup></Command>
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor='quantity'>Qtd.</Label>
            <Input id='quantity' type='number' value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-20" />
          </div>
          <Button onClick={handleAddToCart}>Adicionar</Button>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          <h3 className="text-lg font-medium">Itens da Venda</h3>
          {cartItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum item no carrinho.</p>
          ) : (
            <Table>
              <TableBody>
                {cartItems.map(item => (
                  <TableRow key={item.product.id}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.quantity} x {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.sale_price)}</TableCell>
                    <TableCell className="text-right font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.sale_price * item.quantity)}</TableCell>
                    <TableCell className="w-10">
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveFromCart(item.product.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <div className="flex justify-end items-center gap-4 pt-4 border-t">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-xl font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAmount)}</span>
        </div>

        <DialogFooter>
          <DialogClose asChild><Button variant='secondary'>Cancelar</Button></DialogClose>
          <Button onClick={handleFinalizeSale} disabled={isPending}>
            {isPending ? 'Finalizando...' : 'Finalizar Venda'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
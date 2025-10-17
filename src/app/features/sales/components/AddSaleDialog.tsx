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

  const handleCloseDialog = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Limpa o carrinho quando o modal é fechado
      setCartItems([]);
      setSelectedProduct(null);
      setSelectedClient(null);
      setQuantity(1);
    }
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
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogTrigger asChild>
        <Button size="sm" className='w-auto'>Nova Venda</Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-w-full sm:w-auto sm:h-auto sm:max-w-2xl sm:max-h-[90vh] p-4 sm:p-6 overflow-y-auto m-0 sm:m-auto rounded-none sm:rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Registrar Nova Venda</DialogTitle>
        </DialogHeader>

        {/* Formulário de adição - responsivo */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-2 sm:gap-3 border-b pb-3 sm:pb-4">
          <div className="flex-1 min-w-0">
            <Label className="text-xs sm:text-sm">Produto</Label>
            <Popover open={productSearchOpen} onOpenChange={setProductSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" role="combobox" className="w-full justify-between text-left h-8 sm:h-9 text-xs sm:text-sm">
                  <span className="truncate">{selectedProduct ? selectedProduct.name : "Selecione um produto..."}</span>
                  <ChevronsUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar produto..." className="text-xs sm:text-sm" />
                  <CommandEmpty className="text-xs sm:text-sm">Nenhum produto encontrado.</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-y-auto">
                    {products.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.name}
                        onSelect={() => {
                          setSelectedProduct(product);
                          setProductSearchOpen(false);
                        }}
                        className="text-xs sm:text-sm"
                      >
                        <Check className={cn("mr-2 h-3 w-3 sm:h-4 sm:w-4", selectedProduct?.id === product.id ? "opacity-100" : "opacity-0")} />
                        <span className="truncate">{product.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1 min-w-0">
            <Label className="text-xs sm:text-sm">Cliente</Label>
            <Popover open={clientSearchOpen} onOpenChange={setClientSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" role="combobox" className="w-full justify-between text-left h-8 sm:h-9 text-xs sm:text-sm">
                  <span className="truncate">{selectedClient ? selectedClient.name : "Selecione um cliente..."}</span>
                  <ChevronsUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar cliente..." className="text-xs sm:text-sm" />
                  <CommandEmpty className="text-xs sm:text-sm">Nenhum cliente encontrado.</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-y-auto">
                    {clients.map((client) => (
                      <CommandItem
                        key={client.id}
                        value={client.name}
                        onSelect={() => {
                          setSelectedClient(client);
                          setClientSearchOpen(false);
                        }}
                        className="text-xs sm:text-sm"
                      >
                        <Check className={cn("mr-2 h-3 w-3 sm:h-4 sm:w-4", selectedClient?.id === client.id ? "opacity-100" : "opacity-0")} />
                        <span className="truncate">{client.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label htmlFor='quantity' className="text-xs sm:text-sm">Quantidade</Label>
              <Input
                id='quantity'
                type='number'
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full h-8 sm:h-9 text-xs sm:text-sm"
              />
            </div>
            <Button onClick={handleAddToCart} size="sm" className="h-8 sm:h-9 px-3 text-xs sm:text-sm whitespace-nowrap">
              Adicionar
            </Button>
          </div>
        </div>

        {/* Lista de itens - responsiva */}
        <div className="space-y-2">
          <h3 className="text-sm sm:text-base font-medium">Itens da Venda</h3>
          {cartItems.length === 0 ? (
            <p className="text-xs sm:text-sm text-muted-foreground py-6 sm:py-8 text-center">Nenhum item no carrinho.</p>
          ) : (
            <div className="max-h-48 sm:max-h-60 overflow-y-auto border rounded-md">
              <Table>
                <TableBody>
                  {cartItems.map(item => (
                    <TableRow key={item.product.id}>
                      <TableCell className="font-medium py-2 text-xs sm:text-sm">
                        <div className="truncate max-w-[120px] sm:max-w-none">{item.product.name}</div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm py-2">
                        <div className="flex flex-col sm:flex-row sm:gap-1">
                          <span>{item.quantity} x</span>
                          <span className="whitespace-nowrap">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.sale_price)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium whitespace-nowrap py-2 text-xs sm:text-sm">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.sale_price * item.quantity)}
                      </TableCell>
                      <TableCell className="w-8 sm:w-10 py-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFromCart(item.product.id)}
                          className="h-7 w-7 sm:h-8 sm:w-8"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between sm:justify-end items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t">
          <span className="text-sm sm:text-base font-semibold">Total:</span>
          <span className="text-base sm:text-lg font-bold">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAmount)}
          </span>
        </div>

        {/* Footer com botões */}
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <DialogClose asChild>
            <Button variant='secondary' size="sm" className="w-full sm:w-auto h-9 text-xs sm:text-sm">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleFinalizeSale} disabled={isPending} size="sm" className="w-full sm:w-auto h-9 text-xs sm:text-sm">
            {isPending ? 'Finalizando...' : 'Finalizar Venda'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
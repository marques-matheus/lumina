'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { addProduct } from '../actions';
import { SubmitButton } from '../../../../components/shared/submitButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function AddProductDialog() {

  const initialState = { success: false, message: '' };
  const [state, formAction] = useActionState(addProduct, initialState);


  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {

    if (state.success) {
      toast.success(state.message);
      setIsOpen(false);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className='self-end'>Novo Produto</Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-w-full sm:w-auto sm:h-auto sm:max-w-[500px] sm:max-h-[90vh] p-4 sm:p-6 overflow-y-auto m-0 sm:m-auto rounded-none sm:rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Novo Produto</DialogTitle>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-xs sm:text-sm">Nome</Label>
              <Input id="name" name="name" className="h-8 sm:h-9 text-xs sm:text-sm" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="text-xs sm:text-sm">Descrição</Label>
              <Textarea id="description" name="description" className="text-xs sm:text-sm min-h-20" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="brand" className="text-xs sm:text-sm">Marca</Label>
              <Input id="brand" name="brand" className="h-8 sm:h-9 text-xs sm:text-sm" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="quantity" className="text-xs sm:text-sm">Quantidade</Label>
              <Input id="quantity" name="quantity" type="number" className="h-8 sm:h-9 text-xs sm:text-sm" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sale_price" className="text-xs sm:text-sm">Preço</Label>
              <Input id="sale_price" name="sale_price" type="number" step="0.01" className="h-8 sm:h-9 text-xs sm:text-sm" required />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <DialogClose asChild><Button type="button" variant="secondary" size="sm" className="w-full sm:w-auto h-9 text-xs sm:text-sm">Cancelar</Button></DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { addProduct } from '../actions';
import { SubmitButton } from '../../../../components/ui/submitButton';
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
        <Button className='w-40 self-end'>Novo Produto</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nome</Label>
              <Input id="name" name="name" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Descrição</Label>
              <Textarea id="description" name="description" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand" className="text-right">Marca</Label>
              <Input id="brand" name="brand" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Quantidade</Label>
              <Input id="quantity" name="quantity" type="number" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sale_price" className="text-right">Preço</Label>
              <Input id="sale_price" name="sale_price" type="number" step="0.01" className="col-span-3" required />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
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
import { X, Plus } from 'lucide-react';

export default function AddProductDialog() {

  const initialState = { success: false, message: '' };
  const [state, formAction] = useActionState(addProduct, initialState);

  const [isOpen, setIsOpen] = useState(false);
  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>([]);


  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setIsOpen(false);
      setSpecifications([]);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const handleSubmit = (formData: FormData) => {
    const specsObject = specifications.reduce((acc, spec) => {
      if (spec.key.trim() && spec.value.trim()) {
        acc[spec.key.trim()] = spec.value.trim();
      }
      return acc;
    }, {} as Record<string, string>);

    formData.set('specifications', JSON.stringify(specsObject));
    formAction(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className='w-full md:w-auto md:self-end'>Novo Produto</Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-w-full md:h-auto md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Novo Produto</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4 max-h-[calc(100vh-200px)] md:max-h-[500px] overflow-y-auto pr-2">
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

            {/* Especificações Técnicas */}
            <div className="flex flex-col gap-2 border-t pt-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs sm:text-sm font-semibold">Especificações Técnicas (Opcional)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSpecification}
                  className="h-7 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar
                </Button>
              </div>

              {specifications.length > 0 && (
                <div className="space-y-2">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Ex: Processador"
                          value={spec.key || ''}
                          onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                          className="h-8 text-xs"
                        />
                        <Input
                          placeholder="Ex: Intel i7"
                          value={spec.value || ''}
                          onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpecification(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {specifications.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Adicione detalhes como processador, memória RAM, modelo, etc.
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4 border-t">
            <DialogClose asChild><Button type="button" variant="secondary" size="sm" className="w-full sm:w-auto h-9 text-xs sm:text-sm">Cancelar</Button></DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
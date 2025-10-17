'use client'

import { useState, useEffect, useActionState, ChangeEvent } from "react";
import { createPurchase } from '../actions';
import { type Product } from "@/types";
import { toast } from "sonner";

// Imports...
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SubmitButton } from "@/components/shared/submitButton";


const getTodayDateString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
};


const INITIAL_FORM_DATA = {
    productId: '',
    quantity: '',
    costPerUnit: '',
    supplier: '',
    purchaseDate: getTodayDateString(),
};

interface AddPurchaseDialogProps {
    products: Product[];
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
    initialProduct?: Product;
}

export default function AddPurchaseDialog({
    isOpen: controlledIsOpen,
    setIsOpen: controlledSetIsOpen,
    products,
    initialProduct
}: AddPurchaseDialogProps) {
    // Permite que o modal controle seu próprio estado ou seja controlado por props
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isControlled = controlledIsOpen !== undefined && controlledSetIsOpen !== undefined;

    const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
    const setIsOpen = isControlled ? controlledSetIsOpen : setInternalIsOpen;

    const initialState = { success: false, message: '' };
    const [state, formAction] = useActionState(createPurchase, initialState);

    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [popoverOpen, setPopoverOpen] = useState(false);

    // Pre-seleciona o produto se um for passado via props
    useEffect(() => {
        if (initialProduct) {
            setSelectedProduct(initialProduct);
            setFormData(prevState => ({ ...prevState, productId: initialProduct.id.toString() }));
        }
    }, [initialProduct]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            setIsOpen(false);
            setFormData(INITIAL_FORM_DATA);
            setSelectedProduct(null);
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
        setFormData(prevState => ({ ...prevState, productId: product.id.toString() }));
        setPopoverOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (setIsOpen) { setIsOpen(open) }; if (!open) { setSelectedProduct(null); setFormData(INITIAL_FORM_DATA); } }}>
            {!isControlled && (
                <DialogTrigger asChild>
                    <Button size="sm">Nova Compra</Button>
                </DialogTrigger>
            )}
            <DialogContent className="w-screen h-screen max-w-full sm:w-auto sm:h-auto sm:max-w-md sm:max-h-[90vh] p-4 sm:p-6 overflow-y-auto m-0 sm:m-auto rounded-none sm:rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg">Registrar Compra de Produto</DialogTitle>
                </DialogHeader>
                <form action={formAction}>
                    <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
                        <div>
                            <Label className="text-xs sm:text-sm">Produto</Label>
                            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
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
                                                <CommandItem key={product.id} value={product.name} onSelect={() => handleProductSelect(product)} className="text-xs sm:text-sm">
                                                    <Check className={cn("mr-2 h-3 w-3 sm:h-4 sm:w-4", selectedProduct?.id === product.id ? "opacity-100" : "opacity-0")} />
                                                    <span className="truncate">{product.name}</span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="hidden">
                                <Label htmlFor="product_id">ID do Produto</Label>
                                <Input id="product_id" name="product_id" type="hidden" value={formData.productId} />
                            </div>
                            <div>
                                <Label htmlFor="quantity" className="text-xs sm:text-sm">Quantidade</Label>
                                <Input id="quantity" name="quantity" type="number" required
                                    value={formData.quantity} onChange={handleInputChange} className="h-8 sm:h-9 text-xs sm:text-sm" />
                            </div>
                            <div>
                                <Label htmlFor="cost_per_unit" className="text-xs sm:text-sm">Custo Unit. (R$)</Label>
                                <Input
                                    id="cost_per_unit" name="cost_per_unit" type="number" step="0.01" required
                                    defaultValue={formData.costPerUnit} onChange={handleInputChange}
                                    className="h-8 sm:h-9 text-xs sm:text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="supplier" className="text-xs sm:text-sm">Fornecedor (Opcional)</Label>
                            <Input id="supplier" name="supplier"
                                value={formData.supplier} onChange={handleInputChange} className="h-8 sm:h-9 text-xs sm:text-sm" />
                        </div>
                        <div>
                            <Label htmlFor="purchase_date" className="text-xs sm:text-sm">Data da Compra</Label>
                            <Input id="purchase_date" name="purchase_date" type="date" required
                                value={formData.purchaseDate} onChange={handleInputChange} className="h-8 sm:h-9 text-xs sm:text-sm" />
                        </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <DialogClose asChild><Button type="button" variant="secondary" size="sm" className="w-full sm:w-auto h-9 text-xs sm:text-sm">Cancelar</Button></DialogClose>
                        <SubmitButton text="Registrar Compra" />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
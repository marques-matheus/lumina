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
                    <Button>Registrar Nova Compra</Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Registrar Compra de Produto</DialogTitle>
                </DialogHeader>
                <form action={formAction}>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Produto</Label>
                            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" className="w-full justify-between">
                                        {selectedProduct ? selectedProduct.name : "Selecione um produto..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command><CommandInput placeholder="Buscar produto..." /><CommandEmpty>Nenhum produto encontrado.</CommandEmpty><CommandGroup>
                                        {products.map((product) => (
                                            <CommandItem key={product.id} value={product.name} onSelect={() => handleProductSelect(product)}>
                                                <Check className={cn("mr-2 h-4 w-4", selectedProduct?.id === product.id ? "opacity-100" : "opacity-0")} />
                                                {product.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup></Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="hidden">
                                <Label htmlFor="product_id">ID do Produto</Label>
                                <Input id="product_id" name="product_id" type="hidden" value={formData.productId} />
                            </div>
                            <div>
                                <Label htmlFor="quantity">Quantidade</Label>
                                <Input id="quantity" name="quantity" type="number" required
                                    value={formData.quantity} onChange={handleInputChange} />
                            </div>
                            <div>
                                <Label htmlFor="cost_per_unit">Custo Unit. (R$)</Label>
                                <Input
                                    id="cost_per_unit" name="cost_per_unit" type="number" step="0.01" required
                                    defaultValue={formData.costPerUnit} onChange={handleInputChange}

                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="supplier">Fornecedor (Opcional)</Label>
                            <Input id="supplier" name="supplier"
                                value={formData.supplier} onChange={handleInputChange} />
                        </div>
                        <div>
                            <Label htmlFor="purchase_date">Data da Compra</Label>
                            <Input id="purchase_date" name="purchase_date" type="date" required
                                value={formData.purchaseDate} onChange={handleInputChange} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
                        <SubmitButton text="Registrar Compra" />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
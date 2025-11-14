'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Product } from '@/types';
import AddPurchaseDialog from '../../purchases/components/AddPurchaseDialog';

interface LowStockDialogProps {
    allProducts: Product[];
    allCatalogProducts: Product[];
}

export default function LowStockDialog({ allProducts, allCatalogProducts }: LowStockDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [selectedProductForPurchase, setSelectedProductForPurchase] = useState<Product | undefined>(undefined);

    if (allProducts.length === 0) {
        return null;
    }

    const handleBuyClick = (product: Product) => {
        setSelectedProductForPurchase(product);
        setIsPurchaseModalOpen(true);
        setIsOpen(false); // Fecha o modal de estoque para abrir o de compra
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto text-sm">
                        Ver mais
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Produtos com Estoque Baixo</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[60vh] w-auto overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Produto</TableHead>
                                    <TableHead className="text-center">Qtd.</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allProducts.map((product, index) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell className="text-center font-bold">{product.quantity}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" className='bg-teal-500 text-white font-bold' onClick={() => handleBuyClick(product)}>
                                                <ShoppingCart className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary">Fechar</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <AddPurchaseDialog
                isOpen={isPurchaseModalOpen}
                setIsOpen={setIsPurchaseModalOpen}
                products={allCatalogProducts}
                initialProduct={selectedProductForPurchase}
            />
        </>
    );
}
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Printer } from 'lucide-react';
import { type SalesHistoryEntry } from '@/types';
import { useSession } from '@/providers/SessionProvider';

// Sub-componente para a visualização dos dados
const SaleView = ({ sale }: { sale: SalesHistoryEntry }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR');
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const user = useSession();
    return (
        <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-8 sm:gap-y-2">
                <div>
                    <p className="font-semibold text-muted-foreground text-xs uppercase mb-1">Data da Venda</p>
                    <p className="text-sm">{formatDate(sale.created_at)}</p>
                </div>
                <div>
                    <p className="font-semibold text-muted-foreground text-xs uppercase mb-1">Cliente</p>
                    <p className="text-sm">{sale.clients?.name || <span className="italic text-muted-foreground">Venda Avulsa</span>}</p>
                </div>

                <div className="sm:col-span-2">
                    <p className="font-semibold text-muted-foreground text-xs uppercase mb-1">Total</p>
                    <p className="font-bold text-lg sm:text-xl">{formatCurrency(sale.total_amount)}</p>
                </div>
            </div>

            <div className="border-t pt-3 sm:pt-4">
                <p className="font-semibold text-muted-foreground text-xs uppercase mb-3">Itens da Venda</p>
                <div className="space-y-2 sm:space-y-0">
                    {/* Mobile: Cards */}
                    <div className="flex flex-col gap-2 sm:hidden">
                        {sale.sale_items.map((item, idx) => (
                            <div key={item.products?.name ? `${item.products.name}-${idx}` : idx} className="border rounded-lg p-3 space-y-2">
                                <div className="font-medium text-sm">{item.products?.name}</div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-muted-foreground">Qtd:</span> {item.quantity}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-muted-foreground">Unit:</span> {formatCurrency(item.products?.sale_price || 0)}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t">
                                    <span className="text-xs font-semibold text-muted-foreground">Subtotal</span>
                                    <span className="font-semibold text-sm">{formatCurrency(item.quantity * (item.products?.sale_price || 0))}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: Table */}
                    <div className="hidden sm:block rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Produto</TableHead>
                                    <TableHead className="text-center">Qtd</TableHead>
                                    <TableHead className="text-right">Preço Unit.</TableHead>
                                    <TableHead className="text-right">Subtotal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sale.sale_items.map((item, idx) => (
                                    <TableRow key={item.products?.name ? `${item.products.name}-${idx}` : idx}>
                                        <TableCell className="font-medium">{item.products?.name}</TableCell>
                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(item.products?.sale_price || 0)}</TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatCurrency(item.quantity * (item.products?.sale_price || 0))}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function SaleDetailsDialog({ sale }: { sale: SalesHistoryEntry }) {
    const [isOpen, setIsOpen] = useState(false);
    const user = useSession();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR');
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const handlePrint = () => {
        const printContent = generateReceiptContent();

        const printWindow = window.open('', '_blank', 'width=300,height=600');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Nota Não Fiscal - Venda #${sale.id}</title>
                        <style>
                            @media print {
                                @page { 
                                    size: 68mm auto; 
                                    margin: 0; 
                                }
                                body { 
                                    width: 68mm; 
                                    margin: 0; 
                                    padding: 2mm;
                                    font-family: 'Courier New', monospace;
                                    font-size: 11px;
                                    line-height: 1.1;
                                    color: #000 !important;
                                    -webkit-print-color-adjust: exact;
                                    print-color-adjust: exact;
                                }
                                * {
                                    color: #000 !important;
                                    font-weight: bold !important;
                                }
                            }
                            body { 
                                width: 68mm; 
                                margin: 0; 
                                padding: 8px;
                                font-family: 'Courier New', monospace;
                                font-size: 11px;
                                line-height: 1.3;
                                color: #000;
                                background: white;
                            }
                            .center { 
                                text-align: center; 
                                font-weight: bold;
                            }
                            .right { 
                                text-align: right; 
                                font-weight: bold;
                            }
                            .bold { 
                                font-weight: 900 !important; 
                                color: #000 !important;
                            }
                            .separator { 
                                border-top: 2px dashed #000; 
                                margin: 3px 0; 
                                width: 100%;
                            }
                            .item-line {
                                display: flex;
                                justify-content: space-between;
                                margin: 1px 0;
                                font-weight: bold;
                            }
                            strong {
                                font-weight: 900 !important;
                                color: #000 !important;
                            }
                        </style>
                    </head>
                    <body>
                        ${printContent}
                    </body>
                </html>
            `);
            printWindow.document.close();

            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 250);
            };
        }
    };

    const generateReceiptContent = () => {
        return `
            <div class="center bold">
                ${user?.company_name}
            </div>
            <div class="center">
                Nota Não Fiscal
            </div>
            <div class="center">
                ${user?.street},${user?.number} - ${user?.city}
            </div>
            <div class="separator"></div>
            
            <div>
                <strong>Data:</strong> ${formatDate(sale.created_at)}
            </div>
            ${sale.clients ? `
            <div>
                <strong>Cliente:</strong> ${sale.clients.name}
            </div>
           
            ` : ''}
            
            <div class="separator"></div>
            
            <div class="bold">ITENS VENDIDOS:</div>
            ${sale.sale_items.map(item => `
                <div style="margin-bottom: 8px;">
                    <div><strong>${item.products?.name}</strong></div>
                 
                    ${item.products?.brand ? `<div>Marca: ${item.products.brand}</div>` : ''}
                   
                    <div class="item-line">
                        <span>Qtd: ${item.quantity}</span>
                        <span>Unit: ${formatCurrency(item.products?.sale_price || 0)}</span>
                    </div>
                    <div class="item-line">
                        <span><strong>Subtotal:</strong></span>
                        <span><strong>${formatCurrency(item.quantity * (item.products?.sale_price ?? 0))}</strong></span>
                    </div>
                </div>
            `).join('')}
            
            <div class="separator"></div>
            
            <div class="item-line bold" style="font-size: 14px;">
                <span>TOTAL GERAL:</span>
                <span>${formatCurrency(sale.total_amount)}</span>
            </div>
            
            <div class="separator"></div>
            
            <div class="center">
                <strong>INFORMAÇÕES DE GARANTIA</strong>
            </div>
            <div>
                <strong>Data da Compra:</strong> ${formatDate(sale.created_at)}
            </div>
            <div>
                Este documento serve como comprovante
                de compra para fins de garantia.
            </div>
            <div>
                <strong>Garantia Legal:</strong> 30 dias
            </div>
            <div>
                <strong>Garantia do Fabricante:</strong>
                Conforme especificação de cada produto
            </div>
            
            <div class="separator"></div>
            
            <div class="center">
                <strong>CONDIÇÕES GERAIS</strong>
            </div>
            <div style="font-size: 10px; text-align: justify;">
                - Mercadoria vendida não será trocada
                sem apresentação desta nota.
            </div>
            <div style="font-size: 10px; text-align: justify;">
                - A garantia não cobre danos causados
                por mau uso ou acidentes.
            </div>
            <div style="font-size: 10px; text-align: justify;">
                - Em caso de defeito, procure o
                fabricante dentro do prazo de garantia.
            </div>
            
            <div class="separator"></div>
            
            <div class="center">
                Obrigado pela preferência!
            </div>
            <div class="center">
                Volte sempre!
            </div>
            
        `;
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs w-full md:w-auto">
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    Ver Detalhes
                </Button>
            </DialogTrigger>
            <DialogContent className="w-screen h-screen max-w-full sm:w-auto sm:h-auto sm:max-w-2xl sm:max-h-[90vh] p-4 sm:p-6 overflow-y-auto m-0 sm:m-auto rounded-none sm:rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg">Detalhes da Venda #{sale.id}</DialogTitle>
                </DialogHeader>

                <SaleView sale={sale} />

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary" size="sm" className="w-full sm:w-auto h-9 text-xs sm:text-sm">Fechar</Button>
                    </DialogClose>
                    <Button variant="outline" size="sm" onClick={handlePrint} className="w-full sm:w-auto h-9 text-xs sm:text-sm">
                        <Printer className="mr-2 h-3.5 w-3.5" />
                        Imprimir Nota
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


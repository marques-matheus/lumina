'use client';

import { useState } from 'react';
import { useSearchParams, usePathname, useRouter } from "next/navigation";


import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from '@/lib/utils';

export default function ProductFilter({ brands }: { brands: string[] }) {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [open, setOpen] = useState(false);
    const selectedBrand = searchParams.get('brand') || '';


    const handleBrandSelect = (brand: string) => {
        const params = new URLSearchParams(searchParams);
        if (brand) {
            params.set('brand', brand);
        } else {
            params.delete('brand');
        }
        replace(`${pathname}?${params.toString()}`);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-between">
                    {selectedBrand ? selectedBrand : "Filtrar por Marca"}
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Procurar marca..." />
                    <CommandEmpty>Nenhuma marca encontrada.</CommandEmpty>
                    <CommandGroup heading="Marcas">

                        <CommandItem onSelect={() => handleBrandSelect('')}>
                            <Check className={cn("mr-2 h-4 w-4", selectedBrand === '' ? "opacity-100" : "opacity-0")} />
                            Todas as Marcas
                        </CommandItem>
                        {brands.map((brand) => (
                            <CommandItem
                                key={brand}
                                value={brand}
                                onSelect={() => handleBrandSelect(brand)}
                            >
                                <Check className={cn("mr-2 h-4 w-4", selectedBrand === brand ? "opacity-100" : "opacity-0")} />
                                {brand}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
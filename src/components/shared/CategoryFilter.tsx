'use client';

import { useState } from 'react';
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from '@/lib/utils';


type Props = {
    title: string;
    paramName: string;
    options: string[];
};

export function CategoryFilter({ title, paramName, options }: Props) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [open, setOpen] = useState(false);
    const selectedValue = searchParams.get(paramName) || '';

    const handleSelect = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(paramName, value);
        } else {
            params.delete(paramName);
        }
        replace(`${pathname}?${params.toString()}`);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto justify-between">
                    {selectedValue ? selectedValue : title}
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Command>
                    <CommandInput placeholder={`Procurar ${title.toLowerCase()}...`} />
                    <CommandEmpty>Nenhum resultado.</CommandEmpty>
                    <CommandGroup heading={title}>
                        <CommandItem onSelect={() => handleSelect('')}>
                            <Check className={cn("mr-2 h-4 w-4", selectedValue === '' ? "opacity-100" : "opacity-0")} />
                            Todos
                        </CommandItem>
                        {options.map((option) => (
                            <CommandItem
                                key={option}
                                value={option}
                                onSelect={() => handleSelect(option)}
                            >
                                <Check className={cn("mr-2 h-4 w-4", selectedValue === option ? "opacity-100" : "opacity-0")} />
                                {option}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
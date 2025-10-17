'use client';

import { useState } from 'react';
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
    title?: string;
};

export function DateFilter({ title = "Filtrar por Data" }: Props) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [open, setOpen] = useState(false);
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    const handleApply = () => {
        const params = new URLSearchParams(searchParams);
        const startInput = (document.getElementById('startDate') as HTMLInputElement)?.value;
        const endInput = (document.getElementById('endDate') as HTMLInputElement)?.value;

        if (startInput) {
            params.set('startDate', startInput);
        } else {
            params.delete('startDate');
        }
        if (endInput) {
            params.set('endDate', endInput);
        } else {
            params.delete('endDate');
        }
        replace(`${pathname}?${params.toString()}`);
        setOpen(false);
    };

    const handleClear = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('startDate');
        params.delete('endDate');
        replace(`${pathname}?${params.toString()}`);
        setOpen(false);
    };

    const hasDateFilter = startDate || endDate;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto justify-between">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {hasDateFilter ? (
                        <span className="text-xs">
                            {startDate && new Date(startDate).toLocaleDateString('pt-BR')}
                            {startDate && endDate && ' - '}
                            {endDate && new Date(endDate).toLocaleDateString('pt-BR')}
                        </span>
                    ) : (
                        title
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4">
                <div className="space-y-4">
                    <h4 className="font-semibold text-sm">{title}</h4>
                    <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-xs">Data Inicial</Label>
                        <Input
                            id="startDate"
                            type="date"
                            defaultValue={startDate || ''}
                            className="h-9 text-xs"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-xs">Data Final</Label>
                        <Input
                            id="endDate"
                            type="date"
                            defaultValue={endDate || ''}
                            className="h-9 text-xs"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={handleApply}
                            className="flex-1 h-9 text-xs"
                        >
                            Aplicar
                        </Button>
                        {hasDateFilter && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleClear}
                                className="h-9 text-xs"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

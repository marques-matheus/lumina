'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import SidebarContent from "./SidebarContent";
import { useState } from "react";


export default function MobileSidebar() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <div className="flex items-center p-4">
                <SheetTrigger asChild>
                    <button>
                        <Menu className="h-8 w-8" />
                        <span className="sr-only">Abrir menu</span>
                    </button>
                </SheetTrigger>
                <SheetHeader className="hidden">
                    <SheetTitle hidden>Lúmina</SheetTitle>
                </SheetHeader>
            </div>
            <SheetContent side="left" className="p-4 dark:bg-zinc-800 bg-gray-100">
                <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
        </Sheet>
    );
}
'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import SidebarContent from "./SidebarContent";


export default function MobileSidebar() {
    return (
        <Sheet>
            <div className="flex items-center p-4">
                <SheetTrigger asChild>
                    <button>
                        <Menu className="h-8 w-8" />
                        <span className="sr-only">Abrir menu</span>
                    </button>
                </SheetTrigger>
                <SheetHeader>
                    <SheetTitle hidden>Lúmina</SheetTitle>
                </SheetHeader>
            </div>
            <SheetContent side="left" className="p-4">
                <SidebarContent />
            </SheetContent>
        </Sheet>
    );
}
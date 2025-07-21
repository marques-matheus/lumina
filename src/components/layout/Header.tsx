'use client';
import { ToggleDarkMode } from "../ui/toggleDarkMode";
import MobileSidebar from "./MobileSidebar";
import { useSession } from "@/providers/SessionProvider";

export default function Header() {
  // const user = useSession();
  return (
    <header className="h-16 flex justify-between items-center p-6 bg-white dark:bg-zinc-800 ">
      <div className="lg:hidden">
        <MobileSidebar />
      </div>
      <div>
        
      </div>
      <div className="flex items-end justify-end text-right">
        <ToggleDarkMode />
      </div>
    </header>
  );
}
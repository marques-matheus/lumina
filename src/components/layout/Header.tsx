'use client';
import { ToggleDarkMode } from "../ui/toggleDarkMode";
import MobileSidebar from "./MobileSidebar";
import { useSession } from "@/providers/SessionProvider";

export default function Header() {
  const user = useSession();
  return (
    <header className="h-16 flex justify-between items-center p-6 bg-white dark:bg-zinc-800 border-b">
      <div className="lg:hidden">
        <MobileSidebar />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          {user?.company_name || "Lúmina" /* Nome da empresa ou padrão */}
        </h1>
      </div>
      <div className="flex items-end justify-end text-right">
        <ToggleDarkMode />
      </div>
    </header>
  );
}
'use client';
import { ToggleDarkMode } from "../ui/toggleDarkMode";
import MobileSidebar from "./MobileSidebar";
import { logout } from "@/app/features/auth/actions";
import { useSession } from "@/providers/SessionProvider";

export default function Header() {
  const user = useSession();
  return (
    <header className="h-16 flex items-center p-6 bg-white dark:bg-zinc-800 border-b">
      <div className="lg:hidden">
        <MobileSidebar />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          {user?.user_metadata?.company_name || "Lúmina" /* Nome da empresa ou padrão */}
        </h1>
      </div>
      <div className="flex-1 text-center md:text-right">
        <ToggleDarkMode />
        <button onClick={logout} className="ml-4 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-gray-100">
          Sair
        </button>
      </div>
    </header>
  );
}
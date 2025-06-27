// src/components/layout/Header.tsx
import { ToggleDarkMode } from "../ui/toggleDarkMode";
import MobileSidebar from "./MobileSidebar";
import { logout } from "@/app/features/auth/actions";

export default function Header() {
  return (
    <header className="h-16 flex items-center p-6 bg-white dark:bg-zinc-800 border-b">
      {/* BOTÃO DO MENU MOBILE - Visível apenas em telas pequenas (escondido a partir de 'lg') */}
      <div className="lg:hidden">
        <MobileSidebar />
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
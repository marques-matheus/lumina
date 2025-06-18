// src/components/layout/Header.tsx
import MobileSidebar from "./MobileSidebar";

export default function Header() {
  return (
    <header className="h-16 flex items-center p-6 bg-white border-b">
      {/* BOTÃO DO MENU MOBILE - Visível apenas em telas pequenas (escondido a partir de 'lg') */}
      <div className="lg:hidden">
        <MobileSidebar />
      </div>
      <div className="flex-1 text-center md:text-left">
        {/* Futuramente, o título da página pode aparecer aqui */}
      </div>
    </header>
  );
}
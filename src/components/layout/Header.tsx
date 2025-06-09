// src/components/layout/Header.tsx
export default function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200">
      <div>
        {/* Pode ter um breadcrumb ou título da página aqui */}
      </div>
      <div>
        {/* Pode ter informações do usuário ou um botão de logout aqui */}
      </div>
    </header>
  );
}
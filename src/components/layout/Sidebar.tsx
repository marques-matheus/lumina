// src/components/layout/Sidebar.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-100 border-r border-gray-200 p-4">
      
        <Image src={"/logo.png"} alt="Logo" width={120} height={120} className="flex mx-14" />
    
      <nav className="flex flex-col space-y-2">
        <Link href="/" className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">
          Produtos
        </Link>
        <Link href="/clients" className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">
          Clientes
        </Link>
        <Link href="/services" className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">
          Serviços
        </Link>
        {/* Adicione outros links aqui no futuro */}
      </nav>
    </aside>
  );
}
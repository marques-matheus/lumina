'use client';
// src/components/layout/Sidebar.tsx
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path ? 'border-teal-700 bg-gray-200' : '';

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-100 border-r border-gray-200 p-4 ">

      <Image src={"/logo.png"} alt="Logo" width={120} height={120} className="flex mx-14 mb-8" />

      <nav className="flex flex-col space-y-4">
        <Link href="/" className={`px-4 py-2 text-lg border-l-4 font-medium text-gray-700 hover:bg-gray-200 ${isActive('/')}`}>
          Produtos
        </Link>
        <Link href="/clients" className={`px-4 py-2 text-lg border-l-4 font-medium text-gray-700 hover:bg-gray-200 ${isActive('/clients')}`}>
          Clientes
        </Link>
        <Link href="/services" className={`px-4 py-2 text-lg border-l-4 font-medium text-gray-700 hover:bg-gray-200 ${isActive('/services')}`}>
          Ordens de Serviço
        </Link>
        {/* Adicione outros links aqui no futuro */}
      </nav>
    </aside>
  );
}
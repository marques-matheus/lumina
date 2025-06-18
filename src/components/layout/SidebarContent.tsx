'use client'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarContent() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path ? 'border-teal-700 bg-gray-200' : '';
    return (
        <>
            <Image src={"/logo.png"} alt="Logo" width={120} height={120} className="flex lg:mx-14 lg:mb-8" />

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
        </>
    );
}
'use client'
import { logout } from '@/app/features/auth/actions';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarContent() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path ? 'border-teal-700 bg-gray-200 dark:bg-zinc-500' : '';
    return (
        <>
            <div>
                <Image src={"/logo.png"} alt="Logo" width={120} height={120} className="flex lg:mx-14 lg:mb-8" />
                <nav className="flex flex-col space-y-4 dark:bg-zinc-700">
                    <Link href="/" className={`px-4 py-2 hover:border-teal-700 text-lg border-l-8 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 in-dark:hover:bg-zinc-500 ${isActive('/')}`}>
                        Produtos
                    </Link>
                    <Link href="/clientes" className={`px-4 py-2 hover:border-teal-700 text-lg border-l-8 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 in-dark:hover:bg-zinc-500 ${isActive('/clientes')}`}>
                        Clientes
                    </Link>
                    <Link href="/servicos" className={`px-4 py-2 hover:border-teal-700 text-lg border-l-8 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 in-dark:hover:bg-zinc-500 ${isActive('/servicos')}`}>
                        Ordens de Serviço
                    </Link>
                    <Link href="/configuracoes/perfil" className={`px-4 py-2 hover:border-teal-700 text-lg border-l-8 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 in-dark:hover:bg-zinc-500 ${isActive('/configuracoes/perfil')}`}>
                        Configurações
                    </Link>
                    {/* Adicione outros links aqui no futuro */}
                </nav>
            </div>
            <button onClick={logout} className=" text-sm font-bold bottom-5 left-5 absolute text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-gray-100">
                Sair
                <LogOut className="inline ml-1 h-4 w-4" />
            </button>
        </>
    );
}
'use client'
import { logout } from '@/app/features/auth/actions';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/providers/SessionProvider';

export default function SidebarContent() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path ? 'border-teal-700 bg-gray-200 dark:bg-zinc-500' : '';
    const user = useSession();
    return (
        <>
            <div>
                <Image src={"/logo.png"} alt="Logo" width={120} height={120} className="flex lg:mx-14 lg:mb-8" />
                <nav className="flex flex-col space-y-4 dark:bg-zinc-700">
                    <Link href="/" className={`px-4 py-2 hover:border-teal-700 text-lg border-l-8 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 in-dark:hover:bg-zinc-500 ${isActive('/')}`}>
                        Início
                    </Link>
                    <Link href="/produtos" className={`px-4 py-2 hover:border-teal-700 text-lg border-l-8 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 in-dark:hover:bg-zinc-500 ${isActive('/produtos')}`}>
                        Produtos
                    </Link>
                    <Link href="/clientes" className={`px-4 py-2 hover:border-teal-700 text-lg border-l-8 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 in-dark:hover:bg-zinc-500 ${isActive('/clientes')}`}>
                        Clientes
                    </Link>
                    <Link href="/compras" className={`px-4 py-2 hover:border-teal-700 text-lg border-l-8 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 in-dark:hover:bg-zinc-500 ${isActive('/compras')}`}>
                        Compras
                    </Link>
                    <Link href="/vendas" className={`px-4 py-2 hover:border-teal-700 text-lg border-l-8 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 in-dark:hover:bg-zinc-500 ${isActive('/vendas')}`}>
                        Vendas
                    </Link>
                    {
                        user?.does_provide_service && (
                            <Link href="/servicos" className={`px-4 py-2 hover:border-teal-700 text-lg border-l-8 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 in-dark:hover:bg-zinc-500 ${isActive('/servicos')}`}>
                                Ordens de Serviço
                            </Link>
                        )
                    }
                    <Link href="/configuracoes/perfil" className={`px-4 py-2 hover:border-teal-700 text-lg border-l-8 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 in-dark:hover:bg-zinc-500 ${isActive('/configuracoes/perfil')}`}>
                        Configurações
                    </Link>
                </nav>
            </div>
            <button onClick={logout} className=" text-sm font-bold bottom-5 left-5 absolute text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-gray-100">
                Sair
                <LogOut className="inline ml-1 h-4 w-4" />
            </button>
        </>
    );
}
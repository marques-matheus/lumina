'use client'
import { logout } from '@/app/features/auth/actions';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { useSession } from '@/providers/SessionProvider';
import NavLink from '../ui/navLink';

type SidebarContentProps = {
    onNavigate?: () => void;
};

export default function SidebarContent({ onNavigate }: SidebarContentProps) {
    const user = useSession();
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
                <div className='flex flex-col justify-center items-center m-4'>
                    <Image src="/logo.png" alt="Logo" width={90} height={90} />
                    <h1 className='text-2xl my-2 font-bold'>Lúmina</h1>
                </div>
                <nav className="flex flex-col mt-10 space-y-4 dark:bg-zinc-800 pb-6" onClick={onNavigate}>
                    <NavLink href="/" text="Painel" />
                    <NavLink text="produtos" />
                    <NavLink text="clientes" />
                    <NavLink text="compras" />
                    <NavLink text="vendas" />
                    {
                        user?.does_provide_service && (
                            <NavLink href="/servicos" text="serviços" />
                        )
                    }
                    <NavLink href="/configuracoes/perfil" text="configurações" />
                </nav>
            </div>
            <div className="p-5 border-t border-gray-200 dark:border-zinc-700">
                <button
                    onClick={logout}
                    className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors w-full"
                >
                    <LogOut className="h-4 w-4" />
                    Sair
                </button>
            </div>
        </div>
    );
}
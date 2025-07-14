'use client'
import { logout } from '@/app/features/auth/actions';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { useSession } from '@/providers/SessionProvider';
import NavLink from '../ui/navLink';

export default function SidebarContent() {
    const user = useSession();
    return (
        <>
            <div>
                <Image src={"/logo.png"} alt="Logo" width={120} height={120} className="flex lg:mx-14 lg:mb-8" />
                <nav className="flex flex-col space-y-4 dark:bg-zinc-800">
                    <NavLink href="/" text="dashboard" />
                    <NavLink text="produtos" />
                    <NavLink text="clientes" />
                    <NavLink text="compras" />
                    <NavLink text="vendas" />
                    {
                        user?.does_provide_service && (
                            <NavLink text="servicos" />
                        )
                    }
                    <NavLink text="configuracoes" />
                </nav>
            </div>
            <button onClick={logout} className=" text-sm font-bold bottom-5 left-5 absolute text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-gray-100">
                Sair
                <LogOut className="inline ml-1 h-4 w-4" />
            </button>
        </>
    );
}
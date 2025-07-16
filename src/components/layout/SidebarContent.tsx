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
                <div className='flex flex-col justify-center items-center m-4'>
                    <Image src="/logo.png" alt="Logo" width={90} height={90} />
                    <h1 className='text-2xl my-2 font-bold'>Lúmina</h1>
                </div>
                <nav className="flex flex-col mt-10 space-y-4 dark:bg-zinc-800">
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
            <button onClick={logout} className=" text-sm font-bold bottom-5 left-5 absolute text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-gray-90">
                Sair
                <LogOut className="inline ml-1 h-4 w-4" />
            </button>
        </>
    );
}
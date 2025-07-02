'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Este layout "abraça" todas as páginas de configurações
export default function configuracoesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname(); // Hook para saber a rota atual

    return (
        <div>
            {/* As abas controlam a navegação */}
            <Tabs value={pathname} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    {/* Cada "aba" é na verdade um Link do Next.js */}
                    <TabsTrigger value="/configuracoes/perfil" asChild>
                        <Link href="/configuracoes/perfil">Perfil da Empresa</Link>
                    </TabsTrigger>
                    <TabsTrigger value="/configuracoes/servicos" asChild>
                        <Link href="/configuracoes/servicos">Serviços</Link>
                    </TabsTrigger>
                    <TabsTrigger value="/configuracoes/conta" asChild>
                        <Link href="/configuracoes/conta">Conta</Link>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            {/* O conteúdo da página da aba ativa será renderizado aqui */}
            <div className="mt-4">
                {children}
            </div>
        </div>
    );
}
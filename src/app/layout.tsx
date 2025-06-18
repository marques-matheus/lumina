// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import SidebarContent from '@/components/layout/SidebarContent';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = { title: 'Lúmina', description: 'Gerenciamento de serviços e produtos' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">

          <aside className="hidden lg:flex flex-col w-64 bg-gray-100 border-r p-4">
            <SidebarContent />
          </aside>

          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
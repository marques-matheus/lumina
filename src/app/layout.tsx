// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lúmina',
  description: 'Gerenciamento de estoque, clientes e ordens de serviço',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            {children}
          </main>

        </div>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
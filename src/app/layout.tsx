import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = { title: 'Lúmina', /* ... */ };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="pt-BR">
            <body className={inter.className}>
                {children} {/* Ele apenas renderiza o conteúdo que vem dos layouts dos grupos */}
                <Toaster />
            </body>
        </html>
    );
}
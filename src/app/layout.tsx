import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from "@/components/layout/ThemeProvider";


const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = { title: 'Lúmina', /* ... */ };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="pt-BR"
            suppressHydrationWarning = {true}
        >
            <body className={inter.className}>
                <ThemeProvider attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange>
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
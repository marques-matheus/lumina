// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import SidebarContent from '@/components/layout/SidebarContent';
import { SessionProvider } from '@/providers/SessionProvider';
import { getUserProfile } from '@/lib/queries';
import CompleteProfile from '@/components/layout/completeProfile';


const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = { title: 'Lúmina', description: 'Gerenciamento de serviços e produtos' };

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const userProfile = await getUserProfile();
  return (
    <SessionProvider user={userProfile}>
      <div className="flex h-screen bg-gray-50 dark:bg-zinc-900 text-gray-800 dark:text-white">
        <aside className="hidden lg:flex flex-col w-64 bg-gray-100 border-r  dark:bg-zinc-700 dark:border-zinc-700">
          <SidebarContent />
        </aside>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <CompleteProfile />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-zinc-800 p-6">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
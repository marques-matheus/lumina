export const dynamic = 'force-dynamic'

import AddClientDialog from '@/app/features/clients/components/AddClientDialog';
import ClientTable from '@/app/features/clients/components/ClientTable';
import { PageProps } from '@/types';
import { Metadata, ResolvingMetadata } from 'next';
import EditClientDialog from '../../features/clients/components/EditClientDialog';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Heading from '@/components/shared/Heading';

export async function generateMetadata(
  { params, searchParams }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const searchTerm = (resolvedSearchParams?.search as string) || '';
  return {
    title: 'Lúmina - Clientes',
    description: searchTerm
      ? `Resultados para "${searchTerm}"`
      : 'Gerencie seus clientes com facilidade',
  };
}

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('profile_id', user?.id)
    .order('id', { ascending: true });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Heading title="Clientes" subtitle="Gerencie seus clientes e adicione novos registros " />
        <AddClientDialog />
      </div>
      <ClientTable clients={clients || []} />
      <EditClientDialog />
    </div>
  );
}
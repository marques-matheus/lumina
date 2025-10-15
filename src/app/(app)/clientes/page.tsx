export const dynamic = 'force-dynamic'

import AddClientDialog from '@/app/features/clients/components/AddClientDialog';
import ClientTable from '@/app/features/clients/components/ClientTable';
import { PageProps } from '@/types';
import { Metadata, ResolvingMetadata } from 'next';
import EditClientDialog from '../../features/clients/components/EditClientDialog';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Heading from '@/components/shared/Heading';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import SearchInput from '@/components/shared/SearchInput';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

// Paginação (igual padrão Produtos)
function PaginationControls({ hasNextPage, hasPrevPage, totalCount, pageSize, currentPage }: { hasNextPage: boolean, hasPrevPage: boolean, totalCount: number, pageSize: number, currentPage: number }) {
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="flex items-center justify-between w-full">
      <div className="text-sm text-muted-foreground">
        Página {currentPage} de {totalPages}. Total de {totalCount} clientes.
      </div>
      <div className="flex items-center gap-2">
        <Link href={`/clientes?page=${currentPage - 1}`} passHref>
          <Button variant="outline" size="sm" disabled={!hasPrevPage}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
        </Link>
        <Link href={`/clientes?page=${currentPage + 1}`} passHref>
          <Button variant="outline" size="sm" disabled={!hasNextPage}>
            Próximo
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default async function ClientsPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }

  const resolvedSearchParams = await searchParams;
  const searchTerm = (resolvedSearchParams?.search as string) || '';
  const page = parseInt((resolvedSearchParams?.page as string) || '1', 10);
  const pageSize = 15;

  // Base query com count
  let query = supabase
    .from('clients')
    .select('*', { count: 'exact' })
    .eq('profile_id', user?.id);

  // Filtro de busca (nome ou telefone)
  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
  }

  // Paginação
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to).order('id', { ascending: true });

  const { data: clients, count } = await query;
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="flex flex-col gap-6">
      <Heading title="Clientes" subtitle="Gerencie seus clientes e adicione novos registros" />
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className='flex flex-col md:flex-row items-center gap-4'>
            <SearchInput placeholder="Buscar cliente por nome ou telefone..." />
          </div>
          <AddClientDialog />
        </CardHeader>
        <CardContent>
          <ClientTable clients={clients || []} />
        </CardContent>
        {totalCount > pageSize && (
          <CardFooter>
            <PaginationControls
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              totalCount={totalCount}
              pageSize={pageSize}
              currentPage={page}
            />
          </CardFooter>
        )}
      </Card>
      <EditClientDialog />
    </div>
  );
}
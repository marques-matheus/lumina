export const dynamic = 'force-dynamic'
import { PageProps } from '@/types';
import { Metadata, ResolvingMetadata } from 'next';



export async function generateMetadata(
  { params, searchParams }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const searchTerm = (resolvedSearchParams?.search as string) || '';
  return {
    title: 'Lúmina - Página Principal',
    description: 'Bem-vindo à página principal do Lúmina',
  };
}

export default async function MainPage() {
  return (
    <div>
      <h1>Main Page</h1>
    </div>
  );
}

export const dynamic = 'force-dynamic'
import { PageProps } from '@/types';
import { Metadata, ResolvingMetadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';



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

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: cookieStore.getAll,
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }
  return (
    <div>
      <h1>Main Page</h1>
    </div>
  );
}

export const dynamic = 'force-dynamic'
import AddProductForm from '@/app/features/products/components/AddProductForm';
import ProductTable from '@/app/features/products/components/ProductTable';
import { supabase } from '@/lib/supabaseClient';
import { PageProps } from '@/types';
import { Metadata, ResolvingMetadata } from 'next';


export async function generateMetadata(
  { params, searchParams }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const searchTerm = (resolvedSearchParams?.search as string) || '';
  return {
    title: 'Gerenciamento de Produtos',
    description: searchTerm
      ? `Resultados para "${searchTerm}"`
      : 'Gerencie seus produtos com facilidade',
  };


}

export default async function ProductsPage({ searchParams }: PageProps) {
  {

    const resolvedSearchParams = await searchParams;
    const searchTerm = (resolvedSearchParams?.search as string) || '';
    let query = supabase
      .from('products')
      .select('id, name, description, brand, quantity, sale_price, is_active')
      .eq('is_active', true);
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }

    const { data: products } = await query.order('id', { ascending: true });
    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-semibold">Gerenciamento de Produtos</h1>
        <AddProductForm />
        <ProductTable products={products || []} />
      </div>
    );
  }
}

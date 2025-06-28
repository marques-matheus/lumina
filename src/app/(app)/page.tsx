export const dynamic = 'force-dynamic'
import AddProductForm from '@/app/features/products/components/AddProductForm';
import ProductTable from '@/app/features/products/components/ProductTable';
import { supabase } from '@/lib/supabaseClient';
import { PageProps } from '@/types';
import { createServerClient } from '@supabase/ssr';
import { Metadata, ResolvingMetadata } from 'next';
import { cookies } from 'next/headers';


export async function generateMetadata(
  { params, searchParams }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const searchTerm = (resolvedSearchParams?.search as string) || '';
  return {
    title: 'Lúmina - Produtos',
    description: searchTerm
      ? `Resultados para "${searchTerm}"`
      : 'Gerencie seus produtos com facilidade',
  };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  {

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

    const resolvedSearchParams = await searchParams;
    const searchTerm = (resolvedSearchParams?.search as string) || '';
    const brandFilter = (resolvedSearchParams?.brand as string) || '';
    let query = supabase
      .from('products')
      .select('id, name, description, brand, quantity, sale_price, is_active')
      .eq('profile_id', user?.id)
      .order('is_active', { ascending: false })
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }

    const { data: ProductsForBrands } = await supabase
      .from('products')
      .select('brand')
      .not('brand', 'is', null)


    if (brandFilter) {
      query = query.eq('brand', brandFilter);
    }

    const uniqueBrands = ProductsForBrands
      ? Array.from(new Set(ProductsForBrands.map((product) => product.brand)))
      : [];

    const { data: products } = await query.order('id', { ascending: true });
    return (
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Produtos</h1>

          <AddProductForm />
        </div>
        <ProductTable products={products || []} brands={uniqueBrands} />
      </div>
    );
  }
}

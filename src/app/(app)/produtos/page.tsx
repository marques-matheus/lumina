export const dynamic = 'force-dynamic'
import AddProductForm from '@/app/features/products/components/AddProductForm';
import ProductTable from '@/app/features/products/components/ProductTable';
import { PageProps } from '@/types';
import { Metadata, ResolvingMetadata } from 'next';
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
    title: 'Lúmina - Produtos',
    description: searchTerm
      ? `Resultados para "${searchTerm}"`
      : 'Gerencie seus produtos com facilidade',
  };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  {

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect('/auth/login');
    }

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
          <Heading title="Produtos" subtitle="Gerencie seus produtos com facilidade" />
          <AddProductForm />
        </div>
        <ProductTable products={products || []} brands={uniqueBrands} />
      </div>
    );
  }
}

export const dynamic = 'force-dynamic'
import AddProductForm from '@/app/features/products/components/AddProductForm';
import ProductTable from '@/app/features/products/components/ProductTable';
import { supabase } from '@/lib/supabaseClient';

export default async function ProductsPage() {
  

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Gerenciamento de Produtos</h1>
      <AddProductForm />
      <ProductTable products={products || []} />
    </div>
  );
}
// src/app/page.tsx

import { createClient } from '@supabase/supabase-js';
import AddProductForm from '@/components/AddProductForm';
import ProductTable from '@/components/ProductTable';

export default async function ProductsPage() {
  

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

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
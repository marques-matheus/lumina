// Importamos as ferramentas necessárias
import { faker } from '@faker-js/faker';
import { createClient } from '@supabase/supabase-js';

// Precisamos carregar nossas variáveis de ambiente para ter acesso às chaves do Supabase
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log('Iniciando o script de seeding...');

// Conectando ao Supabase.
// Note que aqui usamos a SERVICE_ROLE_KEY, pois este script roda em um ambiente seguro
// (sua máquina) e precisa de permissão para escrever no banco.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Variáveis de ambiente do Supabase não encontradas!");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Função principal do nosso seeder
async function main() {
  const productsToCreate = 20;
  const products = [];

  console.log(`Gerando ${productsToCreate} produtos...`);

  // Um array com algumas marcas para termos dados consistentes para os filtros
  const brands = ['Dell', 'HP', 'Apple', 'Samsung', 'Logitech', 'Kingston'];

  for (let i = 0; i < productsToCreate; i++) {
    products.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      brand: faker.helpers.arrayElement(brands), // Escolhe uma marca aleatória da nossa lista
      quantity: faker.number.int({ min: 0, max: 100 }),
      sale_price: faker.commerce.price({ min: 50, max: 5000 }),
      is_active: true,
    });
  }

  console.log('Inserindo produtos no banco de dados...');

  // Usamos .insert() para inserir todos os produtos de uma vez
  const { error } = await supabase.from('products').insert(products);

  if (error) {
    console.error('Erro ao inserir produtos:', error);
  } else {
    console.log('Seeding concluído com sucesso! 🎉');
  }
}

// Executamos a função principal
main();
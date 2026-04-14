import { db, schema } from '../lib/db.js';

async function checkProducts() {
  try {
    const prods = await db.select().from(schema.productos).limit(5);
    console.log('--- PRODUCTOS EN DB ---');
    console.table(prods.map(p => ({ titulo: p.titulo, asin: p.asin, categoriaId: p.categoriaId })));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProducts();

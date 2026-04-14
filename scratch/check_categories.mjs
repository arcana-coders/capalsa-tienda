import { db, schema } from '../lib/db.js';

async function checkCategories() {
  try {
    const cats = await db.select().from(schema.categorias);
    console.log('--- CATEGORIAS EN DB ---');
    console.table(cats.map(c => ({ nombre: c.nombre, slug: c.slug })));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCategories();

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { db, schema } from '@/lib/db'
import { eq, isNull, and } from 'drizzle-orm'
import ProductCard from '@/components/catalog/ProductCard'

async function getDestacados() {
  try {
    return await db.select().from(schema.productos)
      .where(and(eq(schema.productos.activo, true), eq(schema.productos.destacado, true)))
      .limit(8)
  } catch { return [] }
}

async function getCategorias() {
  try {
    return await db.select().from(schema.categorias)
      .where(and(eq(schema.categorias.activa, true), isNull(schema.categorias.padreId)))
      .orderBy(schema.categorias.orden)
      .limit(8)
  } catch { return [] }
}

const CATEGORIAS_FALLBACK = [
  { id: '1', nombre: 'Herramientas', slug: 'herramientas', emoji: '🔧' },
  { id: '2', nombre: 'Hogar',        slug: 'hogar',        emoji: '🏠' },
  { id: '3', nombre: 'Electrónica',  slug: 'electronica',  emoji: '💡' },
  { id: '4', nombre: 'Deportes',     slug: 'deportes',     emoji: '⚽' },
  { id: '5', nombre: 'Jardinería',   slug: 'jardineria',   emoji: '🌿' },
  { id: '6', nombre: 'Oficina',      slug: 'oficina',      emoji: '💼' },
  { id: '7', nombre: 'Automotriz',   slug: 'automotriz',   emoji: '🚗' },
  { id: '8', nombre: 'Bebés',        slug: 'bebes',        emoji: '🍼' },
]

export default async function HomePage() {
  const [destacados, categorias] = await Promise.all([getDestacados(), getCategorias()])
  const cats = categorias.length > 0 ? categorias : CATEGORIAS_FALLBACK

  return (
    <main>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#1A1A1A] to-[#2d2d2d] text-white py-14 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#C4813A] text-sm font-semibold uppercase tracking-widest mb-3">
            Envío gratis en todos tus pedidos
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Los mejores productos,<br />al mejor precio
          </h1>
          <p className="text-white/70 text-base mb-8 max-w-xl mx-auto">
            Miles de productos seleccionados para ti. Herramientas, hogar, electrónica y mucho más.
          </p>
          <Link href="/categorias" className="inline-block bg-[#C4813A] hover:bg-[#A36A28] text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm">
            Ver todo el catálogo
          </Link>
        </div>
      </section>

      {/* Categorías */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Comprar por categoría</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {cats.map((cat: any) => (
            <Link key={cat.id} href={`/categoria/${cat.slug}`}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#F5F5F5] hover:bg-[#C4813A] hover:text-white group transition-colors text-center">
              <span className="text-2xl">{cat.emoji ?? '📦'}</span>
              <span className="text-xs font-medium text-[#1A1A1A] group-hover:text-white leading-tight">{cat.nombre}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      {destacados.length > 0 ? (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1A1A1A]">Productos destacados</h2>
            <Link href="/categorias" className="text-sm text-[#C4813A] hover:underline font-medium">Ver todos →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {destacados.map((p: any) => <ProductCard key={p.id} producto={p} />)}
          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-4 py-10 text-center">
          <div className="bg-[#F5F5F5] rounded-2xl p-12">
            <span className="text-6xl">📦</span>
            <h2 className="text-xl font-bold mt-4 mb-2">Los productos vienen en camino</h2>
            <p className="text-[#6B6B6B] text-sm">Estamos cargando nuestro catálogo. Vuelve pronto.</p>
          </div>
        </section>
      )}

      {/* Banner envío gratis */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-[#C4813A] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold mb-1">🚚 Envío gratis en todos tus pedidos</h3>
            <p className="text-white/80 text-sm">Sin mínimo de compra. Envío estándar a todo México.</p>
          </div>
          <Link href="/categorias" className="bg-white text-[#C4813A] font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-white/90 transition-colors whitespace-nowrap">
            Comprar ahora
          </Link>
        </div>
      </section>
    </main>
  )
}

export const dynamic = 'force-dynamic'

import { db, schema } from '@/lib/db'
import { eq, and, ilike } from 'drizzle-orm'
import ProductCard from '@/components/catalog/ProductCard'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function BuscarPage({ searchParams }: Props) {
  const { q = '' } = await searchParams
  const query = q.trim()

  const productos = query
    ? await db.select().from(schema.productos)
        .where(and(eq(schema.productos.activo, true), ilike(schema.productos.titulo, `%${query}%`)))
        .limit(48)
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-[#6B6B6B] mb-4 flex items-center gap-1">
        <Link href="/" className="hover:text-[#C4813A]">Inicio</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">Búsqueda</span>
      </nav>

      <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">
        {query ? `Resultados para "${query}"` : 'Buscar productos'}
      </h1>
      {productos.length > 0 && (
        <p className="text-sm text-[#6B6B6B] mb-6">
          {productos.length} {productos.length === 1 ? 'resultado' : 'resultados'}
        </p>
      )}

      {!query && (
        <p className="text-[#6B6B6B] mt-6">Ingresa un término en la barra de búsqueda.</p>
      )}

      {query && productos.length === 0 && (
        <div className="text-center py-16 text-[#6B6B6B]">
          <span className="text-5xl">🔍</span>
          <p className="mt-4 font-medium">No encontramos productos para &quot;{query}&quot;</p>
          <p className="text-sm mt-1">Intenta con otras palabras o explora nuestras categorías.</p>
          <Link href="/categorias" className="mt-4 inline-block text-[#C4813A] font-medium hover:underline text-sm">
            Ver todas las categorías
          </Link>
        </div>
      )}

      {productos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {productos.map((p: any) => <ProductCard key={p.id} producto={p} />)}
        </div>
      )}
    </div>
  )
}

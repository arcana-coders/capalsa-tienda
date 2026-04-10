export const dynamic = 'force-dynamic'

import { db, schema } from '@/lib/db'
import { eq, and, gte, lte, asc, desc } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/catalog/ProductCard'
import CategorySidebar from '@/components/catalog/CategorySidebar'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ marca?: string; min?: string; max?: string; orden?: string }>
}

export default async function CategoriaPage({ params, searchParams }: Props) {
  const { slug } = await params
  const filtros = await searchParams

  const [categoria] = await db.select().from(schema.categorias)
    .where(eq(schema.categorias.slug, slug))
    .limit(1)

  if (!categoria) notFound()

  // Construir condiciones de filtro
  const condiciones: any[] = [
    eq(schema.productos.activo, true),
    eq(schema.productos.categoriaId, categoria.id),
  ]
  if (filtros.marca) condiciones.push(eq(schema.productos.marca, filtros.marca))
  if (filtros.min)   condiciones.push(gte(schema.productos.precio, filtros.min))
  if (filtros.max)   condiciones.push(lte(schema.productos.precio, filtros.max))

  const ordenCol = filtros.orden === 'precio_asc'  ? asc(schema.productos.precio)
                 : filtros.orden === 'precio_desc' ? desc(schema.productos.precio)
                 : desc(schema.productos.creadoEn)

  const productos = await db.select().from(schema.productos)
    .where(and(...condiciones))
    .orderBy(ordenCol)
    .limit(48)

  // Marcas disponibles en la categoría
  const todasMarcas = await db.selectDistinct({ marca: schema.productos.marca })
    .from(schema.productos)
    .where(and(eq(schema.productos.activo, true), eq(schema.productos.categoriaId, categoria.id)))
  const marcas = todasMarcas.map(r => r.marca).filter(Boolean) as string[]

  const hayFiltros = !!(filtros.marca || filtros.min || filtros.max)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#6B6B6B] mb-4 flex items-center gap-1">
        <Link href="/" className="hover:text-[#C4813A]">Inicio</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">{categoria.nombre}</span>
      </nav>

      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">{categoria.nombre}</h1>

      <div className="flex gap-6">
        <aside className="hidden md:block w-56 flex-shrink-0">
          <CategorySidebar marcas={marcas} filtrosActivos={filtros} />
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[#6B6B6B]">
              {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
              {hayFiltros && <span className="ml-2 text-[#C4813A]">· filtros activos</span>}
            </p>
            <OrdenSelect valorActual={filtros.orden} slug={slug} />
          </div>

          {productos.length === 0 ? (
            <div className="text-center py-16 text-[#6B6B6B]">
              <span className="text-5xl">😕</span>
              <p className="mt-4 font-medium">No hay productos con estos filtros</p>
              <Link href={`/categoria/${slug}`} className="text-[#C4813A] text-sm mt-2 inline-block hover:underline">
                Ver todos los productos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {productos.map((p: any) => <ProductCard key={p.id} producto={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function OrdenSelect({ valorActual, slug }: { valorActual?: string; slug: string }) {
  return (
    <select
      defaultValue={valorActual ?? ''}
      className="text-sm border border-[#E0E0E0] rounded-lg px-3 py-1.5 text-[#1A1A1A] focus:outline-none focus:border-[#C4813A]"
    >
      <option value="">Más recientes</option>
      <option value="precio_asc">Precio: menor a mayor</option>
      <option value="precio_desc">Precio: mayor a menor</option>
    </select>
  )
}

export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/catalog/ProductCard'
import CategorySidebar from '@/components/catalog/CategorySidebar'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ marca?: string; min?: string; max?: string; orden?: string }>
}

async function getCategoria(slug: string) {
  const { data } = await supabase
    .from('categorias')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

async function getProductos(categoriaId: string, filtros: any) {
  let query = supabase
    .from('productos')
    .select('id, asin, titulo, slug, precio, precio_compare, imagenes, marca, destacado')
    .eq('activo', true)
    .eq('categoria_id', categoriaId)

  if (filtros.marca) query = query.eq('marca', filtros.marca)
  if (filtros.min) query = query.gte('precio', Number(filtros.min))
  if (filtros.max) query = query.lte('precio', Number(filtros.max))

  if (filtros.orden === 'precio_asc') query = query.order('precio', { ascending: true })
  else if (filtros.orden === 'precio_desc') query = query.order('precio', { ascending: false })
  else query = query.order('creado_en', { ascending: false })

  const { data } = await query.limit(48)
  return data ?? []
}

async function getMarcas(categoriaId: string) {
  const { data } = await supabase
    .from('productos')
    .select('marca')
    .eq('activo', true)
    .eq('categoria_id', categoriaId)
    .not('marca', 'is', null)
  const marcas = [...new Set((data ?? []).map((p: any) => p.marca))].filter(Boolean)
  return marcas as string[]
}

export default async function CategoriaPage({ params, searchParams }: Props) {
  const { slug } = await params
  const filtros = await searchParams

  const categoria = await getCategoria(slug)
  if (!categoria) notFound()

  const [productos, marcas] = await Promise.all([
    getProductos(categoria.id, filtros),
    getMarcas(categoria.id),
  ])

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
        {/* Sidebar filtros */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <CategorySidebar marcas={marcas} filtrosActivos={filtros} />
        </aside>

        {/* Grid de productos */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[#6B6B6B]">
              {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
            </p>
            <OrdenSelect valorActual={filtros.orden} />
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
              {productos.map((p: any) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function OrdenSelect({ valorActual }: { valorActual?: string }) {
  return (
    <form>
      <select
        name="orden"
        defaultValue={valorActual ?? ''}
        onChange={(e) => {
          const url = new URL(window.location.href)
          url.searchParams.set('orden', e.target.value)
          window.location.href = url.toString()
        }}
        className="text-sm border border-[#E0E0E0] rounded-lg px-3 py-1.5 text-[#1A1A1A] focus:outline-none focus:border-[#C4813A]"
      >
        <option value="">Más recientes</option>
        <option value="precio_asc">Precio: menor a mayor</option>
        <option value="precio_desc">Precio: mayor a menor</option>
      </select>
    </form>
  )
}

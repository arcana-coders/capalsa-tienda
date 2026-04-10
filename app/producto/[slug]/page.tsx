export const dynamic = 'force-dynamic'

import { db, schema } from '@/lib/db'
import { eq, and, ne } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import ProductImages from '@/components/product/ProductImages'
import ProductInfo from '@/components/product/ProductInfo'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params

  const [producto] = await db.select().from(schema.productos)
    .where(and(eq(schema.productos.slug, slug), eq(schema.productos.activo, true)))
    .limit(1)

  if (!producto) notFound()

  // Categoría
  let categoria = null
  if (producto.categoriaId) {
    const [cat] = await db.select().from(schema.categorias)
      .where(eq(schema.categorias.id, producto.categoriaId)).limit(1)
    categoria = cat ?? null
  }

  // Relacionados
  const relacionados = producto.categoriaId
    ? await db.select().from(schema.productos)
        .where(and(
          eq(schema.productos.activo, true),
          eq(schema.productos.categoriaId, producto.categoriaId),
          ne(schema.productos.id, producto.id)
        ))
        .limit(4)
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#6B6B6B] mb-6 flex items-center gap-1">
        <Link href="/" className="hover:text-[#C4813A]">Inicio</Link>
        <span>/</span>
        {categoria && (
          <>
            <Link href={`/categoria/${categoria.slug}`} className="hover:text-[#C4813A]">{categoria.nombre}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-[#1A1A1A] font-medium line-clamp-1">{producto.titulo}</span>
      </nav>

      {/* Producto principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <ProductImages imagenes={(producto.imagenes as string[]) ?? []} titulo={producto.titulo} />
        <ProductInfo producto={producto as any} />
      </div>

      {/* Descripción */}
      {producto.descripcion && (
        <div className="mt-12 border-t border-[#E0E0E0] pt-8">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">Descripción del producto</h2>
          <p className="text-sm text-[#6B6B6B] leading-relaxed whitespace-pre-line max-w-3xl">{producto.descripcion}</p>
        </div>
      )}

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <div className="mt-12 border-t border-[#E0E0E0] pt-8">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-6">Productos relacionados</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relacionados.map((p: any) => (
              <Link key={p.id} href={`/producto/${p.slug}`}
                className="group flex flex-col bg-white rounded-xl border border-[#E0E0E0] hover:shadow-md transition-shadow overflow-hidden">
                <div className="relative aspect-square bg-[#F5F5F5]">
                  {(p.imagenes as string[])?.[0] && (
                    <img src={(p.imagenes as string[])[0]} alt={p.titulo}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-[#1A1A1A] line-clamp-2 mb-1">{p.titulo}</p>
                  <p className="text-sm font-bold text-[#1A1A1A]">
                    {Number(p.precio).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

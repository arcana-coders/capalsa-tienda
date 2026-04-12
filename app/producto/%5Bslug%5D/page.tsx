export const dynamic = 'force-dynamic'

import { db, schema } from '@/lib/db'
import { eq, and, ne } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import ProductImages from '@/components/product/ProductImages'
import ProductInfo from '@/components/product/ProductInfo'
import ProductCard from '@/components/catalog/ProductCard'
import Link from 'next/link'

function cleanDescription(raw: string | null | undefined): string | null {
  if (!raw) return null
  const clean = raw
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return clean.length > 10 ? clean : null
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params

  const [producto] = await db.select().from(schema.productos)
    .where(and(eq(schema.productos.slug, slug), eq(schema.productos.activo, true)))
    .limit(1)

  if (!producto) notFound()

  let categoria = null
  if (producto.categoriaId) {
    const [cat] = await db.select().from(schema.categorias)
      .where(eq(schema.categorias.id, producto.categoriaId)).limit(1)
    categoria = cat ?? null
  }

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
    <main className="bg-[#fbf9f8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb Editorial */}
        <nav className="text-[11px] font-bold uppercase tracking-widest text-[#74787e] mb-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/" className="hover:text-[#00386c] transition-colors">Inicio</Link>
          <span className="text-[#c4c8ce]">/</span>
          {categoria && (
            <>
              <Link href={`/categoria/${categoria.slug}`} className="hover:text-[#00386c] transition-colors">{categoria.nombre}</Link>
              <span className="text-[#c4c8ce]">/</span>
            </>
          )}
          <span className="text-[#00386c] font-black truncate">{producto.titulo}</span>
        </nav>

        {/* Producto principal layout asimétrico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <ProductImages imagenes={(producto.imagenes as string[]) ?? []} titulo={producto.titulo} />
          <ProductInfo producto={producto as any} />
        </div>

        {/* Descripción — Estilo refinado */}
        {cleanDescription(producto.descripcion) && (
          <section className="mt-20 border-t border-[#c4c8ce]/20 pt-12 max-w-4xl">
            <h2
              className="text-2xl font-black text-[#1b1c1c] mb-6"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Detalles del producto
            </h2>
            <div className="prose prose-sm max-w-none text-[#44494e] leading-relaxed">
              <p className="whitespace-pre-line text-sm md:text-base">
                {cleanDescription(producto.descripcion)!
                  .replace(/\bAmazon\.com\b/gi, 'Capalsa')
                  .replace(/\bAmazon\b/gi, 'Capalsa')}
              </p>
            </div>
          </section>
        )}

        {/* Relacionados — Grid editorial */}
        {relacionados.length > 0 && (
          <section className="mt-20 border-t border-[#c4c8ce]/20 pt-12">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2
                  className="text-2xl font-black text-[#1b1c1c]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  También te puede interesar
                </h2>
                <p className="text-sm text-[#74787e] mt-1">Explora más opciones en {categoria?.nombre}</p>
              </div>
              <Link href={`/categoria/${categoria?.slug}`} className="text-sm font-bold text-[#00386c] hover:underline underline-offset-4">
                Ver todos
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relacionados.map((p: any) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

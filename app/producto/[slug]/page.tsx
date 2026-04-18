export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { db, schema } from '@/lib/db'
import { eq, and, ne } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import ProductImages from '@/components/product/ProductImages'
import ProductInfo from '@/components/product/ProductInfo'
import Link from 'next/link'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [p] = await db.select({
    titulo: schema.productos.titulo,
    descripcion: schema.productos.descripcion,
    bullets: schema.productos.bullets,
    imagenes: schema.productos.imagenes,
    precio: schema.productos.precio,
    marca: schema.productos.marca,
  }).from(schema.productos)
    .where(and(eq(schema.productos.slug, slug), eq(schema.productos.activo, true)))
    .limit(1)

  if (!p) return {}

  const bullets = (p.bullets as string[]) ?? []
  const desc = bullets[0]
    ? `${bullets[0].slice(0, 145)}. Envío a todo México.`
    : `Compra ${p.titulo} en Capalsa. Producto importado desde USA con envío garantizado a todo México.`

  const imagen = (p.imagenes as string[])?.[0]

  return {
    title: p.titulo,
    description: desc,
    openGraph: {
      title: p.titulo,
      description: desc,
      images: imagen ? [{ url: imagen, alt: p.titulo }] : [],
      type: 'website',
    },
  }
}

/**
 * Limpia el campo descripcion de Amazon:
 * - Elimina etiquetas HTML (descripcion a veces es HTML de secciones A+)
 * - Decodifica entidades HTML básicas
 * - Colapsa espacios/saltos múltiples
 * Retorna null si el resultado es vacío (para no mostrar la sección).
 */
function cleanDescription(raw: string | null | undefined): string | null {
  if (!raw) return null
  const clean = raw
    .replace(/<[^>]*>/g, ' ')          // quita tags HTML
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/[ \t]+/g, ' ')           // colapsa espacios
    .replace(/\n{3,}/g, '\n\n')        // máx 2 saltos seguidos
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

  const reviews = Array.isArray(producto.reviews) ? (producto.reviews as any[]) : []
  const BASE = 'https://www.capalsa.com'

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.titulo,
    image: (producto.imagenes as string[]) ?? [],
    description: cleanDescription(producto.descripcion) ?? producto.titulo,
    ...(producto.marca ? { brand: { '@type': 'Brand', name: producto.marca } } : {}),
    offers: {
      '@type': 'Offer',
      price: Number(producto.precio).toFixed(2),
      priceCurrency: 'MXN',
      availability: 'https://schema.org/InStock',
      url: `${BASE}/producto/${producto.slug}`,
      seller: { '@type': 'Organization', name: 'Capalsa Store' },
    },
    ...(reviews.length > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        reviewCount: String(reviews.length),
      },
    } : {}),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE },
      ...(categoria ? [{ '@type': 'ListItem', position: 2, name: categoria.nombre, item: `${BASE}/categoria/${categoria.slug}` }] : []),
      { '@type': 'ListItem', position: categoria ? 3 : 2, name: producto.titulo, item: `${BASE}/producto/${producto.slug}` },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <ProductImages imagenes={(producto.imagenes as string[]) ?? []} titulo={producto.titulo} />
        <ProductInfo producto={producto as any} />
      </div>

      {/* Descripción — se limpia el HTML antes de mostrar */}
      {cleanDescription(producto.descripcion) && (
        <div className="mt-12 border-t border-[#E0E0E0] pt-8">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">Descripción del producto</h2>
          <p className="text-sm text-[#6B6B6B] leading-relaxed whitespace-pre-line max-w-3xl">
            {cleanDescription(producto.descripcion)!.replace(/\bAmazon\.com\b/gi, 'Capalsa').replace(/\bAmazon\b/gi, 'Capalsa')}
          </p>
        </div>
      )}

      {/* Reviews */}
      {Array.isArray(producto.reviews) && (producto.reviews as any[]).length > 0 && (
        <div className="mt-12 border-t border-[#E0E0E0] pt-8">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-6">Opiniones de clientes</h2>
          <div className="flex flex-col gap-6 max-w-3xl">
            {(producto.reviews as { autor: string; titulo: string; texto: string; fecha: string }[]).map((r, i) => (
              <div key={i} className="bg-[#F9F9F9] border border-[#E0E0E0] rounded-xl p-5">
                {/* Estrellas */}
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-4 h-4 text-[#F4A81D]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                {/* Título */}
                {r.titulo && (
                  <p className="text-sm font-semibold text-[#1A1A1A] mb-1">{r.titulo}</p>
                )}
                {/* Texto */}
                <p className="text-sm text-[#444] leading-relaxed">{r.texto}</p>
                {/* Autor + fecha */}
                <p className="text-xs text-[#9B9B9B] mt-3">
                  {r.autor}{r.fecha ? ` · ${r.fecha}` : ''}
                </p>
              </div>
            ))}
          </div>
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
                      className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />
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

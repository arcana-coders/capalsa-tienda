export const revalidate = 600

import Link from 'next/link'
import { db, schema } from '@/lib/db'
import { and, eq, sql } from 'drizzle-orm'
import ProductCard from '@/components/catalog/ProductCard'
import CopyDiscountButton from '@/components/checkout/CopyDiscountButton'

export const metadata = {
  title: 'Gracias por tu compra | CAPALSA',
  description: 'Soporte, garantía, productos recomendados y beneficio especial para clientes CAPALSA.',
}

const DISCOUNT_CODE = 'GRACIAS10'
const WHATSAPP_URL = 'https://wa.me/527774087291?text=Hola%2C%20compre%20un%20producto%20CAPALSA%20y%20quiero%20ayuda%20para%20encontrarlo%20en%20la%20tienda.'

async function getProductosDestacados() {
  try {
    const rows = await db.select({
      id: schema.productos.id,
      titulo: schema.productos.titulo,
      slug: schema.productos.slug,
      precio: schema.productos.precio,
      precioCompare: schema.productos.precioCompare,
      imagenes: schema.productos.imagenes,
      marca: schema.productos.marca,
      asin: schema.productos.asin,
      categoriaId: schema.productos.categoriaId,
    })
      .from(schema.productos)
      .where(and(eq(schema.productos.activo, true), eq(schema.productos.destacado, true)))
      .orderBy(sql`RANDOM()`)
      .limit(8)

    return rows.map((p) => ({
      ...p,
      precio: Number(p.precio),
      precioCompare: p.precioCompare ? Number(p.precioCompare) : undefined,
      imagenes: (p.imagenes as string[]) ?? [],
      marca: p.marca ?? undefined,
      asin: p.asin ?? undefined,
      categoriaId: p.categoriaId ?? undefined,
    }))
  } catch (error) {
    console.error('Error fetching thanks landing products:', error)
    return []
  }
}

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const IconMessage = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
  </svg>
)

export default async function GraciasPage() {
  const productos = await getProductosDestacados()

  return (
    <main className="bg-surface">
      <section className="relative overflow-hidden bg-primary text-on-primary">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-primary-container/30 skew-x-[-16deg] translate-x-24" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center [&>*]:min-w-0">
            <div className="max-w-2xl min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-secondary-container mb-5">
                Beneficio especial CAPALSA
              </p>
              <h1
                className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.98]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Gracias por tu compra.
              </h1>
              <p className="mt-6 text-lg md:text-xl text-on-primary/75 leading-relaxed">
                Sabemos que tu pedido tomó más tiempo del esperado. Gracias por tu paciencia:
                queremos darte un descuento especial para tu próxima compra en CAPALSA.
              </p>
            </div>

            <div className="bg-surface-lowest text-foreground rounded-[2rem] p-6 md:p-8 shadow-2xl border border-white/10 min-w-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-black uppercase tracking-[0.2em]">
                10% de descuento
              </span>
              <div className="mt-5 flex items-stretch gap-3">
                <div className="flex-1 rounded-2xl border border-outline-variant/40 bg-surface-low px-4 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-outline mb-1">Código</p>
                  <p className="text-3xl font-black text-primary tracking-tight">{DISCOUNT_CODE}</p>
                </div>
                <CopyDiscountButton code={DISCOUNT_CODE} />
              </div>
              <p className="mt-4 text-sm text-on-surface-variant leading-relaxed">
                Úsalo en el checkout. Válido por tiempo limitado y no acumulable con otras promociones.
              </p>
              <Link
                href="/categorias"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-black text-on-primary transition-all hover:bg-primary-container hover:-translate-y-0.5"
              >
                Comprar con descuento
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-stretch [&>*]:min-w-0">
          <div className="bg-surface-lowest rounded-[2rem] p-6 md:p-8 border border-outline-variant/20 shadow-sm min-w-0">
            <h2 className="text-2xl font-black text-foreground tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Encuentra tu producto
            </h2>
            <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
              Busca por nombre, marca o ASIN. Si el producto que compraste todavía no aparece publicado,
              escríbenos y lo resolvemos contigo.
            </p>
            <form action="/buscar" className="mt-6 flex w-full">
              <input
                type="search"
                name="q"
                placeholder="Buscar producto o ASIN"
                className="min-w-0 flex-1 h-12 rounded-l-2xl bg-surface-low px-4 text-sm font-medium outline-none ring-1 ring-outline-variant/30 focus:ring-primary"
              />
              <button
                type="submit"
                className="h-12 rounded-r-2xl bg-primary px-5 text-on-primary hover:bg-primary-container transition-colors"
                aria-label="Buscar"
              >
                <IconSearch />
              </button>
            </form>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 min-w-0 [&>*]:min-w-0">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary-container text-on-secondary-container rounded-[2rem] p-6 flex flex-col justify-between min-h-[190px] transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="w-11 h-11 rounded-2xl bg-white/70 flex items-center justify-center text-secondary">
                <IconMessage />
              </span>
              <div>
                <h3 className="text-lg font-black tracking-tight">WhatsApp</h3>
                <p className="mt-2 text-sm leading-relaxed text-on-secondary-container/75">
                  Para productos no publicados, dudas de garantía o ayuda con tu recompra.
                </p>
              </div>
            </a>
            <a
              href="mailto:contacto@capalsa.com?subject=Ayuda%20con%20producto%20CAPALSA"
              className="bg-surface-lowest rounded-[2rem] p-6 border border-outline-variant/20 flex flex-col justify-between min-h-[190px] transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="w-11 h-11 rounded-2xl bg-surface-low flex items-center justify-center text-primary">
                <IconMessage />
              </span>
              <div>
                <h3 className="text-lg font-black tracking-tight text-foreground">Correo</h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  contacto@capalsa.com
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between mb-6 gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-2">Recomendados</p>
            <h2 className="text-2xl font-black text-foreground tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Productos disponibles en CAPALSA
            </h2>
          </div>
          <Link href="/categorias" className="text-sm font-bold text-primary hover:text-primary-container transition-colors">
            Ver catálogo
          </Link>
        </div>

        {productos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {productos.map((producto: any, index: number) => (
              <ProductCard key={producto.id} producto={producto} priority={index < 4} />
            ))}
          </div>
        ) : (
          <div className="bg-surface-lowest rounded-[2rem] border border-outline-variant/20 p-10 text-center">
            <h3 className="text-lg font-black text-foreground">Estamos preparando el catálogo</h3>
            <p className="mt-2 text-sm text-on-surface-variant">
              Mientras tanto, escríbenos por WhatsApp y te ayudamos a encontrar tu producto.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

export const revalidate = 600 // Revalidar cada 10 minutos

import React from 'react'
import Link from 'next/link'
import { db, schema } from '@/lib/db'
import { eq, isNull, and, sql } from 'drizzle-orm'
import ProductCard from '@/components/catalog/ProductCard'
import HeroSection from '@/components/home/HeroSection'
import TrustBar from '@/components/home/TrustBar'
import OfertasDelDia from '@/components/home/OfertasDelDia'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import FAQSection from '@/components/home/FAQSection'

async function getDestacados() {
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
      .limit(12)

    return rows.map(p => ({
      ...p,
      precio: Number(p.precio),
      precioCompare: p.precioCompare ? Number(p.precioCompare) : undefined,
      imagenes: (p.imagenes as string[]) ?? [],
      marca: p.marca ?? undefined,
      asin: p.asin ?? undefined,
      categoriaId: p.categoriaId ?? undefined,
    }))
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

async function getCategorias() {
  try {
    return await db.select({
      id: schema.categorias.id,
      nombre: schema.categorias.nombre,
      slug: schema.categorias.slug
    })
      .from(schema.categorias)
      .where(and(eq(schema.categorias.activa, true), isNull(schema.categorias.padreId)))
      .orderBy(schema.categorias.orden)
      .limit(8)
  } catch (error) {
    console.error('Error fetching categories for homepage:', error)
    return []
  }
}

// SVG icons para categorías
const CatIcons: Record<string, () => React.ReactElement> = {
  herramientas: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  hogar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  electronica: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  deportes: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
      <path d="M2 12h20"/>
    </svg>
  ),
  jardineria: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12"/>
      <path d="M5 12C5 7 8 3.5 12 3.5S19 7 19 12"/>
      <path d="M5 12c0-2.5 3.5-5 7-5s7 2.5 7 5"/>
    </svg>
  ),
  oficina: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="16"/>
      <line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  ),
  automotriz: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h6l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z"/>
      <circle cx="7.5" cy="17" r="1.5"/>
      <circle cx="16.5" cy="17" r="1.5"/>
    </svg>
  ),
  bebes: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12h.01M15 12h.01M12 16c.667.667 2 1 3 0"/>
      <path d="M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3z"/>
    </svg>
  ),
  limpieza: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H5L3 9v1h18V9L19 3h-4"/>
      <path d="M3 10v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9"/>
      <path d="M12 10v11"/>
      <path d="M8 14h8"/>
    </svg>
  ),
  mascotas: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="14" r="6"/>
      <path d="M9 12h.01M15 12h.01M12 16c1 .5 2 .5 3-.5"/>
      <path d="M7 8c0-2 1-3.5 3-3.5M17 8c0-2-1-3.5-3-3.5"/>
    </svg>
  ),
  salud: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  cocina: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/>
      <line x1="10" y1="1" x2="10" y2="4"/>
      <line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ),
}

const IconDefault = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
)

const CATEGORIAS_FALLBACK = [
  { id: '1', nombre: 'Mascotas',   slug: 'mascotas',   href: '/categorias' },
  { id: '2', nombre: 'Limpieza',   slug: 'limpieza',   href: '/categorias' },
  { id: '3', nombre: 'Deportes',   slug: 'deportes',   href: '/categorias' },
  { id: '4', nombre: 'Hogar',      slug: 'hogar',      href: '/categorias' },
  { id: '5', nombre: 'Salud',      slug: 'salud',      href: '/categorias' },
  { id: '6', nombre: 'Oficina',    slug: 'oficina',    href: '/categorias' },
  { id: '7', nombre: 'Automotriz', slug: 'automotriz', href: '/categorias' },
  { id: '8', nombre: 'Cocina',     slug: 'cocina',     href: '/categorias' },
]

export default async function HomePage() {
  const [destacados, categorias] = await Promise.all([getDestacados(), getCategorias()])
  const cats = categorias.length > 0 ? categorias : CATEGORIAS_FALLBACK

  // Primeros 5 productos para "Ofertas del día", el resto para "Más vendidos"
  const ofertasProductos = destacados.slice(0, 5)
  const masVendidos = destacados.slice(5)

  return (
    <main className="bg-surface">
      {/* 1. Hero asimétrico */}
      <HeroSection />

      {/* 2. Trust bar */}
      <TrustBar />

      {/* 3. Ofertas del día — layout editorial */}
      {ofertasProductos.length > 0 && (
        <OfertasDelDia productos={ofertasProductos} />
      )}

      {/* 4. Comprar por categoría */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2
              className="text-2xl font-black text-foreground"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Comprar por categoría
            </h2>
            <p className="text-sm text-on-surface-variant mt-0.5">Encuentra exactamente lo que necesitas</p>
          </div>
          <Link href="/categorias" className="text-sm font-semibold text-primary hover:text-primary-container transition-colors">
            Ver todas →
          </Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {cats.map((cat: any) => {
            const IconComp = CatIcons[cat.slug] ?? IconDefault
            const href = cat.href ?? `/categoria/${cat.slug}`
            return (
              <Link
                key={cat.id}
                href={href}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-surface-lowest hover:bg-primary hover:text-on-primary group transition-all duration-200 text-center shadow-sm hover:shadow-md"
              >
                <span className="text-secondary group-hover:text-secondary-container transition-colors" aria-hidden="true">
                  <IconComp />
                </span>
                <span className="text-xs font-semibold text-foreground group-hover:text-on-primary leading-tight transition-colors duration-200">
                  {cat.nombre}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 5. Más vendidos — scroll horizontal */}
      {masVendidos.length > 0 ? (
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2
                  className="text-2xl font-black text-foreground"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Más vendidos
                </h2>
                <p className="text-sm text-on-surface-variant mt-0.5">Los favoritos de nuestros clientes</p>
              </div>
              <Link href="/categorias" className="text-sm font-semibold text-primary hover:text-primary-container transition-colors">
                Ver todos →
              </Link>
            </div>
          </div>
          {/* Horizontal scroll */}
          <div className="pl-4 md:pl-[max(1rem,calc((100vw-80rem)/2+1rem))]">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none" style={{ scrollSnapType: 'x mandatory' }}>
              {masVendidos.map((p: any) => (
                <div key={p.id} className="flex-shrink-0 w-[240px]" style={{ scrollSnapAlign: 'start' }}>
                  <ProductCard producto={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : destacados.length === 0 ? (
        <section className="max-w-7xl mx-auto px-4 py-10 text-center">
          <div className="bg-surface-lowest rounded-2xl p-12 shadow-sm">
            <h2 className="text-xl font-bold mt-4 mb-2 text-foreground">Los productos vienen en camino</h2>
            <p className="text-on-surface-variant text-sm">Estamos cargando nuestro catálogo. Vuelve pronto.</p>
          </div>
        </section>
      ) : null}

      {/* 6. Testimonios */}
      <TestimonialsSection />

      {/* 7. FAQ */}
      <FAQSection />

      {/* 8. Banner Editorial — Diferencial Capalsa */}
      <section className="max-w-7xl mx-auto px-4 py-16 scroll-mt-20">
        <div className="bg-primary rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Panel izquierdo — ilustración de ruta USA→MX */}
            <div className="relative min-h-[320px] bg-gradient-to-br from-primary to-primary-container p-8 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 300 280" className="w-64 h-64 drop-shadow-2xl" fill="none" aria-hidden="true">
                {/* Fondo sutil */}
                <circle cx="150" cy="140" r="120" fill="white" fillOpacity="0.04" />
                <circle cx="150" cy="140" r="90" stroke="white" strokeOpacity="0.07" strokeWidth="1.5" strokeDasharray="6 6" />

                {/* Paquete — flat isometric */}
                <path d="M100 120 L150 95 L200 120 L150 145 Z" fill="#1a4f8b" />
                <path d="M100 120 L100 195 L150 220 L150 145 Z" fill="#00386c" />
                <path d="M200 120 L200 195 L150 220 L150 145 Z" fill="#0a2d55" />
                {/* Tape */}
                <line x1="150" y1="95" x2="150" y2="220" stroke="#c1ebb5" strokeWidth="10" strokeOpacity="0.2" />
                <line x1="100" y1="157" x2="200" y2="157" stroke="#c1ebb5" strokeWidth="7" strokeOpacity="0.14" />

                {/* Badge USA — esquina superior derecha */}
                <circle cx="222" cy="82" r="30" fill="white" fillOpacity="0.12" />
                <circle cx="222" cy="82" r="22" fill="white" fillOpacity="0.18" />
                <text x="222" y="78" textAnchor="middle" fill="white" fontSize="7" fontWeight="800" letterSpacing="2" fontFamily="'Inter', system-ui, sans-serif">ORIGEN</text>
                <text x="222" y="92" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="'Plus Jakarta Sans', sans-serif">USA</text>

                {/* Ruta de envío */}
                <path d="M222 82 C250 130 230 180 100 210" stroke="#c1ebb5" strokeWidth="1.5" strokeDasharray="8 6" strokeOpacity="0.5" fill="none" />

                {/* Avión */}
                <g transform="translate(200, 145) rotate(135)">
                  <path d="M0 0 L12 -4 L13 0 L12 4 Z" fill="#c1ebb5" fillOpacity="0.7" />
                  <path d="M3 -4 L8 -10 L11 -7 L6 -1 Z" fill="#c1ebb5" fillOpacity="0.5" />
                  <path d="M3 4 L8 10 L11 7 L6 1 Z" fill="#c1ebb5" fillOpacity="0.5" />
                </g>

                {/* Pin destino */}
                <g transform="translate(83, 197)">
                  <path d="M11 0C5 0 0 5 0 11 0 19 11 30 11 30 11 30 22 19 22 11 22 5 17 0 11 0Z" fill="#c1ebb5" fillOpacity="0.9" />
                  <circle cx="11" cy="11" r="5" fill="#00386c" />
                </g>

                {/* Puntos decorativos */}
                <circle cx="60" cy="90" r="3" fill="white" fillOpacity="0.12" />
                <circle cx="258" cy="200" r="4" fill="white" fillOpacity="0.1" />
                <circle cx="240" cy="230" r="2" fill="#c1ebb5" fillOpacity="0.3" />
              </svg>
            </div>

            {/* Texto y CTA */}
            <div className="p-10 lg:p-14 flex flex-col justify-center space-y-8 bg-surface-lowest lg:bg-transparent">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 bg-secondary-container text-secondary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                  Exclusivos USA
                </span>
                <h2
                  className="text-3xl lg:text-5xl font-black text-foreground lg:text-on-primary leading-[1.1]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Lo mejor del mundo, <br className="hidden md:block" />
                  <span className="text-secondary lg:text-secondary-container">directo a tu hogar.</span>
                </h2>
                <p className="text-on-surface-variant lg:text-on-primary/70 leading-relaxed text-sm lg:text-base max-w-lg">
                  En Capalsa traemos para ti las novedades de Amazon USA que aún no están en México. Con facturación mexicana deducible y entrega garantizada en tu puerta.
                </p>
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { t: '100% Originales', d: 'Garantía oficial de marca.' },
                  { t: 'Factura Mexicana', d: 'Deducible y con IVA local.' },
                  { t: 'Entrega en 7 días', d: 'Rastreo puerta a puerta.' },
                  { t: 'Catálogo USA', d: 'Acceso a millones de ítems.' },
                ].map((item) => (
                  <li key={item.t} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-surface-low lg:bg-on-primary/10 flex items-center justify-center" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-secondary lg:text-secondary-container">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground lg:text-on-primary">{item.t}</h4>
                      <p className="text-[10px] text-on-surface-variant lg:text-on-primary/60 leading-tight">{item.d}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <Link
                  href="/categorias"
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-hover text-on-tertiary font-black px-10 py-4 rounded-2xl text-sm transition-all duration-300 shadow-xl hover:-translate-y-1 w-full sm:w-fit text-center justify-center"
                >
                  Explorar Catálogo USA
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

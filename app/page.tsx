export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { db, schema } from '@/lib/db'
import { eq, isNull, and, sql } from 'drizzle-orm'
import ProductCard from '@/components/catalog/ProductCard'
import HeroSection from '@/components/home/HeroSection'
import TrustBar from '@/components/home/TrustBar'
import OfertasDelDia from '@/components/home/OfertasDelDia'

async function getDestacados() {
  try {
    return await db.select().from(schema.productos)
      .where(and(eq(schema.productos.activo, true), eq(schema.productos.destacado, true)))
      .orderBy(sql`RANDOM()`)
      .limit(12)
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

// SVG icons para categorías
const CatIcons: Record<string, () => JSX.Element> = {
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
    <main className="bg-[#fbf9f8]">
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
              className="text-2xl font-black text-[#1b1c1c]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Comprar por categoría
            </h2>
            <p className="text-sm text-[#44494e] mt-0.5">Encuentra exactamente lo que necesitas</p>
          </div>
          <Link href="/categorias" className="text-sm font-semibold text-[#00386c] hover:text-[#1a4f8b] transition-colors">
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
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white hover:bg-[#00386c] hover:text-white group transition-all duration-200 text-center shadow-sm hover:shadow-md"
              >
                <span className="text-[#43673c] group-hover:text-[#c1ebb5] transition-colors">
                  <IconComp />
                </span>
                <span className="text-xs font-semibold text-[#1b1c1c] group-hover:text-white leading-tight transition-colors duration-200">
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
                  className="text-2xl font-black text-[#1b1c1c]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Más vendidos
                </h2>
                <p className="text-sm text-[#44494e] mt-0.5">Los favoritos de nuestros clientes</p>
              </div>
              <Link href="/categorias" className="text-sm font-semibold text-[#00386c] hover:text-[#1a4f8b] transition-colors">
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
          <div className="bg-white rounded-2xl p-12 shadow-sm">
            <h2 className="text-xl font-bold mt-4 mb-2 text-[#1b1c1c]">Los productos vienen en camino</h2>
            <p className="text-[#44494e] text-sm">Estamos cargando nuestro catálogo. Vuelve pronto.</p>
          </div>
        </section>
      ) : null}

      {/* 6. Banner editorial — Novedades */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Imagen */}
            <div className="relative min-h-[280px] bg-[#f0f4f0] p-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#c1ebb5]/30 to-[#43673c]/10" />
              <div className="relative text-center space-y-2">
                {/* Ilustración simple SVG */}
                <svg viewBox="0 0 200 200" className="w-40 h-40 mx-auto" fill="none">
                  <circle cx="100" cy="100" r="80" fill="#e8f5e3"/>
                  <rect x="60" y="60" width="80" height="90" rx="8" fill="#43673c" opacity="0.15"/>
                  <rect x="70" y="50" width="60" height="10" rx="4" fill="#43673c" opacity="0.3"/>
                  <rect x="75" y="80" width="50" height="8" rx="3" fill="#43673c" opacity="0.5"/>
                  <rect x="75" y="95" width="40" height="8" rx="3" fill="#43673c" opacity="0.4"/>
                  <rect x="75" y="110" width="45" height="8" rx="3" fill="#43673c" opacity="0.3"/>
                  <circle cx="100" cy="145" r="15" fill="#43673c" opacity="0.2"/>
                  <path d="M92 145l6 6 12-12" stroke="#43673c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            {/* Copy */}
            <div className="p-10 flex flex-col justify-center space-y-6">
              <h2
                className="text-3xl lg:text-4xl font-black text-[#00386c] leading-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Novedades para un Hogar Moderno
              </h2>
              <p className="text-[#44494e] leading-relaxed">
                Acabamos de recibir la nueva colección de organizadores y accesorios de limpieza importados. Diseñados para maximizar tu espacio con el estilo práctico que nos caracteriza.
              </p>
              <ul className="space-y-3">
                {['Nuevos organizadores de acrílico', 'Línea de purificadores de aire 2025', 'Iluminación inteligente para cocina'].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm font-medium text-[#1b1c1c]">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#c1ebb5] flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#43673c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/categorias"
                className="inline-flex items-center gap-2 bg-[#00386c] hover:bg-[#1a4f8b] text-white font-bold px-8 py-4 rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 w-fit"
              >
                Ver Colección Nueva
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

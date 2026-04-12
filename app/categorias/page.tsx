export const dynamic = 'force-dynamic'

import { db, schema } from '@/lib/db'
import { eq, and } from 'drizzle-orm'
import ProductCard from '@/components/catalog/ProductCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catálogo Completo — Capalsa Store',
  description: 'Explora nuestro catálogo completo de productos importados con envío gratis a todo México.',
}

export default async function CategoriasPage() {
  const productos = await db.select().from(schema.productos)
    .where(and(eq(schema.productos.activo, true)))
    .orderBy(schema.productos.creadoEn)

  return (
    <main className="bg-[#fbf9f8] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        
        {/* Header de Catálogo */}
        <header className="mb-12 md:mb-20 text-center max-w-3xl mx-auto">
          <span className="text-[10px] font-black text-[#00386c] uppercase tracking-[0.3em] mb-4 block">Colección Completa</span>
          <h1 
            className="text-4xl md:text-6xl font-black text-[#1b1c1c] tracking-tight leading-none"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Todo el Catálogo
          </h1>
          <p className="mt-6 text-sm md:text-base text-[#44494e] leading-relaxed">
            Desde artículos para el hogar hasta gadgets tecnológicos, descubre nuestra selección curada de {productos.length} productos disponibles hoy.
          </p>
        </header>

        {/* Grid de Productos */}
        {productos.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border border-[#c4c8ce]/20 shadow-sm">
            <span className="text-6xl inline-block mb-6">📦</span>
            <p className="text-[#74787e] font-bold uppercase tracking-widest text-xs">Actualizando catálogo...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
            {productos.map((p: any) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}

        {/* Footer info section */}
        <section className="mt-20 py-12 border-t border-[#c4c8ce]/20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
                <span className="w-12 h-12 rounded-full bg-[#c1ebb5] flex items-center justify-center text-[#43673c]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </span>
                <div>
                    <h4 className="text-sm font-black text-[#1b1c1c]">Garantía Capalsa</h4>
                    <p className="text-xs text-[#74787e]">Cada producto es inspeccionado antes de su envío.</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="w-12 h-12 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#00386c]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
                <div>
                    <h4 className="text-sm font-black text-[#1b1c1c]">Importación Directa</h4>
                    <p className="text-xs text-[#74787e]">Logística optimizada de USA hasta tu hogar.</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="w-12 h-12 rounded-full bg-[#00386c] flex items-center justify-center text-white">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                </span>
                <div>
                    <h4 className="text-sm font-black text-[#1b1c1c]">Envío Gratis</h4>
                    <p className="text-xs text-[#74787e]">Sin sorpresas ni cargos ocultos en checkout.</p>
                </div>
            </div>
        </section>

      </div>
    </main>
  )
}

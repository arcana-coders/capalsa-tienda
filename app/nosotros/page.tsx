'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

const stats = [
  { value: '10+', label: 'Años de experiencia', detail: 'Importando y vendiendo en México desde 2015' },
  { value: '3', label: 'Marketplaces', detail: 'eBay, Mercado Libre y Amazon — todos con ventas activas' },
  { value: '100%', label: 'Importación legal', detail: 'Cruzamos mercancía documentada y con pedimento' },
  { value: 'McAllen', label: 'Bodega propia en Texas', detail: 'Recibimos, inspeccionamos y despachamos desde USA' },
]

const ventajas = [
  {
    title: 'Experiencia real en marketplaces',
    body: 'Empezamos vendiendo en eBay y Mercado Libre cuando casi nadie lo hacía en México. Esa experiencia nos enseñó a seleccionar productos que realmente funcionan.',
  },
  {
    title: 'Bodega en McAllen, Texas',
    body: 'Contamos con bodega propia en McAllen donde recibimos, revisamos y preparamos cada paquete antes de enviarlo. Sin intermediarios.',
  },
  {
    title: 'Importación 100% legal',
    body: 'Toda nuestra mercancía cruza la frontera con documentación completa y pedimento aduanal. Puedes comprar con la seguridad de que no hay problemas de origen.',
  },
  {
    title: 'Empresa mexicana',
    body: 'Somos una empresa mexicana, con atención en español y enfoque total en el mercado nacional. Tu compra tiene respaldo local.',
  },
]

export default function NosotrosPage() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      tl.fromTo(headingRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9 })
        .fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .fromTo(dividerRef.current, { scaleX: 0, transformOrigin: 'center center' }, { scaleX: 1, duration: 0.8 }, '-=0.4')
        .fromTo(
          statsRef.current ? Array.from(statsRef.current.children) : [],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.2)' },
          '-=0.3'
        )
        .fromTo(bodyRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.2')
    })
  }, [])

  return (
    <main className="min-h-screen bg-[#fbf9f8]">

      {/* Hero */}
      <section className="bg-[#00386c] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1a4f8b] opacity-20 skew-x-[-20deg] translate-x-10 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c1ebb5] mb-6">Quiénes somos</span>
          <h1
            ref={headingRef}
            className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter mb-8"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", opacity: 0 }}
          >
            10 años llevando <br className="hidden md:block" /> lo mejor de USA a México
          </h1>
          <p
            ref={subtitleRef}
            className="text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed"
            style={{ opacity: 0 }}
          >
            Somos una empresa mexicana con bodega en McAllen, Texas. Importamos, revisamos y enviamos productos originales directamente a tu puerta.
          </p>
          <div
            ref={dividerRef}
            className="mt-12 h-1 bg-[#43673c] w-24 rounded-full"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 -mt-16 pb-16 relative z-20">
        <div
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-[2.5rem] p-8 shadow-[0_15px_40px_-15px_rgba(0,56,108,0.08)] border border-[#c4c8ce]/20 flex flex-col gap-2"
              style={{ opacity: 0 }}
            >
              <span className="text-4xl font-black text-[#00386c] tracking-tight">{s.value}</span>
              <span className="text-sm font-black text-[#1b1c1c] uppercase tracking-wide">{s.label}</span>
              <span className="text-xs text-[#74787e] leading-relaxed">{s.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Historia + Ventajas */}
      <section
        ref={bodyRef}
        className="max-w-6xl mx-auto px-6 pb-24"
        style={{ opacity: 0 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Historia */}
          <div className="bg-[#f5f3f3] rounded-[3rem] p-10 md:p-14 border border-[#c4c8ce]/20 flex flex-col gap-6">
            <div className="w-16 h-16 rounded-3xl bg-[#00386c]/10 flex items-center justify-center text-[#00386c]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-black text-[#1b1c1c] mb-4 tracking-tight">Nuestra historia</h2>
              <p className="text-[#44494e] leading-relaxed mb-4">
                Empezamos hace más de 10 años vendiendo en eBay y Mercado Libre, cuando el comercio electrónico en México todavía era un terreno sin explorar. Con el tiempo crecimos, abrimos bodega en McAllen, Texas, y nos consolidamos como vendedores activos en Amazon México.
              </p>
              <p className="text-[#44494e] leading-relaxed mb-4">
                Hoy operamos capalsa.com como nuestra tienda propia — un canal directo donde tú compras sin comisiones de marketplace y nosotros podemos atenderte de forma más personal.
              </p>
              <p className="text-[#44494e] leading-relaxed">
                Toda la mercancía cruza la frontera de forma legal, con pedimento aduanal completo. No vendemos imitaciones ni productos de origen dudoso.
              </p>
            </div>
            <div className="pt-4 flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest">
              <Link href="/contacto" className="text-[#00386c] hover:underline underline-offset-4">Contáctanos</Link>
              <span className="text-[#c4c8ce]">•</span>
              <Link href="/envios" className="text-[#00386c] hover:underline underline-offset-4">Ver política de envíos</Link>
            </div>
          </div>

          {/* Ventajas */}
          <div className="flex flex-col gap-6">
            {ventajas.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-[2rem] p-8 shadow-[0_15px_40px_-15px_rgba(0,56,108,0.06)] border border-[#c4c8ce]/20 flex gap-5 items-start group hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-[#00386c]/8 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#43673c]" />
                </div>
                <div>
                  <h3 className="font-black text-[#1b1c1c] mb-1">{v.title}</h3>
                  <p className="text-sm text-[#44494e] leading-relaxed">{v.body}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </main>
  )
}

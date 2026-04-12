'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'

// SVG placeholder para cuando no hay imagen lifestyle
const HeroIllustration = () => (
  <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Fondo sala moderna */}
    <rect width="600" height="500" fill="#1b2b3a"/>
    {/* Pared */}
    <rect x="0" y="0" width="600" height="320" fill="#243344"/>
    {/* Ventana */}
    <rect x="60" y="40" width="120" height="160" rx="4" fill="#3a5a74" opacity="0.6"/>
    <rect x="62" y="42" width="56" height="75" fill="#c8dfe8" opacity="0.3"/>
    <rect x="122" y="42" width="56" height="75" fill="#c8dfe8" opacity="0.2"/>
    <rect x="62" y="122" width="56" height="75" fill="#c8dfe8" opacity="0.25"/>
    <rect x="122" y="122" width="56" height="75" fill="#c8dfe8" opacity="0.15"/>
    {/* Estante */}
    <rect x="0" y="280" width="600" height="10" fill="#1a2e3e"/>
    {/* Cafetera */}
    <rect x="360" y="180" width="80" height="100" rx="8" fill="#e8e0d5"/>
    <rect x="370" y="190" width="60" height="70" rx="4" fill="#d4cdc3"/>
    <rect x="390" y="160" width="20" height="25" rx="3" fill="#c8c0b5"/>
    <circle cx="400" cy="215" r="20" fill="#b8b0a5"/>
    <circle cx="400" cy="215" r="12" fill="#9a928a"/>
    {/* Taza */}
    <rect x="460" y="250" width="50" height="35" rx="6" fill="#f5f0eb"/>
    <path d="M510 260 Q530 260 530 280 Q530 290 510 290" stroke="#e8e0d5" strokeWidth="3" fill="none"/>
    {/* Libros */}
    <rect x="200" y="240" width="18" height="50" rx="2" fill="#4a6741"/>
    <rect x="220" y="245" width="15" height="45" rx="2" fill="#00386c"/>
    <rect x="237" y="242" width="20" height="48" rx="2" fill="#582d00"/>
    {/* Planta */}
    <rect x="80" y="260" width="30" height="30" rx="4" fill="#4a3828"/>
    <ellipse cx="95" cy="240" rx="28" ry="25" fill="#43673c"/>
    <ellipse cx="80" cy="250" rx="18" ry="16" fill="#3a5a34"/>
    <ellipse cx="112" cy="248" rx="16" ry="14" fill="#4d7646"/>
    {/* Piso */}
    <rect x="0" y="320" width="600" height="180" fill="#2a3d50"/>
    {/* Alfombra */}
    <ellipse cx="300" cy="380" rx="220" ry="60" fill="#1e3040" opacity="0.7"/>
    {/* Sillón */}
    <rect x="130" y="305" width="220" height="90" rx="16" fill="#e8e4dc"/>
    <rect x="130" y="295" width="220" height="30" rx="10" fill="#d8d4cc"/>
    <rect x="118" y="310" width="30" height="85" rx="10" fill="#d0ccc4"/>
    <rect x="332" y="310" width="30" height="85" rx="10" fill="#d0ccc4"/>
    {/* Cojines */}
    <rect x="155" y="315" width="60" height="55" rx="8" fill="#00386c" opacity="0.7"/>
    <rect x="255" y="315" width="60" height="55" rx="8" fill="#43673c" opacity="0.6"/>
    {/* Mesa */}
    <rect x="170" y="390" width="140" height="12" rx="4" fill="#8a7565"/>
    <rect x="185" y="400" width="8" height="30" fill="#7a6555"/>
    <rect x="293" y="400" width="8" height="30" fill="#7a6555"/>
  </svg>
)

export default function HeroSection() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('.hero-badge', { autoAlpha: 0, y: 12, duration: 0.45 })
        .from('.hero-word', { autoAlpha: 0, y: 52, stagger: 0.07, duration: 0.7 }, '-=0.2')
        .from('.hero-desc', { autoAlpha: 0, y: 18, duration: 0.5 }, '-=0.35')
        .from('.hero-cta', { autoAlpha: 0, y: 16, stagger: 0.1, duration: 0.4 }, '-=0.25')
        .from('.hero-img', { autoAlpha: 0, x: 40, duration: 0.7, ease: 'power2.out' }, '-=0.6')
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className="relative bg-[#fbf9f8] overflow-hidden"
      style={{ minHeight: '480px' }}
    >
      {/* Subtle background shape */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f0f4f8] hidden lg:block" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[480px]">

        {/* Left: Copy */}
        <div className="flex flex-col justify-center py-16 lg:py-20 pr-0 lg:pr-12 z-10">

          {/* Badge */}
          <span className="hero-badge inline-flex items-center gap-1.5 bg-[#c1ebb5] text-[#0f2b0b] text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full w-fit mb-6">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
            Importaciones USA
          </span>

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.04] tracking-tight text-[#00386c] mb-5"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {'Productos'.split(' ').map((w, i) => (
              <span key={`a${i}`} className="hero-word inline-block mr-[0.15em]">{w}</span>
            ))}
            <br />
            {'originales para tu'.split(' ').map((w, i) => (
              <span key={`b${i}`} className="hero-word inline-block mr-[0.15em]">{w}</span>
            ))}
            <br />
            <span className="hero-word inline-block text-[#582d00]">hogar desde USA.</span>
          </h1>

          {/* Desc */}
          <p className="hero-desc text-[#44494e] text-base lg:text-lg mb-8 max-w-md leading-relaxed">
            Envío garantizado en 7 días hábiles. Facturamos todas tus compras con validez oficial.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/categorias"
              className="hero-cta inline-flex items-center gap-2 bg-[#00386c] hover:bg-[#1a4f8b] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Ver Ofertas del Día
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <Link
              href="/categorias"
              className="hero-cta inline-flex items-center gap-2 border border-[#c4c8ce] text-[#1b1c1c] hover:border-[#00386c] hover:text-[#00386c] font-semibold px-7 py-3.5 rounded-xl text-sm transition-all duration-200 bg-white"
            >
              Explorar Novedades
            </Link>
          </div>
        </div>

        {/* Right: Image — bleed to edge */}
        <div className="hero-img relative hidden lg:block">
          <div className="absolute inset-0 overflow-hidden">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  )
}

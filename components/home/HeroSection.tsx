'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'

const HeroIllustration = () => (
  <svg viewBox="0 0 560 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    {/* Background rings */}
    <circle cx="280" cy="250" r="200" fill="#00386c" fillOpacity="0.05" />
    <circle cx="280" cy="250" r="140" fill="#00386c" fillOpacity="0.04" />

    {/* Package — flat isometric */}
    {/* Top face */}
    <path d="M190 190 L280 145 L370 190 L280 235 Z" fill="#1a4f8b" />
    {/* Left face */}
    <path d="M190 190 L190 315 L280 360 L280 235 Z" fill="#00386c" />
    {/* Right face */}
    <path d="M370 190 L370 315 L280 360 L280 235 Z" fill="#0a2d55" />

    {/* Tape — vertical center stripe */}
    <line x1="280" y1="145" x2="280" y2="360" stroke="#c1ebb5" strokeWidth="16" strokeOpacity="0.18" />
    {/* Tape — horizontal on left face */}
    <line x1="190" y1="272" x2="280" y2="317" stroke="#c1ebb5" strokeWidth="10" strokeOpacity="0.12" />
    {/* Tape — horizontal on right face */}
    <line x1="280" y1="317" x2="370" y2="272" stroke="#c1ebb5" strokeWidth="10" strokeOpacity="0.1" />

    {/* USA origin badge */}
    <circle cx="388" cy="138" r="42" fill="white" fillOpacity="0.96" />
    <circle cx="388" cy="138" r="34" fill="#f0f4f8" />
    <text x="388" y="131" textAnchor="middle" fill="#00386c" fontSize="9" fontWeight="800" letterSpacing="3" fontFamily="'Inter', system-ui, sans-serif">ORIGEN</text>
    <text x="388" y="148" textAnchor="middle" fill="#00386c" fontSize="17" fontWeight="900" letterSpacing="1" fontFamily="'Plus Jakarta Sans', sans-serif">USA</text>
    {/* Verified check */}
    <circle cx="388" cy="163" r="11" fill="#43673c" />
    <path d="M383 163 L387 167 L395 158" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

    {/* Destination pin */}
    <g transform="translate(148, 336)">
      <path d="M22 0C10 0 0 10 0 22 0 38 22 58 22 58 22 58 44 38 44 22 44 10 34 0 22 0Z" fill="#582d00" />
      <circle cx="22" cy="22" r="11" fill="white" />
      <circle cx="22" cy="22" r="5" fill="#582d00" />
    </g>

    {/* Delivery route — dashed arc */}
    <path d="M388 138 C430 210 410 295 192 356" stroke="#00386c" strokeWidth="2" strokeDasharray="11 8" strokeOpacity="0.28" fill="none" />

    {/* Airplane along route */}
    <g transform="translate(358, 232) rotate(132)">
      <path d="M0 0 L15 -5 L17 0 L15 5 Z" fill="#1a4f8b" fillOpacity="0.65" />
      <path d="M4 -5 L11 -13 L15 -9 L8 -1 Z" fill="#1a4f8b" fillOpacity="0.45" />
      <path d="M4 5 L11 13 L15 9 L8 1 Z" fill="#1a4f8b" fillOpacity="0.45" />
    </g>

    {/* "Entrega 7 días" badge */}
    <rect x="84" y="166" width="100" height="30" rx="15" fill="#c1ebb5" fillOpacity="0.82" />
    <text x="134" y="186" textAnchor="middle" fill="#0f2b0b" fontSize="11" fontWeight="700" fontFamily="'Inter', system-ui, sans-serif">Entrega 7 días</text>

    {/* Decorative dots */}
    <circle cx="106" cy="132" r="5" fill="#43673c" fillOpacity="0.2" />
    <circle cx="80" cy="240" r="3" fill="#582d00" fillOpacity="0.25" />
    <circle cx="462" cy="205" r="5" fill="#43673c" fillOpacity="0.2" />
    <circle cx="442" cy="365" r="4" fill="#00386c" fillOpacity="0.18" />
    <circle cx="128" cy="428" r="6" fill="#43673c" fillOpacity="0.12" />
    <circle cx="480" cy="98" r="3" fill="#582d00" fillOpacity="0.2" />
  </svg>
)

export default function HeroSection() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo('.hero-badge', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45 })
        .fromTo('.hero-word', { autoAlpha: 0, y: 52 }, { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.7 }, '-=0.2')
        .fromTo('.hero-desc', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.35')
        .fromTo('.hero-cta', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.4 }, '-=0.25')
        .fromTo('.hero-img', { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power2.out' }, '-=0.6')
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className="relative bg-surface overflow-hidden"
      style={{ minHeight: '480px' }}
    >
      {/* Right panel background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-surface-tinted hidden lg:block" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[480px]">

        {/* Left: Copy */}
        <div className="flex flex-col justify-center py-16 lg:py-20 pr-0 lg:pr-12 z-10">

          {/* Badge */}
          <span className="hero-badge inline-flex items-center gap-1.5 bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full w-fit mb-6">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>
            Importaciones USA
          </span>

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.04] tracking-tight text-primary mb-5"
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
            <span className="hero-word inline-block text-tertiary">hogar desde USA.</span>
          </h1>

          {/* Desc */}
          <p className="hero-desc text-on-surface-variant text-base lg:text-lg mb-8 max-w-md leading-relaxed">
            Envío garantizado en 7 días hábiles. Facturamos todas tus compras con validez oficial.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/categorias"
              className="hero-cta inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary font-bold px-7 py-3.5 rounded-xl text-sm transition-all duration-200 ease-out active:scale-95 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Ver Ofertas del Día
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <Link
              href="/categorias"
              className="hero-cta inline-flex items-center gap-2 border border-outline-variant text-foreground hover:border-primary hover:text-primary font-semibold px-7 py-3.5 rounded-xl text-sm transition-all duration-200 ease-out active:scale-95 bg-surface-lowest"
            >
              Explorar Novedades
            </Link>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="hero-img relative hidden lg:block">
          <div className="absolute inset-0 overflow-hidden">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  )
}

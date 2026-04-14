'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Registrar plugin (seguro en cliente)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ── Icons ──────────────────────────────────────────────────────────────────
const IconTruck = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
    <rect x="9" y="11" width="14" height="10" rx="2"/>
    <circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
  </svg>
)
const IconClock = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconRoute = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7H5.5a3.5 3.5 0 0 1 0-7H15"/>
    <circle cx="18" cy="5" r="3"/>
  </svg>
)
const IconShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconMapPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

// ── Data ───────────────────────────────────────────────────────────────────
const TIEMPOS = [
  { zona: 'México — Ciudades Principales', tiempo: '7–10 Días Hábiles', destaca: true },
  { zona: 'Zonas Extendidas y Rurales', tiempo: '12–15 Días Hábiles', destaca: false },
]

const PASOS = [
  { n: 1, titulo: 'Confirmación de Orden', desc: 'Validamos tu pedido e iniciamos el proceso de adquisición en USA.' },
  { n: 2, titulo: 'Logística Transfronteriza', desc: 'El producto llega a nuestro centro de consolidación en Texas para su cruce oficial.' },
  { n: 3, titulo: 'Importación y Aduana', desc: 'Tramitamos el pedimento de importación para garantizar la legalidad total.' },
  { n: 4, titulo: 'Última Milla', desc: 'Entregamos a paquetería nacional y te enviamos tu número de rastreo.' },
]

const CARDS = [
  { icon: <IconTruck />, titulo: 'Logística Premium', texto: 'Envío sin costo adicional a las principales ciudades de México.' },
  { icon: <IconClock />, titulo: 'Tiempos Transparentes', texto: 'Compromiso de entrega entre 7 y 10 días hábiles garantizados.' },
  { icon: <IconRoute />, titulo: 'Rastreo en Tiempo Real', texto: 'Monitorea cada etapa desde el origen hasta la puerta de tu hogar.' },
  { icon: <IconShield />, titulo: 'Seguridad Aduanal', texto: 'Documentación oficial completa para tu total tranquilidad.' },
]

// ── Component ──────────────────────────────────────────────────────────────
export default function EnviosPage() {
  const heroRef   = useRef<HTMLDivElement>(null)
  const cardsRef  = useRef<HTMLDivElement>(null)
  const tiempoRef = useRef<HTMLDivElement>(null)
  const pasosRef  = useRef<HTMLDivElement>(null)
  const noteRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero (Entrada inmediata con fromTo)
      gsap.fromTo(heroRef.current!.querySelectorAll('.anim-hero > *'), 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power4.out' }
      )
      
      // Cards (ScrollTrigger con fromTo)
      gsap.fromTo(cardsRef.current!.querySelectorAll('.anim-card'), 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'back.out(1.4)',
          scrollTrigger: { 
            trigger: cardsRef.current, 
            start: 'top 90%',
            toggleActions: 'play none none none' 
          }
        }
      )
      
      // Filas de Tiempos
      if (tiempoRef.current) {
        gsap.fromTo(tiempoRef.current.querySelectorAll('.anim-row'), 
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { 
              trigger: tiempoRef.current, 
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        )
      }
      
      // Pasos
      if (pasosRef.current) {
        gsap.fromTo(pasosRef.current.querySelectorAll('.anim-step'), 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { 
              trigger: pasosRef.current, 
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        )
      }

      // Refrescar para asegurar cálculos correctos
      ScrollTrigger.refresh()
    })

    return () => ctx.revert()
  }, [])


  return (
    <main className="bg-[#fbf9f8] min-h-screen">
      
      {/* Editorial Hero Section */}
      <section className="bg-white border-b border-[#c4c8ce]/20">
        <div className="max-w-[1400px] mx-auto px-6 py-20 md:py-32" ref={heroRef}>
          <div className="anim-hero max-w-4xl">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#00386c] mb-6 block">Políticas de Entrega</span>
            <h1 
                className="text-5xl md:text-7xl font-black text-[#1b1c1c] leading-[1.05] tracking-tighter mb-10"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
                Tus productos, <br /> de USA a tu hogar
            </h1>
            <p className="text-[#44494e] text-lg md:text-xl leading-relaxed max-w-2xl">
                Gestionamos cada detalle de la logística internacional para que tú solo te preocupes por disfrutar tu compra. Sin cargos sorpresa ni trámites complejos.
            </p>
            <div className="h-1.5 w-24 bg-[#43673c] rounded-full mt-12" />
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {CARDS.map((c, i) => (
            <div key={i} className="anim-card group bg-white rounded-[2.5rem] p-8 md:p-10 border border-[#c4c8ce]/20 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:shadow-xl transition-all duration-500">
              <span className="w-14 h-14 rounded-2xl bg-[#00386c]/5 flex items-center justify-center text-[#00386c] mb-8 group-hover:scale-110 transition-transform duration-500">
                {c.icon}
              </span>
              <h3 className="text-lg font-black text-[#1b1c1c] mb-3 tracking-tight">{c.titulo}</h3>
              <p className="text-sm text-[#74787e] leading-relaxed">{c.texto}</p>
            </div>
          ))}
        </div>

        {/* Detailed Times & Coverage */}
        <div className="flex flex-col lg:flex-row gap-20 items-start mb-32">
            <div className="lg:w-1/2 space-y-8" ref={tiempoRef}>
                <h2 
                    className="text-3xl md:text-4xl font-black text-[#1b1c1c] tracking-tight"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    Tiempos y Cobertura
                </h2>
                <div className="space-y-4">
                    {TIEMPOS.map((t, i) => (
                        <div
                            key={i}
                            className={`anim-row flex items-center justify-between p-6 rounded-[2rem] border transition-all ${t.destaca ? 'bg-[#00386c] text-white border-transparent shadow-lg' : 'bg-white text-[#1b1c1c] border-[#c4c8ce]/20'}`}
                        >
                            <div className="flex items-center gap-4">
                                <span className={`w-10 h-10 rounded-full flex items-center justify-center ${t.destaca ? 'bg-white/10' : 'bg-[#f5f3f3] text-[#00386c]'}`}>
                                    <IconMapPin />
                                </span>
                                <span className="font-bold text-sm md:text-base">{t.zona}</span>
                            </div>
                            <span className={`text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full ${t.destaca ? 'bg-[#c1ebb5] text-[#43673c]' : 'bg-[#f5f3f3] text-[#44494e]'}`}>
                                {t.tiempo}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="p-6 bg-[#f5f3f3] rounded-3xl border border-dashed border-[#c4c8ce] text-xs font-medium text-[#74787e] leading-relaxed">
                    <strong className="text-[#00386c] block mb-1 uppercase tracking-wider">Nota Importante:</strong>
                    Toda orden realizada después de las 2:00 PM (CDMX) se procesará el siguiente día hábil. Los tiempos de entrega estiman el trayecto completo desde almacén USA hasta destino final.
                </div>
            </div>

            {/* Proceso Step by Step */}
            <div className="lg:w-1/2 space-y-12" ref={pasosRef}>
                <h2 
                    className="text-3xl md:text-4xl font-black text-[#1b1c1c] tracking-tight"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    El Flujo Editorial
                </h2>
                <div className="relative pl-8">
                    {/* Progress line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#c4c8ce]/20 rounded-full" />
                    
                    <div className="space-y-12">
                        {PASOS.map((p, i) => (
                            <div key={i} className="anim-step relative">
                                <span className="absolute -left-10 top-0 w-4 h-4 rounded-full bg-[#43673c] border-4 border-white shadow-sm" />
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-[#43673c] uppercase tracking-[0.3em]">Fase {p.n}</span>
                                    <h4 className="text-xl font-black text-[#1b1c1c] tracking-tight">{p.titulo}</h4>
                                    <p className="text-sm text-[#44494e] leading-relaxed max-w-md">{p.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Global Protection Banner */}
        <div ref={noteRef} className="bg-[#1b1c1c] rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row gap-12 items-center relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00386c] rounded-full blur-[80px] opacity-20 -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#43673c] rounded-full blur-[80px] opacity-20 -ml-20 -mb-20" />

            <div className="flex-shrink-0 w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#c1ebb5]">
                <IconShield />
            </div>
            <div className="flex-1 text-center md:text-left relative z-10">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-4">Compromiso Total de Seguridad</h3>
                <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-3xl">
                    Cada paquete es inspeccionado físicamente por nuestro equipo antes de ser confiado a la mensajería nacional. Si el producto sufre algún daño en el trayecto desde USA, nosotros nos encargamos completamente del reemplazo.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-6 items-center">
                    <Link href="/contacto" className="h-14 px-10 rounded-full bg-[#00386c] text-white font-black text-xs uppercase tracking-widest hover:bg-[#1a4f8b] transition-all flex items-center justify-center">
                        Contactar Soporte
                    </Link>
                    <div className="flex items-center gap-2 text-[#c1ebb5] text-xs font-bold uppercase tracking-widest">
                        <IconCheck /> Seguro de envío incluido
                    </div>
                </div>
            </div>
        </div>

      </section>
    </main>
  )
}

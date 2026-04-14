'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Registrar el plugin una sola vez fuera del componente (seguro en cliente)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ── Icons ──────────────────────────────────────────────────────────────────
const IconCheck = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)
const IconClock = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconMail = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const IconXCircle = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
)
const IconBullet = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconX = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

// ── Data ───────────────────────────────────────────────────────────────────
const APLICA = [
  'El producto llegó físicamente dañado o con defectos de fábrica.',
  'El artículo recibido no coincide con las especificaciones técnicas ordenadas.',
  'Incumplimiento del plazo máximo de entrega (más de 20 días hábiles).',
]

const NO_APLICA = [
  'Cambio de opinión o arrepentimiento de compra una vez recibido el producto correcto.',
  'Uso negligente, instalación incorrecta o daños causados por el cliente.',
  'Inconformidad con el empaque si el contenido se encuentra en perfecto estado.',
]

const PASOS = [
  {
    n: 1,
    titulo: 'Notificación inmediata',
    desc: <>Contacta con <a href="mailto:contacto@capalsa.com" className="text-[#00386c] font-bold hover:underline">contacto@capalsa.com</a> adjuntando tu número de orden y evidencia relevante.</>,
  },
  {
    n: 2,
    titulo: 'Evaluación Técnica',
    desc: 'Nuestro equipo de control de calidad revisará tu caso en un máximo de 48 horas hábiles.',
  },
  {
    n: 3,
    titulo: 'Resolución de Garantía',
    desc: 'Coordinamos la reposición sin costo o el reembolso total según el dictamen técnico.',
  },
]

const CARDS = [
  { icon: <IconCheck />,   titulo: 'Garantía Total',    texto: 'Protección contra defectos, daños de transporte o errores de envío.' },
  { icon: <IconClock />,   titulo: 'Periodo Crítico',   texto: 'Dispones de 7 días naturales tras la recepción para reportar incidencias.' },
  { icon: <IconMail />,    titulo: 'Gestión Digital',  texto: 'Inicia el proceso enviando evidencia fotográfica a nuestro correo.' },
  { icon: <IconXCircle />, titulo: 'Exclusiones',      texto: 'No aplica por arrepentimiento si el producto es correcto y funcional.' },
]

// ── Component ──────────────────────────────────────────────────────────────
export default function DevolucionesPage() {
  const heroRef    = useRef<HTMLDivElement>(null)
  const cardsRef   = useRef<HTMLDivElement>(null)
  const aplicaRef  = useRef<HTMLDivElement>(null)
  const pasosRef   = useRef<HTMLDivElement>(null)
  const noRef      = useRef<HTMLDivElement>(null)
  const noteRef    = useRef<HTMLDivElement>(null)

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
      
      // Filas Protocolo (Izquierda)
      if (aplicaRef.current) {
        gsap.fromTo(aplicaRef.current.querySelectorAll('.anim-row'), 
          { x: -25, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { 
              trigger: aplicaRef.current, 
              start: 'top 90%',
              toggleActions: 'play none none none'
            }
          }
        )
      }

      // Filas Exclusiones (Derecha - Faltaba antes)
      if (noRef.current) {
        gsap.fromTo(noRef.current.querySelectorAll('.anim-row'), 
          { x: 25, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { 
              trigger: noRef.current, 
              start: 'top 90%',
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
              start: 'top 90%',
              toggleActions: 'play none none none'
            }
          }
        )
      }

      // IMPORTANTE: Refrescar ScrollTrigger para recalcular posiciones tras la hidratación
      ScrollTrigger.refresh()
    })

    return () => ctx.revert()
  }, [])

  return (
    <main className="bg-[#fbf9f8] min-h-screen">
      
      {/* Editorial Header */}
      <section className="bg-white border-b border-[#c4c8ce]/20">
        <div className="max-w-[1400px] mx-auto px-6 py-20 md:py-32" ref={heroRef}>
          <div className="anim-hero max-w-4xl">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#582d00] mb-6 block">Políticas de Garantía</span>
            <h1 
                className="text-5xl md:text-7xl font-black text-[#1b1c1c] leading-[1.05] tracking-tighter mb-10"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
                Tu confianza es <br /> nuestra garantía
            </h1>
            <p className="text-[#44494e] text-lg md:text-xl leading-relaxed max-w-2xl">
                Operamos bajo estándares de satisfacción total. Si tu experiencia no cumple con lo prometido, tenemos protocolos claros para solucionarlo rápidamente.
            </p>
            <div className="h-1.5 w-24 bg-[#00386c] rounded-full mt-12" />
          </div>
        </div>
      </section>

      {/* Feature Summary Grid */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {CARDS.map((c, i) => (
            <div key={i} className="anim-card group bg-white rounded-[2.5rem] p-8 md:p-10 border border-[#c4c8ce]/20 shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-500">
              <span className="w-14 h-14 rounded-2xl bg-[#582d00]/5 flex items-center justify-center text-[#582d00] mb-8 group-hover:scale-110 transition-transform duration-500">
                {c.icon}
              </span>
              <h3 className="text-lg font-black text-[#1b1c1c] mb-3 tracking-tight">{c.titulo}</h3>
              <p className="text-sm text-[#74787e] leading-relaxed">{c.texto}</p>
            </div>
          ))}
        </div>

        {/* Applied Policies - Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32">
            
            {/* When it applies */}
            <div className="space-y-10" ref={aplicaRef}>
                <div>
                    <h2 
                        className="text-3xl font-black text-[#1b1c1c] mb-4"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        Protocolo de Validación
                    </h2>
                    <p className="text-sm text-[#74787e]">Casos donde Capalsa Store asume la resolución total.</p>
                </div>
                
                <div className="bg-white rounded-[3rem] overflow-hidden border border-[#c4c8ce]/20 shadow-sm">
                    {APLICA.map((item, i) => (
                        <div key={i} className="anim-row flex items-start gap-5 p-8 border-b border-[#c4c8ce]/10 last:border-0 hover:bg-[#c1ebb5]/5 transition-colors">
                            <span className="w-8 h-8 rounded-full bg-[#c1ebb5]/30 text-[#43673c] flex items-center justify-center flex-shrink-0">
                                <IconBullet />
                            </span>
                            <span className="text-sm md:text-base font-bold text-[#1b1c1c] leading-relaxed">{item}</span>
                        </div>
                    ))}
                    <div className="p-8 bg-[#f5f3f3]/50 text-xs font-medium text-[#74787e] border-t border-[#c4c8ce]/20 italic">
                        Nota: Es indispensable reportar dentro de los primeros 7 días naturales posteriores a la entrega.
                    </div>
                </div>
            </div>

            {/* When it DOESN'T apply */}
            <div className="space-y-10" ref={noRef}>
                <div>
                    <h2 
                        className="text-3xl font-black text-[#1b1c1c] mb-4"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        Exclusiones de Garantía
                    </h2>
                    <p className="text-sm text-[#74787e]">Condiciones que invalidan el proceso de devolución.</p>
                </div>

                <div className="bg-[#f5f3f3] rounded-[3rem] overflow-hidden border border-[#c4c8ce]/20 shadow-sm">
                    {NO_APLICA.map((item, i) => (
                        <div key={i} className="anim-row flex items-start gap-5 p-8 border-b border-[#c4c8ce]/10 last:border-0">
                            <span className="w-8 h-8 rounded-full bg-white text-[#74787e] flex items-center justify-center flex-shrink-0">
                                <IconX />
                            </span>
                            <span className="text-sm md:text-base font-medium text-[#44494e]">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Process Roadmap */}
        <section className="bg-white rounded-[4rem] p-10 md:p-20 border border-[#c4c8ce]/20 mb-20">
            <div className="text-center max-w-2xl mx-auto mb-20">
                <h2 
                    className="text-3xl md:text-5xl font-black text-[#1b1c1c] mb-6 tracking-tighter"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    Nuestra Ruta de Solución
                </h2>
                <p className="text-sm text-[#74787e]">Simplicidad y rapidez en cada etapa del proceso.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative" ref={pasosRef}>
                {/* Visual Connector - Desktop only */}
                <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px bg-[#c4c8ce]/30" />
                
                {PASOS.map((p, i) => (
                    <div key={i} className="anim-step flex flex-col items-center text-center group relative z-10">
                        <div className="w-14 h-14 rounded-full bg-[#1b1c1c] text-white font-black text-xl flex items-center justify-center mb-8 border-8 border-white group-hover:bg-[#00386c] transition-colors duration-500">
                            {p.n}
                        </div>
                        <h4 className="text-xl font-black text-[#1b1c1c] mb-4 tracking-tight">{p.titulo}</h4>
                        <p className="text-sm text-[#44494e] leading-relaxed max-w-xs">{p.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Global Assistance Call Center */}
        <div ref={noteRef} className="bg-[#00386c] rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row gap-12 items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-20 -mt-20" />
            
            <div className="flex-shrink-0 w-20 h-20 rounded-3xl bg-white flex items-center justify-center text-[#00386c] shadow-lg">
                <IconMail />
            </div>
            
            <div className="flex-1 text-center md:text-left text-white">
                <h3 className="text-2xl font-black mb-3">¿Necesitas iniciar una reclamación?</h3>
                <p className="text-white/70 text-base md:text-lg mb-8 max-w-2xl leading-relaxed">
                    Estamos listos para escucharte. Envía los detalles de tu caso y nuestro equipo editorial te contactará con una solución personalizada.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <a href="mailto:contacto@capalsa.com" className="h-14 px-10 rounded-full bg-white text-[#00386c] font-black text-xs uppercase tracking-widest hover:bg-[#c1ebb5] hover:text-[#43673c] transition-all flex items-center justify-center">
                        Enviar Correo de Garantía
                    </a>
                    <Link href="/contacto" className="h-14 px-10 rounded-full border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center">
                        Otras Formas de Contacto
                    </Link>
                </div>
            </div>
        </div>

      </section>
    </main>
  )
}

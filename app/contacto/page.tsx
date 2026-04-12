'use client'

import type { Metadata } from 'next'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

// SVG Icons — Rediseñados para la nueva estética
const IconMail = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const IconPhone = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.18 6.18l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

const IconClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

const IconReceipt = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)

const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

const contacts = [
  {
    icon: <IconMail />,
    label: 'Correo electrónico',
    detail: 'Para pedidos, dudas y facturación',
    value: 'contacto@capalsa.com',
    href: 'mailto:contacto@capalsa.com',
    isExternal: false,
    color: '#00386c'
  },
  {
    icon: <IconPhone />,
    label: 'WhatsApp Business',
    detail: 'Atención personalizada inmediata',
    value: '+52 777 408 7291',
    href: 'https://wa.me/527774087291',
    isExternal: true,
    color: '#25D366'
  },
  {
    icon: <IconClock />,
    label: 'Disponibilidad',
    detail: 'Lunes a viernes laborables',
    value: '9:00 AM – 6:00 PM (CDMX)',
    href: null,
    isExternal: false,
    color: '#00386c'
  },
  {
    icon: <IconReceipt />,
    label: 'Facturación CFDI',
    detail: 'Personas físicas y morales',
    value: 'Disponible al confirmar pedido',
    href: null,
    isExternal: false,
    color: '#582d00'
  },
]

export default function ContactoPage() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const noteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.9 }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.5'
        )
        .fromTo(
          dividerRef.current,
          { scaleX: 0, transformOrigin: 'center center' },
          { scaleX: 1, duration: 0.8 },
          '-=0.4'
        )
        .fromTo(
          cardsRef.current ? Array.from(cardsRef.current.children) : [],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.2)' },
          '-=0.3'
        )
        .fromTo(
          noteRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.6 },
          '-=0.2'
        )
    })
  }, [])

  return (
    <main className="min-h-screen bg-[#fbf9f8]">
      {/* Editorial Header Section */}
      <section className="bg-[#00386c] text-white overflow-hidden relative">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1a4f8b] opacity-20 skew-x-[-20deg] translate-x-10 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c1ebb5] mb-6">Canales Directos</span>
          <h1
            ref={headingRef}
            className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter mb-8"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", opacity: 0 }}
          >
            Estamos aquí para <br className="hidden md:block" /> resolver tus dudas
          </h1>
          <p
            ref={subtitleRef}
            className="text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed"
            style={{ opacity: 0 }}
          >
            Nuestra prioridad es tu tranquilidad. Ya sea sobre un pedido actual o una consulta de producto, nuestro equipo editorial está listo para atenderte.
          </p>
          <div
            ref={dividerRef}
            className="mt-12 h-1 bg-[#43673c] w-24 rounded-full"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </section>

      {/* Grid of Contact Methods */}
      <section className="max-w-6xl mx-auto px-6 -mt-16 pb-20 relative z-20">
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {contacts.map((c, i) => (
            <div
              key={i}
              className="group bg-white rounded-[2.5rem] p-8 md:p-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center shadow-[0_15px_40px_-15px_rgba(0,56,108,0.08)] border border-[#c4c8ce]/20 hover:-translate-y-2 hover:shadow-xl transition-all duration-500"
              style={{ opacity: 0 }}
            >
              {/* Specialized Icon Holder */}
              <div 
                className="flex-shrink-0 w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500"
                style={{ backgroundColor: `${c.color}10`, color: c.color }}
              >
                {c.icon}
              </div>

              {/* Textual Content */}
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-[10px] font-black text-[#74787e] uppercase tracking-[0.2em]">
                  {c.label}
                </span>
                <span className="text-xs text-[#44494e] font-medium mb-1">{c.detail}</span>
                {c.href ? (
                  <a
                    href={c.href}
                    target={c.isExternal ? '_blank' : undefined}
                    rel={c.isExternal ? 'noopener noreferrer' : undefined}
                    className="group/link inline-flex items-center gap-2"
                  >
                    <span className="text-xl md:text-2xl font-black text-[#1b1c1c] tracking-tight group-hover/link:text-[#00386c] transition-colors decoration-[#00386c] underline decoration-2 underline-offset-8">
                      {c.value}
                    </span>
                    <span className="text-[#00386c] rotate-[-45deg] group-hover/link:rotate-0 transition-transform duration-300">
                      <IconArrow />
                    </span>
                  </a>
                ) : (
                  <span className="text-xl md:text-2xl font-black text-[#1b1c1c] tracking-tight">{c.value}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Global Assistance Note & Contact Form */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          
          {/* Info Card */}
          <div
            ref={noteRef}
            className="bg-[#f5f3f3] rounded-[3rem] p-10 md:p-14 border border-[#c4c8ce]/20 flex flex-col gap-8 h-full"
            style={{ opacity: 0 }}
          >
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#582d00] shadow-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl font-black text-[#1b1c1c] mb-4">Compromiso de Respuesta</h3>
              <p className="text-[#44494e] text-base leading-relaxed mb-8">
                Sabemos que esperar no es lo tuyo. Por eso, nos comprometemos a darte una respuesta clara y concisa en menos de 24 horas hábiles. 
                <span className="font-bold text-[#00386c]"> Por favor, incluye tu número de orden</span> para agilizar cualquier reclamo o seguimiento de envío.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-[#44494e]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#43673c]" />
                  <span>Atención 100% personalizada por expertos.</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#44494e]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#43673c]" />
                  <span>Seguimiento de garantías directo con fabricantes.</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#44494e]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#43673c]" />
                  <span>Facturación inmediata al confirmar tu compra.</span>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest">
                  <Link href="/envios" className="text-[#00386c] hover:underline underline-offset-4">Políticas de Envío</Link>
                  <span className="text-[#c4c8ce]">•</span>
                  <Link href="/devoluciones" className="text-[#00386c] hover:underline underline-offset-4">Protocolo de Devolución</Link>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div 
            className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_30px_60px_-15px_rgba(0,56,108,0.1)] border border-[#c4c8ce]/10 relative overflow-hidden"
          >
            <h3 className="text-2xl font-black text-[#1b1c1c] mb-8">Envíanos un mensaje</h3>
            
            <form 
              className="space-y-6"
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement
                const formData = new FormData(form)
                const data = Object.fromEntries(formData.entries())
                
                btn.disabled = true
                const originalText = btn.innerHTML
                btn.innerHTML = 'Enviando...'

                try {
                  const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                  })
                  const result = await res.json()
                  if (result.success) {
                    // Mostrar éxito en el botón o UI
                    btn.innerHTML = '¡MENSAJE ENVIADO!'
                    btn.style.backgroundColor = '#43673c'
                    form.reset()
                    setTimeout(() => {
                      btn.disabled = false
                      btn.innerHTML = originalText
                      btn.style.backgroundColor = ''
                    }, 5000)
                  } else {
                    alert(result.error || 'Hubo un error.')
                    btn.disabled = false
                    btn.innerHTML = originalText
                  }
                } catch (err) {
                  alert('Error de conexión. Intenta de nuevo.')
                  btn.disabled = false
                  btn.innerHTML = originalText
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#74787e] uppercase tracking-[0.2em] ml-2">Nombre Completo</label>
                  <input 
                    name="nombre"
                    required
                    type="text" 
                    placeholder="Arturo Carrillo"
                    className="w-full bg-[#fbf9f8] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#00386c]/20 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#74787e] uppercase tracking-[0.2em] ml-2">Email</label>
                  <input 
                    name="email"
                    required
                    type="email" 
                    placeholder="ejemplo@correo.com"
                    className="w-full bg-[#fbf9f8] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#00386c]/20 transition-all outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#74787e] uppercase tracking-[0.2em] ml-2">Asunto</label>
                <select 
                  name="asunto"
                  required
                  className="w-full bg-[#fbf9f8] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#00386c]/20 transition-all outline-none appearance-none"
                >
                  <option value="Duda sobre Producto">Duda sobre Producto</option>
                  <option value="Estado de mi Pedido">Estado de mi Pedido</option>
                  <option value="Facturación">Facturación</option>
                  <option value="Garantía / Devolución">Garantía / Devolución</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#74787e] uppercase tracking-[0.2em] ml-2">Mensaje</label>
                <textarea 
                  name="mensaje"
                  required
                  rows={4}
                  placeholder="¿En qué podemos ayudarte?"
                  className="w-full bg-[#fbf9f8] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#00386c]/20 transition-all outline-none resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#00386c] text-white font-black py-5 rounded-2xl shadow-lg shadow-[#00386c]/20 hover:bg-[#1a4f8b] hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                ENVIAR MENSAJE
                <span className="group-hover:translate-x-2 transition-transform duration-300">
                  <IconArrow />
                </span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

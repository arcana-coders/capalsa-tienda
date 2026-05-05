'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const SECCIONES = [
  {
    titulo: '1. Responsable del tratamiento',
    texto: 'Capalsa Store, con domicilio en México y correo electrónico de contacto contacto@capalsa.com, es responsable del uso y protección de sus datos personales, en los términos que establece la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).',
  },
  {
    titulo: '2. Datos personales que recabamos',
    texto: 'Para llevar a cabo las finalidades descritas en este aviso, recabamos los siguientes datos personales: nombre completo, dirección de entrega, correo electrónico, número de teléfono y, cuando aplica, datos de facturación (RFC y razón social). No recabamos datos sensibles.',
  },
  {
    titulo: '3. Finalidades del tratamiento',
    texto: 'Los datos recabados se utilizan para: (a) procesar y entregar sus pedidos; (b) enviar confirmaciones de compra y actualizaciones de seguimiento; (c) responder a solicitudes de contacto, devoluciones y garantías; (d) enviar comunicaciones de la tienda si usted se suscribió a nuestro boletín (puede cancelarla en cualquier momento). No utilizamos sus datos para finalidades distintas a las indicadas sin su consentimiento.',
  },
  {
    titulo: '4. Transferencias de datos',
    texto: 'Sus datos personales no son vendidos ni cedidos a terceros con fines comerciales. Pueden compartirse únicamente con proveedores de servicios de pago (PayPal), envío y correo transaccional (Resend) estrictamente necesarios para completar su pedido, quienes están obligados a mantener la confidencialidad de la información.',
  },
  {
    titulo: '5. Derechos ARCO',
    texto: 'Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse (ARCO) al tratamiento de sus datos personales. Para ejercerlos, envíe su solicitud a contacto@capalsa.com indicando su nombre completo, número de orden y el derecho que desea ejercer. Le daremos respuesta en un plazo máximo de 20 días hábiles.',
  },
  {
    titulo: '6. Cookies y tecnologías de rastreo',
    texto: 'Este sitio puede utilizar cookies de sesión y tecnologías similares para mejorar la experiencia de navegación. No se utilizan cookies de terceros con fines publicitarios. Puede deshabilitar las cookies desde la configuración de su navegador, aunque esto puede afectar el funcionamiento del carrito de compras.',
  },
  {
    titulo: '7. Cambios al aviso de privacidad',
    texto: 'Capalsa Store se reserva el derecho de actualizar este aviso en cualquier momento. Cualquier modificación será publicada en esta página con la fecha de la última actualización. El uso continuado del sitio después de la publicación de cambios implica su aceptación.',
  },
]

export default function AvisoDePrivacidadPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const seccionesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current!.querySelectorAll('.anim-hero > *'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power4.out' }
      )

      gsap.fromTo(
        seccionesRef.current!.querySelectorAll('.anim-seccion'),
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: seccionesRef.current, start: 'top 90%', toggleActions: 'play none none none' },
        }
      )

      ScrollTrigger.refresh()
    })

    return () => ctx.revert()
  }, [])

  return (
    <main className="bg-[#fbf9f8] min-h-screen">

      {/* Hero */}
      <section className="bg-white border-b border-[#c4c8ce]/20">
        <div className="max-w-[1400px] mx-auto px-6 py-20 md:py-32" ref={heroRef}>
          <div className="anim-hero max-w-4xl">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#582d00] mb-6 block">
              Privacidad y datos
            </span>
            <h1
              className="text-5xl md:text-7xl font-black text-[#1b1c1c] leading-[1.05] tracking-tighter mb-10"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Aviso de <br /> Privacidad
            </h1>
            <p className="text-[#44494e] text-lg md:text-xl leading-relaxed max-w-2xl">
              En Capalsa Store, su privacidad es una prioridad. Este aviso describe cómo
              recopilamos, usamos y protegemos sus datos personales conforme a la{' '}
              <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares</strong>.
            </p>
            <div className="h-1.5 w-24 bg-[#C4813A] rounded-full mt-12" />
            <p className="text-xs text-[#74787e] mt-6">Última actualización: mayo 2026</p>
          </div>
        </div>
      </section>

      {/* Secciones */}
      <section className="max-w-[900px] mx-auto px-6 py-20">
        <div ref={seccionesRef} className="space-y-6">
          {SECCIONES.map((s, i) => (
            <div key={i} className="anim-seccion bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#c4c8ce]/20 shadow-sm">
              <h2
                className="text-xl font-black text-[#1b1c1c] mb-4"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {s.titulo}
              </h2>
              <p className="text-[#44494e] leading-relaxed text-base">{s.texto}</p>
            </div>
          ))}
        </div>

        {/* CTA de contacto */}
        <div className="mt-12 bg-[#1A1A1A] rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1 text-center md:text-left text-white">
            <h3 className="text-2xl font-black mb-3">¿Tienes preguntas sobre tu privacidad?</h3>
            <p className="text-white/70 text-base mb-8 max-w-xl leading-relaxed">
              Escríbenos a contacto@capalsa.com y atenderemos tu solicitud en un máximo de 20 días hábiles.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <a
                href="mailto:contacto@capalsa.com"
                className="h-14 px-10 rounded-full bg-[#C4813A] text-white font-black text-xs uppercase tracking-widest hover:bg-[#A36A28] transition-all flex items-center justify-center"
              >
                Enviar correo
              </a>
              <Link
                href="/contacto"
                className="h-14 px-10 rounded-full border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center"
              >
                Formulario de contacto
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

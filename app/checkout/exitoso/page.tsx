'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order') || 'CP-PREVIEW'

  return (
    <main className="min-h-screen bg-[#fbf9f8] flex items-center justify-center p-6 py-20">
      <div className="success-card max-w-2xl w-full bg-white rounded-[3rem] p-10 md:p-16 shadow-[0_30px_100px_-20px_rgba(0,56,108,0.12)] border border-[#c4c8ce]/20 text-center relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#c1ebb5]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#00386c]/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Animated Icon */}
          <div className="success-icon w-24 h-24 bg-[#c1ebb5]/30 text-[#43673c] rounded-full flex items-center justify-center mx-auto mb-10 border-4 border-white shadow-sm">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="success-text text-4xl md:text-5xl font-black text-[#1b1c1c] tracking-tighter mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            ¡Gracias por tu compra!
          </h1>
          
          <p className="success-text text-[#44494e] text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Tu pedido ha sido procesado con éxito. Pronto recibirás un correo electrónico con los detalles del envío.
          </p>

          <div className="success-text bg-[#f5f3f3] rounded-2xl p-6 mb-12 border border-[#c4c8ce]/20 inline-block px-10">
            <span className="block text-[10px] font-black text-[#74787e] uppercase tracking-[0.25em] mb-2">Número de Pedido</span>
            <span className="text-2xl font-black text-[#00386c] tracking-tight">{orderNumber}</span>
          </div>

          <div className="success-text grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/" 
              className="bg-[#00386c] text-white px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#1a4f8b] transition-all shadow-lg hover:shadow-[#00386c]/20"
            >
              Volver al Inicio
            </Link>
            <Link 
              href="/categorias" 
              className="bg-white text-[#1b1c1c] border-2 border-[#c4c8ce]/30 px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-[#00386c] transition-all"
            >
              Seguir Comprando
            </Link>
          </div>

          <p className="success-text mt-12 text-[11px] font-bold text-[#74787e] leading-tight max-w-xs mx-auto">
            Si tienes alguna duda sobre tu pedido, contáctanos a <span className="text-[#00386c]">soporte@capalsa.com.mx</span> mencionando tu número de pedido.
          </p>
        </div>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fbf9f8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00386c]"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}

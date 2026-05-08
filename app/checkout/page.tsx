'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import OrderSummary from '@/components/checkout/OrderSummary'

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore() as any
  const router = useRouter()
  const [isHydrated, setIsHydrated] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('paypal')
  const [formData, setFormData] = useState({
    email: '',
    telefono: '',
    nombre: '',
    cp: '',
    estado: '',
    ciudad: '',
    calle: '',
    numExt: '',
    numInt: '',
    colonia: '',
    referencias: ''
  })

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) return (
    <main className="min-h-screen bg-surface flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" aria-label="Cargando" />
    </main>
  )

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-surface-low rounded-full flex items-center justify-center text-4xl mb-8" aria-hidden="true">🛒</div>
        <h1 className="text-3xl font-black text-foreground mb-4 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Tu carrito está vacío
        </h1>
        <p className="text-on-surface-variant mb-10 max-w-sm">
          Parece que aún no has seleccionado ningún producto. Explora nuestro catálogo y encuentra algo increíble.
        </p>
        <Link
          href="/categorias"
          className="bg-primary text-on-primary px-10 py-4 rounded-2xl font-black text-sm hover:shadow-xl transition-all hover:-translate-y-1"
        >
          Ir al Catálogo
        </Link>
      </main>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Próximamente: Procesando pago con ${paymentMethod}\n\nDatos de envío: ${formData.calle}, ${formData.colonia}`)
  }

  return (
    <main className="min-h-screen bg-surface pb-24">
      {/* Header */}
      <section className="bg-primary text-on-primary pt-16 pb-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-container opacity-10 skew-x-[-20deg] translate-x-20" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center md:text-left">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-secondary-container mb-8 hover:opacity-80 transition-opacity">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
            Volver a la tienda
          </Link>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Finalizar Compra
          </h1>
          <p className="mt-4 text-on-primary/60 text-lg max-w-xl">
            Estás a un paso de recibir tus productos. Completa tus datos de envío para continuar.
          </p>
        </div>
      </section>

      {/* Grid de Checkout */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Columna Izquierda: Formulario */}
          <div className="lg:col-span-7 bg-surface-lowest rounded-[2.5rem] p-8 md:p-12 shadow-[0_15px_40px_-15px_rgba(0,56,108,0.06)] border border-outline-variant/20">
            <CheckoutForm formData={formData} setFormData={setFormData} />
          </div>

          {/* Columna Derecha: Resumen */}
          <div className="lg:col-span-5">
            <OrderSummary
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              clienteData={formData}
            />

            {paymentMethod !== 'paypal' && (
              <button
                type="submit"
                className="w-full mt-6 py-5 bg-tertiary hover:bg-tertiary-container text-on-tertiary rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <span>Confirmar y Pagar</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            )}

            <p className="mt-6 text-center text-[10px] text-outline font-medium leading-relaxed max-w-xs mx-auto">
              Al hacer clic en &ldquo;Confirmar y Pagar&rdquo;, aceptas nuestros <Link href="/terminos" className="underline">Términos de Servicio</Link> y <Link href="/privacidad" className="underline">Políticas de Privacidad</Link>.
            </p>
          </div>

        </form>
      </div>
    </main>
  )
}

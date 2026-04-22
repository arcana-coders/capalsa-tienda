'use client'

import { useCartStore } from '@/lib/store'
import {
  PayPalScriptProvider,
  PayPalButtons,
  PayPalCardFieldsProvider,
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
  usePayPalCardFields,
} from "@paypal/react-paypal-js"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const IconPayPal = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 7.333c0 4-2.667 6-6.667 6H10.5l-1 5a.5.5 0 0 1-.5.4h-3a.5.5 0 0 1-.5-.6l2.333-11.666a1 1 0 0 1 1-.867h5.334c4.133 0 5.8 1.734 5.8 3.734z" fill="#003087"/>
    <path d="M17.333 4.667C17.333 8.667 14.666 10.667 10.666 10.667h-2.5l-1 5a.5.5 0 0 1-.5.4h-3a.5.5 0 0 1-.5-.6L5.5 3.8a1 1 0 0 1 1-.867h5.5c4 0 5.333 1.734 5.333 3.734z" fill="#009CDE"/>
  </svg>
)

const fieldStyle: Record<string, object> = {
  input: {
    'font-family': "'Plus Jakarta Sans', sans-serif",
    'font-size': '14px',
    color: '#1b1c1c',
    padding: '14px 16px',
  },
  '.invalid': { color: '#dc2626' },
}

const fieldContainerClass =
  'bg-[#f5f3f3] rounded-2xl overflow-hidden border border-[#c4c8ce]/10 h-[52px]'

// Separate component — usePayPalCardFields must be inside PayPalCardFieldsProvider
function CardSubmitButton({ label, isProcessing }: { label: string; isProcessing: boolean }) {
  const { cardFieldsForm } = usePayPalCardFields()

  return (
    <button
      type="button"
      disabled={isProcessing || !cardFieldsForm}
      onClick={() => cardFieldsForm?.submit()}
      className="w-full py-5 bg-[#00386c] hover:bg-[#1a4f8b] disabled:opacity-60 disabled:cursor-not-allowed text-white font-black rounded-2xl text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
    >
      {isProcessing ? (
        <>
          <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          Procesando...
        </>
      ) : (
        <>
          {label}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </>
      )}
    </button>
  )
}

export default function OrderSummary({ paymentMethod, setPaymentMethod, clienteData }: any) {
  const { items, clearCart } = useCartStore() as any
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCardForm, setShowCardForm] = useState(false)

  const subtotal = items.reduce((sum: number, i: any) => sum + (Number(i.precio) * i.cantidad), 0)
  const grandTotal = subtotal

  const formatPrice = (n: number) =>
    n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
    currency: "MXN",
    intent: "capture",
    components: "buttons,card-fields",
  }

  const handleCreateOrder = async () => {
    const res = await fetch("/api/checkout/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, clienteData }),
    })
    const order = await res.json()
    return order.id
  }

  const handleCapture = async (orderID: string) => {
    setIsProcessing(true)
    try {
      const res = await fetch("/api/checkout/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID, clienteData, items, total: grandTotal }),
      })
      const result = await res.json()
      if (result.status === 'COMPLETED') {
        clearCart()
        router.push(`/checkout/exitoso?order=${result.numeroOrden}`)
      } else {
        alert('El pago no pudo ser completado. Por favor intenta de nuevo.')
      }
    } catch (err) {
      console.error(err)
      alert('Hubo un error procesando tu pago.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_15px_40px_-15px_rgba(0,56,108,0.08)] border border-[#c4c8ce]/20 sticky top-6">
        <h2 className="text-2xl font-black text-[#1b1c1c] mb-8 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Resumen de Compra
        </h2>

        {/* Lista de productos */}
        <div className="space-y-6 mb-10 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
          {items.map((item: any) => (
            <div key={item.id} className="flex gap-4 group">
              <div className="relative w-16 h-16 flex-shrink-0 bg-[#f5f3f3] rounded-2xl overflow-hidden border border-[#c4c8ce]/20">
                <img
                  src={item.imagen}
                  alt={item.titulo}
                  className="w-full h-full object-contain p-2"
                />
                <span className="absolute -top-1 -right-1 bg-[#00386c] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {item.cantidad}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#1b1c1c] line-clamp-2 leading-relaxed mb-1 capitalize">
                  {item.titulo.toLowerCase()}
                </h4>
                <span className="text-sm font-black text-[#00386c]">{formatPrice(Number(item.precio))}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desglose de costos */}
        <div className="space-y-4 py-6 border-y border-[#c4c8ce]/10">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#74787e] font-medium">Subtotal</span>
            <span className="text-[#1b1c1c] font-black">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#74787e] font-medium">Envío Gratis Nacional</span>
            <span className="text-[#43673c] font-bold uppercase tracking-widest text-[10px]">¡Gratis!</span>
          </div>
        </div>

        <div className="flex justify-between items-center py-6">
          <span className="text-lg font-black text-[#1b1c1c] tracking-tight">Total</span>
          <span className="text-3xl font-black text-[#00386c] tracking-tighter">
            {formatPrice(grandTotal)}
          </span>
        </div>

        {/* Método de Pago */}
        <div className="mt-6">
          <span className="text-[10px] font-black text-[#74787e] uppercase tracking-[0.2em] mb-4 block">Método de Pago</span>

          <div className="space-y-3">
            {/* PayPal wallet */}
            <PayPalButtons
              fundingSource="paypal"
              style={{ layout: "horizontal", color: "blue", shape: "rect", label: "pay", height: 50 }}
              disabled={isProcessing}
              createOrder={handleCreateOrder}
              onApprove={async (data) => handleCapture(data.orderID)}
            />

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-[#c4c8ce]/30" />
              <span className="text-[10px] text-[#74787e] font-bold uppercase tracking-widest">o</span>
              <div className="flex-1 h-px bg-[#c4c8ce]/30" />
            </div>

            {/* Botón tarjeta */}
            <button
              type="button"
              onClick={() => setShowCardForm(v => !v)}
              className="w-full py-[14px] bg-[#1b1c1c] hover:bg-[#333] text-white font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-3"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              Tarjeta de débito o crédito
              <svg
                className={`ml-auto transition-transform duration-200 ${showCardForm ? 'rotate-180' : ''}`}
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {/* Form de tarjeta (PayPal CardFields sin billing address) */}
            {showCardForm && (
              <PayPalCardFieldsProvider
                createOrder={handleCreateOrder}
                onApprove={async ({ orderID }) => handleCapture(orderID)}
                onError={(err) => {
                  console.error('PayPal CardFields error:', err)
                  setIsProcessing(false)
                  alert('Error al procesar la tarjeta. Verifica los datos e intenta de nuevo.')
                }}
                style={fieldStyle}
              >
                <div className="bg-[#fbf9f8] rounded-2xl p-5 border border-[#c4c8ce]/15 space-y-4 mt-1">
                  <div>
                    <label className="text-[10px] font-black text-[#74787e] uppercase tracking-[0.15em] mb-2 block">
                      Número de tarjeta
                    </label>
                    <div className={fieldContainerClass}>
                      <PayPalNumberField />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-[#74787e] uppercase tracking-[0.15em] mb-2 block">
                        Vencimiento
                      </label>
                      <div className={fieldContainerClass}>
                        <PayPalExpiryField />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-[#74787e] uppercase tracking-[0.15em] mb-2 block">
                        CVV
                      </label>
                      <div className={fieldContainerClass}>
                        <PayPalCVVField />
                      </div>
                    </div>
                  </div>

                  <CardSubmitButton
                    label={`Pagar ${formatPrice(grandTotal)}`}
                    isProcessing={isProcessing}
                  />
                </div>
              </PayPalCardFieldsProvider>
            )}
          </div>
        </div>

        {/* Garantía */}
        <div className="mt-8 flex items-center gap-3 px-5 py-4 bg-[#fbf9f8] rounded-2xl border border-[#c4c8ce]/10">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#43673c] flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <p className="text-[11px] font-bold text-[#44494e] leading-tight">
            Tu compra está protegida por nuestra <span className="text-[#00386c]">Garantía de Satisfacción Capalsa</span>.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 pt-6 border-t border-[#c4c8ce]/10">
          <div className="bg-[#fbf9f8] rounded-2xl p-5 border border-[#c4c8ce]/10 flex flex-col items-center">
            <div className="flex flex-wrap justify-center items-center gap-4 w-full mb-3">
              <img src="/images/badge-verisign.png" alt="Verisign" className="h-10 w-auto object-contain" />
              <img src="/images/badge-paypal.png" alt="PayPal" className="h-10 w-auto object-contain" />
              <img src="/images/badge-truste.png" alt="TRUSTe" className="h-10 w-auto object-contain" />
              <img src="/images/badge-ssl.png" alt="SSL" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-[9px] font-black text-[#74787e] uppercase tracking-[0.2em] mb-3 text-center">Pago 100% Seguro</p>
            <p className="text-[10px] font-bold text-[#44494e] leading-tight text-center px-2 border-t border-[#c4c8ce]/10 pt-3">
              Tu compra está protegida por encriptación SSL de 256 bits y procesadores de pago certificados.
            </p>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  )
}

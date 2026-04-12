import { useCartStore } from '@/lib/store'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { useRouter } from 'next/navigation'
import { useState } from 'react'


const IconPayPal = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 7.333c0 4-2.667 6-6.667 6H10.5l-1 5a.5.5 0 0 1-.5.4h-3a.5.5 0 0 1-.5-.6l2.333-11.666a1 1 0 0 1 1-.867h5.334c4.133 0 5.8 1.734 5.8 3.734z" fill="#003087"/>
    <path d="M17.333 4.667C17.333 8.667 14.666 10.667 10.666 10.667h-2.5l-1 5a.5.5 0 0 1-.5.4h-3a.5.5 0 0 1-.5-.6L5.5 3.8a1 1 0 0 1 1-.867h5.5c4 0 5.333 1.734 5.333 3.734z" fill="#009CDE"/>
  </svg>
)

export default function OrderSummary({ paymentMethod, setPaymentMethod, clienteData }: any) {
  const { items, clearCart } = useCartStore() as any
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  // Precios seguros y sumatoria manual para evitar errores del store
  const subtotal = items.reduce((sum: number, i: any) => sum + (Number(i.precio) * i.cantidad), 0)

  // En Capalsa el envío siempre es gratis nacional
  const shippingTotal = 0

  const grandTotal = subtotal + shippingTotal

  const formatPrice = (n: number) =>
    n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
    currency: "MXN",
    intent: "capture",
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_15px_40px_-15px_rgba(0,56,108,0.08)] border border-[#c4c8ce]/20 sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
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
            <span className="text-[#43673c] font-bold uppercase tracking-widest text-[10px]">
              ¡Gratis!
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center py-6">
          <span className="text-lg font-black text-[#1b1c1c] tracking-tight">Total</span>
          <span className="text-3xl font-black text-[#00386c] tracking-tighter">
            {formatPrice(grandTotal)}
          </span>
        </div>

        {/* Método de Pago (Solo PayPal por ahora) */}
        <div className="mt-6 space-y-3">
          <span className="text-[10px] font-black text-[#74787e] uppercase tracking-[0.2em] mb-2 block">Método de Pago</span>
          
          <div
            className="w-full p-4 rounded-2xl flex items-center justify-between border-2 border-[#003087] bg-[#003087]/5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <IconPayPal />
              <span className="text-sm font-bold text-[#1b1c1c]">PayPal / Tarjeta débito o crédito</span>
            </div>
            <div className="w-4 h-4 rounded-full bg-[#003087] flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="mt-8">
          {paymentMethod === 'paypal' ? (
            <div className="relative">
              <PayPalButtons
                style={{ 
                  layout: "vertical", 
                  color: "blue", 
                  shape: "rect", 
                  label: "pay",
                  height: 50
                }}
                disabled={isProcessing}
                createOrder={async () => {
                  const res = await fetch("/api/checkout/paypal/create-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ items }),
                  });
                  const order = await res.json();
                  return order.id;
                }}
                onApprove={async (data) => {
                  setIsProcessing(true);
                  try {
                    const res = await fetch("/api/checkout/paypal/capture-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ orderID: data.orderID, clienteData }),
                    });
                    const result = await res.json();
                    if (result.status === 'COMPLETED') {
                      clearCart();
                      router.push(`/checkout/exitoso?order=${result.numeroOrden}`);
                    } else {
                      alert('El pago no pudo ser completado. Por favor intenta de nuevo.');
                    }
                  } catch (err) {
                    console.error(err);
                    alert('Hubo un error procesando tu pago.');
                  } finally {
                    setIsProcessing(false);
                  }
                }}
              />
            </div>
          ) : (
            <div className="text-center p-4 bg-amber-50 rounded-2xl border border-amber-100 italic text-[11px] text-amber-800">
              Error: Selecciona un método de pago funcional
            </div>
          )}
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
      </div>
    </PayPalScriptProvider>
  )
}

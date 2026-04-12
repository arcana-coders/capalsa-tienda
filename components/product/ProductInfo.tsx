'use client'

import { useCartStore } from '@/lib/store'
import { useState } from 'react'

// Reemplaza "Amazon" por "Capalsa" en texto plano.
const sanitizeText = (text: string): string =>
  text
    .replace(/(?<![/.:\w-])Amazon\.com(?![/.\w-])/gi, 'Capalsa')
    .replace(/(?<![/.:\w-])Amazon(?![/.\w-])/gi, 'Capalsa')

const IconCart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)

const IconCheckCTA = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const IconTruck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 4v5h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)

const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

const IconReceipt = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
)

const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

interface Producto {
  id: string
  asin: string
  titulo: string
  precio: number | string
  precioCompare?: number | string | null
  imagenes: any
  marca?: string | null
  bullets?: any
}

// En Capalsa, el envío nacional está incluido en el precio de cada pieza.

export default function ProductInfo({ producto }: { producto: Producto }) {
  const { addItem, openCart } = useCartStore() as any
  const [agregado, setAgregado] = useState(false)
  const [cantidad, setCantidad] = useState(1)

  const precio = Number(producto.precio)
  const precioCompare = producto.precioCompare ? Number(producto.precioCompare) : null
  const descuento = precioCompare && precioCompare > precio
    ? Math.round((1 - precio / precioCompare) * 100)
    : 0

  const imagenes = Array.isArray(producto.imagenes) ? producto.imagenes : []
  const bullets = Array.isArray(producto.bullets) ? producto.bullets : []

  const formatPrice = (n: number) =>
    n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

  const precioTotal = precio * cantidad

  const handleAgregar = () => {
    for (let i = 0; i < cantidad; i++) {
      addItem({
        id: producto.id,
        asin: producto.asin,
        titulo: producto.titulo,
        precio,
        imagen: imagenes[0] ?? '',
      })
    }
    setAgregado(true)
    openCart()
    setTimeout(() => setAgregado(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Brand & Reference */}
      <div className="flex items-center justify-between">
        {producto.marca && (
          <span className="text-[10px] text-[#44494e] font-bold uppercase tracking-widest bg-[#f5f3f3] px-2.5 py-1 rounded-full">
            {producto.marca}
          </span>
        )}
        <span className="text-[10px] text-[#74787e] font-medium tracking-tight">Ref: {producto.asin}</span>
      </div>

      <h1
        className="text-3xl lg:text-4xl font-black text-[#1b1c1c] leading-tight"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {producto.titulo}
      </h1>

      {/* Precio */}
      <div className="flex items-baseline gap-4 py-2 border-y border-[#c4c8ce]/20">
        <span className="text-4xl font-black text-[#00386c]">{formatPrice(precio)}</span>
        {precioCompare && precioCompare > precio && (
          <div className="flex flex-col items-start">
            <span className="text-base text-[#74787e] line-through decoration-[#74787e]/40">{formatPrice(precioCompare)}</span>
            <span className="bg-[#582d00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5">
              AHORRA {descuento}%
            </span>
          </div>
        )}
      </div>

      {/* Value badges strip */}
      <div className="grid grid-cols-1 gap-3 text-sm">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#c1ebb5]/20 text-[#1b1c1c] border border-[#c1ebb5]/30">
          <span className="text-[#43673c] w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0">
            <IconTruck />
          </span>
          <div>
            <span className="font-bold block">Envío Gratis a todo México</span>
            <span className="text-xs text-[#44494e]">No aplica en zonas extendidas</span>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#f5f3f3] text-[#1b1c1c] border border-[#c4c8ce]/20">
          <span className="text-[#00386c] w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0">
            <IconClock />
          </span>
          <div>
            <span className="font-bold block">Importación Directa</span>
            <span className="text-xs text-[#44494e]">Entrega garantizada en 7–9 días hábiles</span>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white text-[#1b1c1c] border border-[#c4c8ce]/30">
          <span className="text-[#00386c] w-8 h-8 rounded-lg bg-[#f5f3f3] flex items-center justify-center flex-shrink-0">
            <IconReceipt />
          </span>
          <div>
            <span className="font-bold block text-xs uppercase tracking-tight">Facturamos tu compra</span>
            <span className="text-[11px] text-[#74787e]">Solicítala al momento de tu pedido</span>
          </div>
        </div>
      </div>

      {/* Quantity & Summary */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-[#1b1c1c]">Cantidad:</span>
          <div className="flex items-center bg-[#f5f3f3] rounded-xl p-1 border border-[#c4c8ce]/20">
            <button
              onClick={() => setCantidad(c => Math.max(1, c - 1))}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white text-lg font-bold transition-all text-[#00386c]"
            >−</button>
            <span className="w-10 text-center text-sm font-black text-[#1b1c1c]">{cantidad}</span>
            <button
              onClick={() => setCantidad(c => c + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white text-lg font-bold transition-all text-[#00386c]"
            >+</button>
          </div>
        </div>
      </div>

      {/* Bullets — Highlighting features */}
      {bullets.length > 0 && (
        <ul className="space-y-3 pt-2">
          {bullets.slice(0, 5).map((b: string, i: number) => (
            <li key={i} className="flex gap-3 text-sm text-[#1b1c1c] leading-relaxed group">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f5f3f3] border border-[#c4c8ce]/30 flex items-center justify-center text-[#43673c] group-hover:bg-[#c1ebb5]/40 transition-colors">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <span className="font-medium">{sanitizeText(b)}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA Section */}
      <div className="flex flex-col gap-3 pt-4">
        <button
          onClick={handleAgregar}
          className={`
            w-full py-4.5 rounded-2xl font-black text-sm transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg
            ${agregado
              ? 'bg-[#43673c] text-white scale-[0.98]'
              : 'bg-[#00386c] hover:bg-[#1a4f8b] text-white hover:shadow-xl hover:-translate-y-0.5'
            }
          `}
        >
          {agregado ? (
            <><IconCheckCTA /><span>¡Agregado al Carrito!</span></>
          ) : (
            <><IconCart /><span>Agregar al carrito — {formatPrice(precioTotal)}</span></>
          )}
        </button>

        {/* Security promise */}
        <p className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#74787e] uppercase tracking-wider">
          <IconShield />
          Compra 100% protegida y garantizada
        </p>
      </div>
    </div>
  )
}

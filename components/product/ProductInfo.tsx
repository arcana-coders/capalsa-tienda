'use client'

import { useCartStore } from '@/lib/store'
import { useState } from 'react'

interface Producto {
  id: string
  asin: string
  titulo: string
  precio: number
  precio_compare?: number
  imagenes: string[]
  marca?: string
  bullets?: string[]
}

export default function ProductInfo({ producto }: { producto: Producto }) {
  const { addItem, openCart } = useCartStore()
  const [agregado, setAgregado] = useState(false)

  const formatPrice = (n: number) =>
    n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

  const descuento = producto.precio_compare
    ? Math.round((1 - producto.precio / producto.precio_compare) * 100)
    : 0

  const handleAgregar = () => {
    addItem({
      id: producto.id,
      asin: producto.asin,
      titulo: producto.titulo,
      precio: producto.precio,
      imagen: producto.imagenes?.[0] ?? '',
    })
    setAgregado(true)
    openCart()
    setTimeout(() => setAgregado(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      {producto.marca && (
        <span className="text-xs text-[#6B6B6B] uppercase tracking-widest font-medium">
          {producto.marca}
        </span>
      )}

      <h1 className="text-2xl font-bold text-[#1A1A1A] leading-snug">{producto.titulo}</h1>

      {/* Precio */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-[#1A1A1A]">{formatPrice(producto.precio)}</span>
        {producto.precio_compare && (
          <>
            <span className="text-base text-[#6B6B6B] line-through">
              {formatPrice(producto.precio_compare)}
            </span>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
              -{descuento}%
            </span>
          </>
        )}
      </div>

      {/* Envío */}
      <div className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 px-3 py-2 rounded-lg w-fit">
        <span>🚚</span>
        <span>Envío gratis a todo México</span>
      </div>

      {/* Bullets */}
      {producto.bullets && producto.bullets.length > 0 && (
        <ul className="space-y-2">
          {producto.bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm text-[#1A1A1A] leading-snug">
              <span className="text-[#C4813A] mt-0.5 flex-shrink-0">✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <div className="flex flex-col gap-3 mt-2">
        <button
          onClick={handleAgregar}
          className={`w-full py-3.5 rounded-full font-semibold text-sm transition-all ${
            agregado
              ? 'bg-green-500 text-white'
              : 'bg-[#C4813A] hover:bg-[#A36A28] text-white'
          }`}
        >
          {agregado ? '✓ Agregado al carrito' : 'Agregar al carrito'}
        </button>
      </div>

      {/* ASIN ref */}
      <p className="text-xs text-[#6B6B6B]">Ref: {producto.asin}</p>
    </div>
  )
}

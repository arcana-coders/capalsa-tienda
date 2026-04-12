'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { useState } from 'react'

interface Product {
  id: string
  asin: string
  titulo: string
  slug: string
  precio: number
  precioCompare?: number
  imagenes: string[]
  marca?: string
  destacado?: boolean
}

interface Props {
  producto: Product
}

const IconCart = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const IconTruck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 4v5h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)

export default function ProductCard({ producto }: Props) {
  const { addItem, openCart } = useCartStore() as any
  const [added, setAdded] = useState(false)

  const formatPrice = (n: number) =>
    n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: producto.id,
      asin: producto.asin,
      titulo: producto.titulo,
      precio: Number(producto.precio),
      imagen: (producto.imagenes as any)?.[0] ?? '',
    })
    openCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const imagenes = (producto.imagenes as any) ?? []
  const imagen = Array.isArray(imagenes) ? imagenes[0] : ''
  const precio = Number(producto.precio)
  const precioCompare = producto.precioCompare ? Number(producto.precioCompare) : null
  const descuento = precioCompare ? Math.round((1 - precio / precioCompare) * 100) : 0

  return (
    <Link
      href={`/producto/${producto.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#f5f3f3] overflow-hidden">
        {imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagen}
            alt={producto.titulo}
            className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            loading="eager"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#c4c8ce]">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
          </div>
        )}
        {descuento > 5 && (
          <span className="absolute top-2 left-2 bg-[#582d00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{descuento}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">
        {producto.marca && (
          <span className="text-[10px] text-[#44494e] font-bold uppercase tracking-wider mb-1">
            {producto.marca}
          </span>
        )}
        <p className="text-sm text-[#1b1c1c] font-semibold line-clamp-2 leading-snug flex-1">
          {producto.titulo}
        </p>

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-[#00386c]">
              {formatPrice(precio)}
            </span>
            {precioCompare && precioCompare > precio && (
              <span className="text-xs text-[#74787e] line-through">
                {formatPrice(precioCompare)}
              </span>
            )}
          </div>
          <p className="flex items-center gap-1 text-[11px] text-[#43673c] font-semibold mt-0.5">
            <IconTruck />
            <span>Envío gratis · 7–9 días hábiles</span>
          </p>
        </div>

        {/* Button */}
        <button
          onClick={handleAddToCart}
          className={`
            mt-3 w-full py-2.5 text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5
            ${added
              ? 'bg-[#43673c] text-white'
              : 'bg-[#f5f3f3] text-[#00386c] hover:bg-[#00386c] hover:text-white'
            }
          `}
        >
          {added ? (
            <><IconCheck /><span>En el carrito</span></>
          ) : (
            <><IconCart /><span>Añadir</span></>
          )}
        </button>
      </div>
    </Link>
  )
}

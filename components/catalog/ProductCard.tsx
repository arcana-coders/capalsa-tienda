'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'

interface Product {
  id: string
  asin: string
  titulo: string
  slug: string
  precio: number
  precio_compare?: number
  imagenes: string[]
  marca?: string
  destacado?: boolean
}

interface Props {
  producto: Product
}

export default function ProductCard({ producto }: Props) {
  const { addItem, openCart } = useCartStore()

  const formatPrice = (n: number) =>
    n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: producto.id,
      asin: producto.asin,
      titulo: producto.titulo,
      precio: producto.precio,
      imagen: producto.imagenes?.[0] ?? '',
    })
    openCart()
  }

  const imagen = producto.imagenes?.[0] ?? ''
  const descuento = producto.precio_compare
    ? Math.round((1 - producto.precio / producto.precio_compare) * 100)
    : 0

  return (
    <Link
      href={`/producto/${producto.slug}`}
      className="group flex flex-col bg-white rounded-xl border border-[var(--color-gray-border)] hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square bg-[var(--color-gray-soft)]">
        {imagen ? (
          <Image
            src={imagen}
            alt={producto.titulo}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-[var(--color-gray-border)]">
            📦
          </div>
        )}
        {descuento > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            -{descuento}%
          </span>
        )}
        {producto.destacado && (
          <span className="absolute top-2 right-2 bg-[var(--color-brand)] text-white text-[10px] font-bold px-2 py-0.5 rounded">
            Destacado
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3">
        {producto.marca && (
          <span className="text-[11px] text-[var(--color-gray-mid)] uppercase tracking-wide mb-1">
            {producto.marca}
          </span>
        )}
        <p className="text-sm text-[var(--color-dark)] line-clamp-2 leading-snug flex-1">
          {producto.titulo}
        </p>
        <div className="mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[var(--color-dark)]">
              {formatPrice(producto.precio)}
            </span>
            {producto.precio_compare && (
              <span className="text-xs text-[var(--color-gray-mid)] line-through">
                {formatPrice(producto.precio_compare)}
              </span>
            )}
          </div>
          <p className="text-[11px] text-green-600 font-medium mt-0.5">Envío gratis</p>
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full py-2 bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-semibold rounded-full transition-colors"
        >
          Agregar al carrito
        </button>
      </div>
    </Link>
  )
}

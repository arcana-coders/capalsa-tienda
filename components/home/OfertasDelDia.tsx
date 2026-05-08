'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store'
import { useState } from 'react'

interface Product {
  id: string
  asin?: string | null
  titulo: string
  slug: string
  precio: number
  precioCompare?: number
  imagenes: string[]
  marca?: string
}

interface Props {
  productos: Product[]
}

const IconCart = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)

function formatPrice(n: number) {
  return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
}

function HeroProduct({ producto }: { producto: Product }) {
  const { addItem, openCart } = useCartStore() as any
  const [added, setAdded] = useState(false)

  const imagenes = (producto.imagenes as string[]) ?? []
  const imagen = imagenes[0] ?? ''
  const precio = Number(producto.precio)
  const precioCompare = producto.precioCompare ? Number(producto.precioCompare) : null
  const descuento = precioCompare ? Math.round((1 - precio / precioCompare) * 100) : 0
  const url = `/producto/${producto.slug}`

  const handleAdd = () => {
    addItem({ id: producto.id, asin: producto.asin, titulo: producto.titulo, precio, imagen })
    openCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <article className="group relative bg-surface-lowest rounded-2xl overflow-hidden flex flex-col min-h-[340px] hover:shadow-2xl hover:-translate-y-1 transition-all duration-400 ease-out">
      {descuento > 5 && (
        <span className="absolute top-3 left-3 z-10 bg-tertiary text-on-tertiary text-[10px] font-bold px-2.5 py-1 rounded-full">
          -{descuento}% OFF
        </span>
      )}
      {/* Linked image */}
      <Link href={url} tabIndex={-1} aria-hidden="true" className="relative flex-1 bg-surface-low block min-h-[200px]">
        {imagen ? (
          <Image
            src={imagen}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 580px"
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-outline-variant" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
      </Link>
      {/* Info */}
      <div className="p-5 space-y-2">
        {producto.marca && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{producto.marca}</span>
        )}
        <h3 className="font-bold text-foreground text-lg leading-snug line-clamp-2">
          <Link href={url} className="hover:text-primary transition-colors">{producto.titulo}</Link>
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-primary">{formatPrice(precio)}</span>
          {precioCompare && precioCompare > precio && (
            <span className="text-sm text-outline line-through">{formatPrice(precioCompare)}</span>
          )}
        </div>
        {/* Button outside any link */}
        <button
          onClick={handleAdd}
          aria-label={added ? `${producto.titulo} en el carrito` : `Agregar ${producto.titulo} al carrito`}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 ease-out active:scale-95 flex items-center justify-center gap-2 mt-1
            ${added ? 'bg-secondary text-on-tertiary' : 'bg-primary hover:bg-primary-container text-on-primary shadow-md hover:shadow-lg hover:-translate-y-0.5'}`}
        >
          <IconCart />
          {added ? 'En el carrito ✓' : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  )
}

function SmallProduct({ producto }: { producto: Product }) {
  const { addItem, openCart } = useCartStore() as any

  const imagenes = (producto.imagenes as string[]) ?? []
  const imagen = imagenes[0] ?? ''
  const precio = Number(producto.precio)
  const precioCompare = producto.precioCompare ? Number(producto.precioCompare) : null
  const url = `/producto/${producto.slug}`

  const handleAdd = () => {
    addItem({ id: producto.id, asin: producto.asin, titulo: producto.titulo, precio, imagen })
    openCart()
  }

  return (
    <article className="group bg-surface-lowest rounded-2xl overflow-hidden flex gap-3 p-3 hover:shadow-md hover:border-primary/20 border border-transparent transition-all duration-300 ease-out">
      {/* Linked thumbnail */}
      <Link href={url} tabIndex={-1} aria-hidden="true" className="relative w-20 h-20 flex-shrink-0 rounded-xl bg-surface-low overflow-hidden block">
        {imagen ? (
          <Image
            src={imagen}
            alt=""
            fill
            sizes="80px"
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : null}
      </Link>
      {/* Info */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        {producto.marca && (
          <span className="text-[10px] font-bold uppercase tracking-wide text-on-surface-variant truncate">{producto.marca}</span>
        )}
        <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
          <Link href={url} className="hover:text-primary transition-colors">{producto.titulo}</Link>
        </p>
        <div className="flex items-center justify-between gap-1 mt-1">
          <div>
            <span className="font-black text-primary text-sm">{formatPrice(precio)}</span>
            {precioCompare && precioCompare > precio && (
              <span className="text-xs text-outline line-through ml-1">{formatPrice(precioCompare)}</span>
            )}
          </div>
          {/* Button outside any link */}
          <button
            onClick={handleAdd}
            aria-label={`Añadir ${producto.titulo} al carrito`}
            className="flex-shrink-0 bg-surface-low hover:bg-primary text-primary hover:text-on-primary px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ease-out active:scale-95"
          >
            Añadir
          </button>
        </div>
      </div>
    </article>
  )
}

export default function OfertasDelDia({ productos }: Props) {
  if (!productos || productos.length === 0) return null

  const [hero, ...rest] = productos
  const gridItems = rest.slice(0, 4)

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2
            className="text-2xl font-black text-foreground"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Ofertas del día
          </h2>
          <p className="text-sm text-on-surface-variant mt-0.5">Precios exclusivos de importación</p>
        </div>
        <Link href="/categorias" className="text-sm font-semibold text-primary hover:text-primary-container flex items-center gap-1 transition-colors">
          Ver todas
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HeroProduct producto={hero} />
        {gridItems.length > 0 && (
          <div className="grid grid-cols-1 gap-3 content-start">
            {gridItems.map(p => (
              <SmallProduct key={p.id} producto={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

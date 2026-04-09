'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import SearchBar from './SearchBar'
import CartDrawer from './CartDrawer'

const CATEGORIAS_NAV = [
  { nombre: 'Herramientas', slug: 'herramientas' },
  { nombre: 'Hogar', slug: 'hogar' },
  { nombre: 'Electrónica', slug: 'electronica' },
  { nombre: 'Deportes', slug: 'deportes' },
  { nombre: 'Jardinería', slug: 'jardineria' },
  { nombre: 'Oficina', slug: 'oficina' },
]

export default function Header() {
  const { count, toggleCart } = useCartStore()

  return (
    <>
      <CartDrawer />
      <header className="w-full bg-white border-b border-[var(--color-gray-border)] sticky top-0 z-30">
        {/* Top bar */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Capalsa Store"
              width={160}
              height={50}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Search bar — centro */}
          <div className="flex-1">
            <SearchBar />
          </div>

          {/* Cart */}
          <button
            onClick={toggleCart}
            className="relative flex flex-col items-center text-[var(--color-dark)] hover:text-[var(--color-brand)] transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11M10 19a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
            <span className="text-xs">Carrito</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--color-brand)] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>
        </div>

        {/* Categories nav */}
        <nav className="bg-[var(--color-dark)]">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto">
            <Link
              href="/categorias"
              className="text-white/80 hover:text-white text-xs font-medium py-2 px-3 whitespace-nowrap hover:bg-white/10 rounded transition-colors"
            >
              ☰ Todas las categorías
            </Link>
            {CATEGORIAS_NAV.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="text-white/80 hover:text-white text-xs font-medium py-2 px-3 whitespace-nowrap hover:bg-white/10 rounded transition-colors"
              >
                {cat.nombre}
              </Link>
            ))}
          </div>
        </nav>
      </header>
    </>
  )
}

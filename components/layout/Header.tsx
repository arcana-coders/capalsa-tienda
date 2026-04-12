'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import CartDrawer from './CartDrawer'

// Fallback categories for initial load/SSR
const INITIAL_CATEGORIES = [
  { nombre: 'Hogar',      slug: 'hogar' },
  { nombre: 'Limpieza',   slug: 'limpieza' },
  { nombre: 'Cocina',     slug: 'cocina' },
  { nombre: 'Mascotas',   slug: 'mascotas' },
  { nombre: 'Deportes',   slug: 'deportes' },
  { nombre: 'Salud',      slug: 'salud' },
  { nombre: 'Oficina',    slug: 'oficina' },
]

/* ── Icons ── */
const IconCart = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11M10 19a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
  </svg>
)
const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
const IconClose = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IconGrid = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
)

/* ── Desktop SearchBar ── */
function DesktopSearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (q) router.push(`/buscar?q=${encodeURIComponent(q)}`)
  }
  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl">
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Buscar repuestos, cocina, limpieza..."
        className="flex-1 h-10 px-4 text-sm bg-[#f5f3f3] border border-[#c4c8ce]/50 rounded-l-full outline-none focus:border-[#00386c] focus:bg-white transition-all"
      />
      <button
        type="submit"
        className="h-10 px-5 bg-[#00386c] hover:bg-[#1a4f8b] text-white text-sm font-semibold rounded-r-full transition-colors"
      >
        Buscar
      </button>
    </form>
  )
}

/* ── Mobile SearchBar ── */
function MobileSearchBar({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (q) { router.push(`/buscar?q=${encodeURIComponent(q)}`); onClose() }
  }
  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full px-4 py-2 bg-[#fbf9f8] border-t border-[#f0eeee]">
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Buscar productos..."
        className="flex-1 h-10 px-4 text-sm bg-[#f5f3f3] border border-[#c4c8ce]/50 rounded-full outline-none focus:border-[#00386c] transition-all"
      />
      <button type="submit" className="flex-shrink-0 h-10 w-10 bg-[#00386c] hover:bg-[#1a4f8b] text-white rounded-full flex items-center justify-center transition-colors">
        <IconSearch />
      </button>
      <button type="button" onClick={onClose} className="flex-shrink-0 text-[#44494e] hover:text-[#1b1c1c] transition-colors">
        <IconClose />
      </button>
    </form>
  )
}

/* ── Main Header ── */
export default function Header() {
  const { count, toggleCart } = useCartStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [categorias, setCategorias] = useState(INITIAL_CATEGORIES)

  // Fetch dynamic categories
  useEffect(() => {
    fetch('/api/categorias')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategorias(data.map(c => ({ nombre: c.nombre, slug: c.slug })))
        }
      })
      .catch(err => console.error('Error loading navigation categories:', err))
  }, [])

  useEffect(() => {
    const handle = () => { if (window.innerWidth >= 1024) { setMenuOpen(false); setSearchOpen(false) } }
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <CartDrawer />
      <header className="w-full bg-white sticky top-0 z-30 shadow-[0_1px_0_0_#f0eeee]">

        {/* Top bar */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">

          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden flex-shrink-0 text-[#1b1c1c] hover:text-[#00386c] transition-colors"
            onClick={() => { setMenuOpen(o => !o); setSearchOpen(false) }}
            aria-label="Menú"
          >
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.png" alt="Capalsa Store" width={140} height={44} className="h-9 w-auto object-contain" priority />
          </Link>

          {/* Search desktop */}
          <div className="hidden lg:flex flex-1 px-4">
            <DesktopSearchBar />
          </div>

          {/* Spacer mobile */}
          <div className="flex-1 lg:hidden" />

          {/* Search icon mobile */}
          <button
            className="lg:hidden flex-shrink-0 text-[#1b1c1c] hover:text-[#00386c] transition-colors"
            onClick={() => { setSearchOpen(o => !o); setMenuOpen(false) }}
            aria-label="Buscar"
          >
            <IconSearch />
          </button>

          {/* Cart */}
          <button
            onClick={toggleCart}
            className="relative flex flex-col items-center text-[#1b1c1c] hover:text-[#00386c] transition-colors flex-shrink-0"
          >
            <IconCart />
            <span className="hidden sm:block text-xs font-medium">Carrito</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#00386c] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="lg:hidden">
            <MobileSearchBar onClose={() => setSearchOpen(false)} />
          </div>
        )}

        {/* Categories nav — desktop: tabs claras sobre blanco */}
        <nav className="hidden lg:block border-t border-[#f0eeee]">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-0.5 overflow-x-auto">
            <Link
              href="/categorias"
              className="flex items-center gap-1.5 text-[#44494e] hover:text-[#00386c] font-semibold text-xs py-2.5 px-3 whitespace-nowrap hover:bg-[#f5f3f3] rounded transition-colors"
            >
              <IconGrid />
              Todas las categorías
            </Link>
            {categorias.map(cat => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="text-[#44494e] hover:text-[#00386c] text-xs font-medium py-2.5 px-3 whitespace-nowrap hover:bg-[#f5f3f3] rounded transition-colors"
              >
                {cat.nombre}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Mobile side menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-72 bg-white flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0eeee]">
              <span className="font-bold text-[#00386c] text-sm uppercase tracking-widest">Categorías</span>
              <button onClick={() => setMenuOpen(false)} className="text-[#44494e] hover:text-[#1b1c1c] transition-colors"><IconClose /></button>
            </div>
            <nav className="flex-1 overflow-y-auto py-2">
              <Link href="/categorias" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-5 py-3.5 text-sm font-semibold text-[#00386c] hover:bg-[#f5f3f3] transition-colors border-b border-[#f0eeee]">
                <IconGrid />Ver todo el catálogo
              </Link>
              {categorias.map(cat => (
                <Link key={cat.slug} href={`/categoria/${cat.slug}`} onClick={() => setMenuOpen(false)} className="flex items-center px-5 py-3.5 text-sm text-[#1b1c1c] hover:bg-[#f5f3f3] hover:text-[#00386c] transition-colors border-b border-[#f0eeee]/60">
                  {cat.nombre}
                </Link>
              ))}
            </nav>
            <div className="px-5 py-4 border-t border-[#f0eeee] text-xs text-[#44494e]">
              <Link href="/contacto" onClick={() => setMenuOpen(false)} className="hover:text-[#00386c] transition-colors">Contacto</Link>
              <span className="mx-2">·</span>
              <Link href="/envios" onClick={() => setMenuOpen(false)} className="hover:text-[#00386c] transition-colors">Envíos</Link>
              <span className="mx-2">·</span>
              <Link href="/devoluciones" onClick={() => setMenuOpen(false)} className="hover:text-[#00386c] transition-colors">Devoluciones</Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

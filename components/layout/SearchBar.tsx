'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const IconSearch = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

export default function SearchBar() {
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
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar productos..."
        className="flex-1 h-10 px-4 text-sm border border-[#E0E0E0] rounded-l-full outline-none focus:border-[#C4813A] transition-colors min-w-0"
      />
      {/* Desktop: botón con texto — Móvil: solo lupa */}
      <button
        type="submit"
        className="h-10 bg-[#C4813A] hover:bg-[#A36A28] text-white rounded-r-full transition-colors flex items-center justify-center
          px-3 sm:px-5"
        aria-label="Buscar"
      >
        <span className="hidden sm:inline text-sm font-medium">Buscar</span>
        <span className="sm:hidden"><IconSearch /></span>
      </button>
    </form>
  )
}

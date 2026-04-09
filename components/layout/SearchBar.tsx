'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
        className="flex-1 h-10 px-4 text-sm border border-[var(--color-gray-border)] rounded-l-full outline-none focus:border-[var(--color-brand)] transition-colors"
      />
      <button
        type="submit"
        className="h-10 px-5 bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-medium rounded-r-full transition-colors"
      >
        Buscar
      </button>
    </form>
  )
}

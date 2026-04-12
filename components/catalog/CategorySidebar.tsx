'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface Props {
  marcas: string[]
  filtrosActivos: { marca?: string; min?: string; max?: string }
}

export default function CategorySidebar({ marcas, filtrosActivos }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setFiltro = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  const limpiar = () => router.push(pathname)

  const hayFiltros = !!(filtrosActivos.marca || filtrosActivos.min || filtrosActivos.max)

  return (
    <div className="space-y-8">
      {/* Header Sidebar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#c4c8ce]/20">
        <h3 className="text-xs font-black text-[#1b1c1c] uppercase tracking-[0.2em]">Filtros</h3>
        {hayFiltros && (
          <button
            onClick={limpiar}
            className="text-[10px] font-bold text-[#582d00] hover:text-[#00386c] uppercase tracking-wider transition-colors"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* Precio Section */}
      <div className="space-y-4">
        <h4 className="text-[11px] font-black text-[#00386c] uppercase tracking-widest">Rango de Precio</h4>
        <div className="space-y-1.5 font-medium">
          {[
            { label: 'Menos de $500', min: '', max: '500' },
            { label: '$500 – $1,000', min: '500', max: '1000' },
            { label: '$1,000 – $2,500', min: '1000', max: '2500' },
            { label: 'Más de $2,500', min: '2500', max: '' },
          ].map((rango) => {
            const activo =
              filtrosActivos.min === rango.min && filtrosActivos.max === rango.max
            return (
              <button
                key={rango.label}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString())
                  if (activo) {
                    params.delete('min')
                    params.delete('max')
                  } else {
                    if (rango.min) params.set('min', rango.min)
                    else params.delete('min')
                    if (rango.max) params.set('max', rango.max)
                    else params.delete('max')
                  }
                  router.push(`${pathname}?${params.toString()}`)
                }}
                className={`group flex items-center justify-between w-full text-left text-xs px-3 py-2.5 rounded-xl transition-all ${
                  activo
                    ? 'bg-[#00386c] text-white shadow-md'
                    : 'text-[#44494e] hover:bg-[#f5f3f3] bg-white border border-transparent hover:border-[#c4c8ce]/20'
                }`}
              >
                <span>{rango.label}</span>
                {activo && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Marcas Section */}
      {marcas.length > 0 && (
        <div className="space-y-4 pt-2">
          <h4 className="text-[11px] font-black text-[#00386c] uppercase tracking-widest">Marca</h4>
          <div className="space-y-1.5 font-medium max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#c4c8ce] scrollbar-track-transparent">
            {marcas.sort().map((marca) => (
              <button
                key={marca}
                onClick={() =>
                  setFiltro('marca', filtrosActivos.marca === marca ? null : marca)
                }
                className={`group flex items-center justify-between w-full text-left text-xs px-3 py-2.5 rounded-xl transition-all ${
                  filtrosActivos.marca === marca
                    ? 'bg-[#00386c] text-white shadow-md'
                    : 'text-[#44494e] hover:bg-[#f5f3f3] bg-white border border-transparent hover:border-[#c4c8ce]/20'
                }`}
              >
                <span className="truncate">{marca}</span>
                {filtrosActivos.marca === marca && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

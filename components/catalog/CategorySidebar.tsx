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

  const hayFiltros = filtrosActivos.marca || filtrosActivos.min || filtrosActivos.max

  return (
    <div className="space-y-6">
      {hayFiltros && (
        <button
          onClick={limpiar}
          className="text-xs text-[#C4813A] hover:underline font-medium"
        >
          ✕ Limpiar filtros
        </button>
      )}

      {/* Precio */}
      <div>
        <h3 className="text-sm font-bold text-[#1A1A1A] mb-3">Precio</h3>
        <div className="space-y-2">
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
                className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  activo
                    ? 'bg-[#C4813A] text-white font-medium'
                    : 'text-[#1A1A1A] hover:bg-[#F5F5F5]'
                }`}
              >
                {rango.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Marcas */}
      {marcas.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-[#1A1A1A] mb-3">Marca</h3>
          <div className="space-y-1">
            {marcas.map((marca) => (
              <button
                key={marca}
                onClick={() =>
                  setFiltro('marca', filtrosActivos.marca === marca ? null : marca)
                }
                className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  filtrosActivos.marca === marca
                    ? 'bg-[#C4813A] text-white font-medium'
                    : 'text-[#1A1A1A] hover:bg-[#F5F5F5]'
                }`}
              >
                {marca}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

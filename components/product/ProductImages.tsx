'use client'

import { useState } from 'react'


interface Props {
  imagenes: string[]
  titulo: string
}

const IconBox = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[#C0C0C0]">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)

export default function ProductImages({ imagenes, titulo }: Props) {
  const [activa, setActiva] = useState(0)

  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="aspect-square bg-[#F5F5F5] rounded-2xl flex items-center justify-center">
        <IconBox />
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      {/* Thumbnails — img nativo para evitar cache de Next.js image optimizer */}
      {imagenes.length > 1 && (
        <div className="flex flex-col gap-2 w-16 flex-shrink-0">
          {imagenes.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiva(i)}
              className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors flex items-center justify-center bg-white ${
                activa === i ? 'border-[#C4813A]' : 'border-[#E0E0E0] hover:border-[#C4813A]/50'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`${titulo} ${i + 1}`}
                className="w-full h-full object-contain p-1"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Imagen principal
          Usamos <img> nativo en lugar de next/image <Image fill> para evitar
          la condición de carrera donde el browser elige una variante pequeña
          del srcset antes de que el CSS hidrate y calcule el tamaño del contenedor.
          Las imágenes en R2 ya son _SL1500_ — calidad suficiente sin re-optimización. */}
      <div className="flex-1 aspect-square bg-[#F5F5F5] rounded-2xl overflow-hidden flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={activa}
          src={imagenes[activa]}
          alt={titulo}
          className="w-full h-full object-contain p-6"
          loading="eager"
          decoding="sync"
        />
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  imagenes: string[]
  titulo: string
}

export default function ProductImages({ imagenes, titulo }: Props) {
  const [activa, setActiva] = useState(0)

  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="aspect-square bg-[#F5F5F5] rounded-2xl flex items-center justify-center text-6xl">
        📦
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      {/* Thumbnails */}
      {imagenes.length > 1 && (
        <div className="flex flex-col gap-2 w-16">
          {imagenes.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiva(i)}
              className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                activa === i ? 'border-[#C4813A]' : 'border-[#E0E0E0] hover:border-[#C4813A]/50'
              }`}
            >
              <Image src={img} alt={`${titulo} ${i + 1}`} fill className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}

      {/* Imagen principal */}
      <div className="flex-1 relative aspect-square bg-[#F5F5F5] rounded-2xl overflow-hidden">
        <Image
          src={imagenes[activa]}
          alt={titulo}
          fill
          className="object-contain p-6"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  )
}

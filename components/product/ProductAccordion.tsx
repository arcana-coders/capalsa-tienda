'use client'

import { useState } from 'react'

interface AccordionItemProps {
  title: string
  isOpen?: boolean
  children: React.ReactNode
}

function AccordionItem({ title, isOpen = false, children }: AccordionItemProps) {
  const [open, setOpen] = useState(isOpen)

  return (
    <div className="border-b border-[#E0E0E0]">
      <button
        className="w-full py-4 flex items-center justify-between text-left group focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-[#1A1A1A] text-sm">{title}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-[#6B6B6B] transition-transform duration-300 flex-shrink-0 ml-2 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[800px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
      >
        <div className="text-sm text-[#444] leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}

interface ProductAccordionProps {
  descripcion?: string | null
  bullets?: string[] | null
}

export default function ProductAccordion({ descripcion, bullets }: ProductAccordionProps) {
  const hasBullets = Array.isArray(bullets) && bullets.length > 0
  const hasDesc = descripcion && descripcion.trim().length > 10

  if (!hasDesc && !hasBullets) return null

  return (
    <div className="mt-6">
      <div className="border-t border-[#E0E0E0]">
        {hasDesc && (
          <AccordionItem title="Descripción del producto" isOpen={true}>
            <p className="whitespace-pre-line">{descripcion}</p>
          </AccordionItem>
        )}

        {hasBullets && (
          <AccordionItem title="Características" isOpen={!hasDesc}>
            <ul className="space-y-2">
              {bullets!.map((b, i) => (
                <li key={i} className="flex gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#43673c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </AccordionItem>
        )}
      </div>
    </div>
  )
}

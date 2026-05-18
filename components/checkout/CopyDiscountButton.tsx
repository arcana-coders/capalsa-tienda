'use client'

import { useState } from 'react'

type CopyDiscountButtonProps = {
  code: string
}

const IconCopy = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

export default function CopyDiscountButton({ code }: CopyDiscountButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="w-16 rounded-2xl bg-primary text-on-primary flex items-center justify-center transition-all hover:bg-primary-container active:scale-95"
      title="Copiar código"
      aria-label={`Copiar código ${code}`}
    >
      {copied ? (
        <span className="text-[10px] font-black uppercase tracking-wide">OK</span>
      ) : (
        <IconCopy />
      )}
    </button>
  )
}

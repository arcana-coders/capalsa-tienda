'use client'

import { useCartStore } from '@/lib/store'
import Image from 'next/image'
import Link from 'next/link'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, count } = useCartStore() as any

  const formatPrice = (n: number) =>
    n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-gray-border)]">
          <h2 className="text-lg font-bold text-[var(--color-dark)]">
            Carrito
            {count > 0 && (
              <span className="ml-2 text-sm font-normal text-[var(--color-gray-mid)]">
                ({count} {count === 1 ? 'artículo' : 'artículos'})
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="p-1 text-[var(--color-gray-mid)] hover:text-[var(--color-dark)]"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-[var(--color-gray-mid)]">
              <span className="text-5xl mb-4">🛒</span>
              <p className="font-medium">Tu carrito está vacío</p>
              <p className="text-sm mt-1">Agrega productos para comenzar</p>
            </div>
          ) : (
            (items as any[]).map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-[var(--color-gray-soft)]">
                  {item.imagen && (
                    <Image
                      src={item.imagen}
                      alt={item.titulo}
                      fill
                      className="object-contain p-1"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-dark)] line-clamp-2 leading-tight">
                    {item.titulo}
                  </p>
                  <p className="text-sm font-bold text-[var(--color-brand)] mt-1">
                    {formatPrice(item.precio)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                      className="w-6 h-6 rounded border border-[var(--color-gray-border)] text-sm hover:bg-[var(--color-gray-soft)] flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="text-sm w-4 text-center">{item.cantidad}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                      className="w-6 h-6 rounded border border-[var(--color-gray-border)] text-sm hover:bg-[var(--color-gray-soft)] flex items-center justify-center"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-xs text-[var(--color-gray-mid)] hover:text-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-[var(--color-gray-border)] space-y-3">
            <div className="flex items-center justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-[var(--color-brand)]">{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-[var(--color-gray-mid)]">Envío gratis incluido</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-3 text-center bg-[var(--color-dark)] hover:bg-black text-white font-semibold rounded-full text-sm transition-colors"
            >
              Ir a pagar
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

'use client'

import { useCartStore } from '@/lib/store'
import Link from 'next/link'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore() as any

  const formatPrice = (n: number) =>
    n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

  const subtotal = items.reduce((sum: number, i: any) => sum + (Number(i.precio) * i.cantidad), 0)

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#001c36]/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-[0_0_50px_rgba(0,0,0,0.1)] flex flex-col transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-[#c4c8ce]/10">
          <div>
            <h2 className="text-xl font-black text-[#1b1c1c] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Tu Carrito
            </h2>
            <p className="text-[10px] font-black text-[#74787e] uppercase tracking-[0.2em] mt-1">
              {items.length} {items.length === 1 ? 'Producto Seleccionado' : 'Productos Seleccionados'}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f5f3f3] text-[#1b1c1c] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <span className="text-6xl mb-6">📦</span>
              <p className="font-black text-[#1b1c1c] text-lg tracking-tight mb-2">Está muy solo por aquí</p>
              <p className="text-sm text-[#74787e]">Explora nuestro catálogo y llena tu hogar de piezas únicas.</p>
              <button 
                onClick={closeCart}
                className="mt-8 text-[#00386c] font-black text-sm uppercase tracking-widest border-b-2 border-[#00386c] pb-1 hover:opacity-70 transition-opacity"
              >
                Volver a la tienda
              </button>
            </div>
          ) : (
            (items as any[]).map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="relative w-20 h-20 flex-shrink-0 bg-[#f5f3f3] rounded-2xl overflow-hidden border border-[#c4c8ce]/20">
                  {item.imagen && (
                    <img
                      src={item.imagen}
                      alt={item.titulo}
                      className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1b1c1c] line-clamp-2 leading-relaxed mb-1 capitalize">
                    {item.titulo.toLowerCase()}
                  </p>
                  <p className="text-sm font-black text-[#00386c]">
                    {formatPrice(Number(item.precio))}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center bg-[#f5f3f3] rounded-xl p-0.5 border border-[#c4c8ce]/10">
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-sm font-black text-[#00386c] transition-all"
                      >−</button>
                      <span className="w-6 text-center text-xs font-black text-[#1b1c1c]">{item.cantidad}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-sm font-black text-[#00386c] transition-all"
                      >+</button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[10px] font-black text-[#74787e] uppercase tracking-widest hover:text-red-600 transition-colors ml-auto"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-8 border-t border-[#c4c8ce]/20 space-y-5 bg-[#fbf9f8]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-[#74787e] uppercase tracking-widest">Subtotal</span>
              <span className="text-2xl font-black text-[#00386c] tracking-tighter">{formatPrice(subtotal)}</span>
            </div>
            
            <div className="flex items-center gap-3 py-3 px-4 bg-white rounded-xl border border-[#c4c8ce]/10">
              <div className="w-8 h-8 rounded-lg bg-[#c1ebb5] flex items-center justify-center text-[#43673c] flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <p className="text-[10px] text-[#44494e] font-bold leading-tight uppercase tracking-tight">
              Envío Nacional Incluido <br/> <span className="text-[#74787e] font-medium lowercase">en toda tu compra</span>
              </p>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="group relative block w-full py-5 bg-[#00386c] hover:bg-[#1a4f8b] text-white font-black rounded-2xl text-center text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                Proceder al Pago
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </span>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

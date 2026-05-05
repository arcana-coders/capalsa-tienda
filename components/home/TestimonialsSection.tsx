const TESTIMONIOS = [
  {
    nombre: 'Fernanda R.',
    ciudad: 'Ciudad de México',
    estrellas: 5,
    texto: 'Encontré el articulo exacto que buscaba en Amazon USA y en México no había quien lo vendiera. En Capalsa llegó en menos de una semana, impecablemente empacado y con factura mexicana. Volvería a comprar sin dudarlo.',
    avatar: 'F',
    producto: 'Aspiradora Shark NV752',
  },
  {
    nombre: 'Carlos M.',
    ciudad: 'Guadalajara, Jalisco',
    estrellas: 5,
    texto: 'La experiencia fue excelente de principio a fin. El precio fue mejor que en tiendas locales y el producto llegó original en caja sellada. Además me pudieron facturar — para mí eso es indispensable.',
    avatar: 'C',
    producto: 'Instant Pot Duo 7-en-1',
  },
  {
    nombre: 'Patricia V.',
    ciudad: 'Monterrey, Nuevo León',
    estrellas: 5,
    texto: 'Compré un humidificador que no conseguía en ningún lado. El proceso fue fácil, me mantuvieron informada del envío y llegó antes de lo esperado. El producto es 100% original. Ya le comenté a toda mi familia.',
    avatar: 'P',
    producto: 'Humidificador Levoit Core 400S',
  },
  {
    nombre: 'Javier T.',
    ciudad: 'Querétaro',
    estrellas: 5,
    texto: 'Desconfiaba un poco de comprar un artículo importado por internet, pero todo salió perfecto. Rastreo en tiempo real, atención rápida por WhatsApp y el producto llegó como nuevo. Totalmente recomendado.',
    avatar: 'J',
    producto: 'Ring Video Doorbell Pro 2',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-20 bg-[#f5f3f3] border-y border-[#e8e4e1]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#c1ebb5] text-[#324f2d] text-xs font-black uppercase tracking-widest rounded-full mb-4">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Clientes satisfechos
          </span>
          <h2
            className="text-3xl sm:text-4xl font-black text-[#1b1c1c] leading-tight mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Lo que dicen nuestros compradores
          </h2>
          <p className="text-[#44494e] text-base">
            Productos originales, envío garantizado y atención real.
          </p>
        </div>

        {/* Grid de testimonios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIOS.map((t, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-[#e8e4e1] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Estrellas */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.estrellas }).map((_, s) => (
                  <svg key={s} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Texto */}
              <p className="text-[#44494e] text-sm leading-relaxed flex-1 italic">
                &ldquo;{t.texto}&rdquo;
              </p>

              {/* Producto */}
              <span className="text-xs text-[#43673c] font-semibold bg-[#c1ebb5]/30 px-2 py-1 rounded-full w-fit">
                {t.producto}
              </span>

              {/* Autor */}
              <div className="flex items-center gap-3 pt-1 border-t border-[#e8e4e1] mt-1">
                <div
                  className="w-9 h-9 rounded-full bg-[#00386c] flex items-center justify-center font-black text-white text-sm flex-shrink-0"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {t.avatar}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-[#1b1c1c]">{t.nombre}</span>
                  <span className="text-xs text-[#44494e]">{t.ciudad}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

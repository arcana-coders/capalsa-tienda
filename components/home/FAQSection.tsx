const FAQS = [
  {
    question: '¿Los productos son originales?',
    answer: 'Sí. Todos nuestros productos son 100% originales, adquiridos directamente a través de Amazon USA. Cada artículo llega en su empaque de fábrica, sellado y sin alterar.',
  },
  {
    question: '¿Cuánto tarda el envío?',
    answer: 'El tiempo de entrega estándar es de 7 a 10 días hábiles a cualquier parte de México. Contamos con rastreo en tiempo real para que puedas seguir tu pedido en todo momento.',
  },
  {
    question: '¿Hacen factura (CFDI)?',
    answer: 'Sí, emitimos factura electrónica (CFDI) con todos los datos fiscales requeridos. Puedes solicitarla al momento de comprar o dentro de los 3 días hábiles posteriores a tu pedido.',
  },
  {
    question: '¿Qué pasa si mi producto llega dañado?',
    answer: 'Si el producto llega dañado o diferente a lo descrito, lo reponemos sin costo adicional. Contamos con política de devoluciones de 30 días y atención directa por WhatsApp para resolver cualquier inconveniente.',
  },
  {
    question: '¿Cómo puedo pagar?',
    answer: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express) y transferencia bancaria. El pago se procesa de forma segura a través de PayPal.',
  },
]

export default function FAQSection() {
  return (
    <section className="py-20 bg-[#00386c] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Title & CTA */}
          <div>
            <span className="inline-block px-3 py-1 bg-[#c1ebb5] text-[#324f2d] text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4">
              Preguntas frecuentes
            </span>
            <h2
              className="text-3xl lg:text-4xl font-black leading-tight mb-6"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              ¿Tienes dudas? <br />Las respondemos aquí.
            </h2>
            <p className="text-blue-100/80 leading-relaxed mb-8 text-sm lg:text-base max-w-sm">
              Si tu pregunta no está aquí, escríbenos por WhatsApp. Respondemos en menos de una hora en horario de atención.
            </p>
            <a
              href="https://wa.me/521XXXXXXXXXX"
              className="inline-flex items-center gap-2 bg-white text-[#00386c] font-black px-6 py-3 rounded-xl text-sm hover:bg-blue-50 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Hablar por WhatsApp
            </a>
          </div>

          {/* Right: Accordion */}
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="group border-b pb-4 cursor-pointer border-white/20">
                <summary className="flex justify-between items-center font-semibold text-base list-none [&::-webkit-details-marker]:hidden py-1">
                  {faq.question}
                  <span className="text-xl group-open:rotate-45 transition-transform duration-200 flex-shrink-0 ml-4">+</span>
                </summary>
                <div className="pt-3 text-blue-100/80 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

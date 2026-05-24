import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos y Condiciones — Capalsa Store',
  description: 'Términos y condiciones de compra y uso del sitio Capalsa Store.',
  robots: { index: true, follow: true },
}

export default function Page() {
  return (
    <main className="min-h-screen bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-8">
          Términos y Condiciones
        </h1>

        <div className="bg-surface-lowest rounded-[2rem] border border-outline-variant/20 p-8 md:p-12 shadow-sm space-y-8">
          <section className="space-y-3">
            <h2 className="text-2xl font-black text-primary">1. Aceptación</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Al navegar y comprar en Capalsa Store, aceptas estos términos y condiciones, así como nuestro aviso de privacidad.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-black text-primary">2. Productos y disponibilidad</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Los productos publicados están sujetos a disponibilidad con proveedores nacionales o de importación. Si un artículo no está disponible después de tu compra, te contactaremos para ofrecer una alternativa o reembolso.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-black text-primary">3. Pagos, envío y entrega</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Los pagos se procesan mediante PayPal. Los tiempos de entrega dependen del origen del producto, validación del pago y logística de importación o envío nacional.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-black text-primary">4. Cambios y devoluciones</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Las solicitudes de cambio o devolución se revisan conforme a la política publicada en la página de devoluciones. El producto debe conservar sus condiciones originales salvo defecto o daño reportado al recibirlo.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-black text-primary">5. Contacto</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Para dudas sobre una orden, contáctanos desde la página de <Link href="/contacto" className="text-primary font-bold underline">contacto</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

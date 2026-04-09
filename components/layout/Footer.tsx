import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-[var(--color-dark)] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Image src="/logo.png" alt="Capalsa Store" width={140} height={44} className="h-10 w-auto object-contain brightness-0 invert mb-4" />
          <p className="text-sm text-white/60 leading-relaxed">
            Tu tienda de confianza con los mejores productos al mejor precio. Envío gratis en todos tus pedidos.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold mb-3 text-white/90">Ayuda</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/contacto" className="hover:text-[var(--color-brand)] transition-colors">Contacto</Link></li>
            <li><Link href="/envios" className="hover:text-[var(--color-brand)] transition-colors">Envíos y entregas</Link></li>
            <li><Link href="/devoluciones" className="hover:text-[var(--color-brand)] transition-colors">Devoluciones</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold mb-3 text-white/90">Categorías</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/categoria/herramientas" className="hover:text-[var(--color-brand)] transition-colors">Herramientas</Link></li>
            <li><Link href="/categoria/hogar" className="hover:text-[var(--color-brand)] transition-colors">Hogar</Link></li>
            <li><Link href="/categoria/electronica" className="hover:text-[var(--color-brand)] transition-colors">Electrónica</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Capalsa Store. Todos los derechos reservados.
      </div>
    </footer>
  )
}

import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppFloat from '@/components/layout/WhatsAppFloat'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import { db, schema } from '@/lib/db'
import { eq, and, isNull } from 'drizzle-orm'

async function getCategorias() {
  try {
    return await db.select({ nombre: schema.categorias.nombre, slug: schema.categorias.slug })
      .from(schema.categorias)
      .where(eq(schema.categorias.activa, true))
      .orderBy(schema.categorias.orden)
  } catch (error) {
    console.error('Error fetching categories in layout:', error)
    return []
  }
}

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export const revalidate = 600 // Revalidar cada 10 minutos

export const metadata: Metadata = {
  title: 'Capalsa Store — Productos originales desde USA',
  description:
    'Tienda en línea con miles de productos importados directamente desde Amazon USA. Envío garantizado en 7 días hábiles. Facturación completa disponible.',
  keywords: ['tienda online', 'importaciones USA', 'productos originales', 'hogar', 'envío México'],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categorias = await getCategorias()

  return (
    <html lang="es" className={`h-full antialiased ${plusJakarta.variable} ${inter.variable}`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#fbf9f8] text-[#1b1c1c]">
        <AnnouncementBar />
        <Header initialCategories={categorias} />
        <div className="flex-1">{children}</div>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  )
}

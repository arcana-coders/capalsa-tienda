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

const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Capalsa Store',
  url: 'https://www.capalsa.com',
  logo: 'https://www.capalsa.com/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+52-777-408-7291',
    contactType: 'customer service',
    availableLanguage: 'Spanish',
  },
  sameAs: ['https://wa.me/527774087291'],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.capalsa.com'),
  title: {
    default: 'Capalsa Store — Productos originales desde USA',
    template: '%s | Capalsa Store',
  },
  description:
    'Tienda en línea con productos importados directamente desde Amazon USA. Envío garantizado en 7 días hábiles a todo México. Facturación CFDI completa.',
  keywords: ['tienda online', 'importaciones USA', 'productos originales', 'hogar', 'envío México', 'Amazon USA México'],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://www.capalsa.com',
    siteName: 'Capalsa Store',
    title: 'Capalsa Store — Productos originales desde USA',
    description: 'Productos importados directamente desde Amazon USA. Envío a todo México en 7 días. Facturación CFDI.',
    images: [{ url: '/logo.png', width: 1536, height: 485, alt: 'Capalsa Store' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Capalsa Store — Productos originales desde USA',
    description: 'Productos importados directamente desde Amazon USA. Envío a todo México en 7 días.',
  },
  robots: { index: true, follow: true },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categorias = await getCategorias()

  return (
    <html lang="es" className={`h-full antialiased ${plusJakarta.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-surface text-foreground">
        <AnnouncementBar />
        <Header initialCategories={categorias} />
        <div className="flex-1">{children}</div>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  )
}

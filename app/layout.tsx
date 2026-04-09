import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Capalsa Store — Los mejores productos al mejor precio',
  description:
    'Tienda en línea con miles de productos. Herramientas, hogar, electrónica y más. Envío gratis a todo México.',
  keywords: ['tienda online', 'herramientas', 'hogar', 'electrónica', 'envío gratis México'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#1A1A1A]">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}

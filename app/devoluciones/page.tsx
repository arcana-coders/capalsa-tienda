import type { Metadata } from 'next'
import DevolucionesPage from './DevolucionesPage'

export const metadata: Metadata = {
  title: 'Devoluciones y garantías — Capalsa Store',
  description: 'Política de devoluciones de Capalsa Store. Tienes 7 días para reportar cualquier problema con tu pedido.',
}

export default function Page() {
  return <DevolucionesPage />
}

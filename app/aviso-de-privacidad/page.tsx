import type { Metadata } from 'next'
import AvisoDePrivacidadPage from './AvisoDePrivacidadPage'

export const metadata: Metadata = {
  title: 'Aviso de Privacidad — Capalsa Store',
  description: 'Aviso de privacidad de Capalsa Store conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).',
  robots: { index: true, follow: true },
}

export default function Page() {
  return <AvisoDePrivacidadPage />
}

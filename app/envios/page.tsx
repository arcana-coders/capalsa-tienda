import type { Metadata } from 'next'
import EnviosPage from './EnviosPage'

export const metadata: Metadata = {
  title: 'Envíos y entregas — Capalsa Store',
  description: 'Información sobre tiempos de entrega, cobertura y costos de envío a todo México. Entrega en 7 a 10 días hábiles.',
}

export default function Page() {
  return <EnviosPage />
}

import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { newsletter } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const existing = await db.select().from(newsletter).where(eq(newsletter.email, email))
    if (existing.length > 0) {
      return NextResponse.json({ success: true, message: 'Ya estás suscrito a nuestra lista.' })
    }

    await db.insert(newsletter).values({ email })

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Capalsa <contacto@capalsa.com>',
        to: [email],
        subject: '¡Bienvenido a Capalsa! Ya eres parte de la lista 🎉',
        text: `¡Hola!\n\nGracias por suscribirte a Capalsa Store. Serás el primero en enterarte de ofertas exclusivas y nuevos productos.\n\nVisítanos en: https://capalsa.com\n\n— Equipo Capalsa`,
      }).catch(err => console.error('Resend newsletter error:', err))
    }

    return NextResponse.json({ success: true, message: '¡Gracias por suscribirte!' })
  } catch (error) {
    console.error('Error en API de newsletter:', error)
    return NextResponse.json(
      { error: 'No se pudo completar la suscripción. Intenta de nuevo.' },
      { status: 500 }
    )
  }
}

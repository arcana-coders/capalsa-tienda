import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { contactos } from '@/lib/schema'

export async function POST(request: Request) {
  try {
    const { nombre, email, asunto, mensaje } = await request.json()

    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      )
    }

    await db.insert(contactos).values({ nombre, email, asunto, mensaje })

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Capalsa <contacto@capalsa.com>',
        to: ['ryscarrillo@gmail.com'],
        subject: `[Contacto] ${asunto} — ${nombre}`,
        text: `Nuevo mensaje de contacto:\n\nNombre: ${nombre}\nEmail: ${email}\nAsunto: ${asunto}\n\nMensaje:\n${mensaje}`,
      }).catch(err => console.error('Resend contact error:', err))
    }

    return NextResponse.json({
      success: true,
      message: 'Mensaje recibido correctamente. Nos pondremos en contacto contigo pronto.'
    })
  } catch (error) {
    console.error('Error en API de contacto:', error)
    return NextResponse.json(
      { error: 'Hubo un error al procesar tu mensaje. Por favor intenta de nuevo.' },
      { status: 500 }
    )
  }
}

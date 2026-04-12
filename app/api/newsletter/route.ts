import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { newsletter } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' }, 
        { status: 400 }
      )
    }

    // Verificar si ya existe
    const existing = await db.select().from(newsletter).where(eq(newsletter.email, email))
    if (existing.length > 0) {
      return NextResponse.json(
        { 
          success: true,
          message: 'Ya estás suscrito a nuestra lista.' 
        }, 
        { status: 200 }
      )
    }

    // Guardar en la base de datos
    await db.insert(newsletter).values({ email })

    return NextResponse.json({ 
      success: true, 
      message: '¡Gracias por suscribirte!' 
    })
  } catch (error) {
    console.error('Error en API de newsletter:', error)
    return NextResponse.json(
      { error: 'No se pudo completar la suscripción. Intenta de nuevo.' }, 
      { status: 500 }
    )
  }
}

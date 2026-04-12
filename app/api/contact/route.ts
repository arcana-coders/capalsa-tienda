import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contactos } from '@/lib/schema'

export async function POST(request: Request) {
  try {
    const { nombre, email, asunto, mensaje } = await request.json()

    // Validaciones básicas
    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' }, 
        { status: 400 }
      )
    }

    // Guardar en la base de datos
    await db.insert(contactos).values({
      nombre,
      email,
      asunto,
      mensaje
    })

    // TODO: Integrar Resend para notificación por mail si se provee la API Key

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

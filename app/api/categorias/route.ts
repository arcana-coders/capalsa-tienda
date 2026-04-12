import { NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { asc, eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const categorias = await db.select()
      .from(schema.categorias)
      .where(eq(schema.categorias.activa, true))
      .orderBy(asc(schema.categorias.orden), asc(schema.categorias.nombre))

    return NextResponse.json(categorias)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

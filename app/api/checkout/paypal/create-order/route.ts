import { NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';
import { db } from '@/lib/db';
import { productos } from '@/lib/schema';
import { eq, inArray } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Carrito vacío' }, { status: 400 });
    }

    // SEGURIDAD: Validar precios desde la base de datos
    const asins = items.map((i: any) => i.asin);
    const dbProducts = await db.select().from(productos).where(inArray(productos.asin, asins));

    let subtotal = 0;
    items.forEach((cartItem: any) => {
      const dbProduct = dbProducts.find(p => p.asin === cartItem.asin);
      if (dbProduct) {
        subtotal += Number(dbProduct.precio) * cartItem.cantidad;
      }
    });

    // En Capalsa el envío es gratis nacional
    const total = subtotal;

    const order = await createPayPalOrder(items, total);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Error creando orden de PayPal:', error);
    return NextResponse.json({ error: 'Fallo al crear la orden' }, { status: 500 });
  }
}

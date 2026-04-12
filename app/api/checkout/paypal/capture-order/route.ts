import { NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import { db } from '@/lib/db';
import { ordenes } from '@/lib/schema';
import { nanoid } from 'nanoid';
import { sendOrderConfirmation } from '@/lib/resend-utils';

export async function POST(request: Request) {
  try {
    const { orderID, clienteData, items, total } = await request.json();

    if (!orderID) {
      return NextResponse.json({ error: 'Falta ID de orden' }, { status: 400 });
    }

    const captureData = await capturePayPalOrder(orderID);

    if (captureData.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Pago no completado', detail: captureData }, { status: 400 });
    }

    const numeroOrden = `CAP-${nanoid(8).toUpperCase()}`;
    const captureId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? orderID;

    await db.insert(ordenes).values({
      numeroOrden,
      clienteNombre: clienteData?.nombre ?? '',
      clienteEmail: clienteData?.email ?? '',
      clienteTelefono: clienteData?.telefono ?? '',
      clienteDireccion: {
        calle: clienteData?.calle ?? '',
        numExt: clienteData?.numExt ?? '',
        numInt: clienteData?.numInt ?? '',
        colonia: clienteData?.colonia ?? '',
        ciudad: clienteData?.ciudad ?? '',
        estado: clienteData?.estado ?? '',
        cp: clienteData?.cp ?? '',
        referencias: clienteData?.referencias ?? '',
      },
      items: items ?? [],
      subtotal: String(total ?? 0),
      total: String(total ?? 0),
      metodoPago: 'paypal',
      pagoId: captureData.id,
      pagoEstado: 'pagado',
      notas: `PayPal Capture ID: ${captureId}`,
    });

    // Email de confirmación — no bloqueante
    try {
      await sendOrderConfirmation({
        email: clienteData?.email,
        orderNumber: numeroOrden,
        customerName: clienteData?.nombre,
        items: items ?? [],
        total: String(total ?? 0),
        address: {
          calle: clienteData?.calle,
          colonia: clienteData?.colonia,
          ciudad: clienteData?.ciudad,
          estado: clienteData?.estado,
          cp: clienteData?.cp,
        },
      });
    } catch (emailError) {
      console.error('Error enviando email de confirmación:', emailError);
    }

    return NextResponse.json({ ...captureData, numeroOrden });
  } catch (error) {
    console.error('Error capturando orden de PayPal:', error);
    return NextResponse.json({ error: 'Fallo al capturar el pago' }, { status: 500 });
  }
}

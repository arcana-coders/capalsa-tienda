import { NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import { db } from '@/lib/db';
import { ordenes } from '@/lib/schema';
import { nanoid } from 'nanoid';
import { sendOrderConfirmation } from '@/lib/resend-utils';

export async function POST(request: Request) {
  try {
    const { orderID, clienteData } = await request.json();

    if (!orderID) {
      return NextResponse.json({ error: 'Falta ID de orden' }, { status: 400 });
    }

    const captureData = await capturePayPalOrder(orderID);

      // 1. Guardar en Base de Datos
      await db.insert(ordenes).values({
        numeroOrden,
        clienteNombre: clienteData.nombre,
        clienteEmail: clienteData.email,
        clienteTelefono: clienteData.telefono,
        clienteDireccion: {
          calle: clienteData.calle,
          numExt: clienteData.numExt,
          numInt: clienteData.numInt,
          colonia: clienteData.colonia,
          ciudad: clienteData.ciudad,
          estado: clienteData.estado,
          cp: clienteData.cp,
          referencias: clienteData.referencias
        },
        items: purchaseUnit.items || [],
        subtotal: amount.value,
        total: amount.value,
        metodoPago: 'paypal',
        pagoId: captureData.id,
        pagoEstado: 'pagado',
        notas: `PayPal Capture ID: ${captureData.purchase_units[0].payments.captures[0].id}`
      });

      // 2. Enviar Email de Confirmación (asíncrono, no bloqueante)
      // Capturamos el error internamente para no romper la respuesta de éxito
      try {
        await sendOrderConfirmation({
          email: clienteData.email,
          orderNumber: numeroOrden,
          customerName: clienteData.nombre,
          items: purchaseUnit.items || [],
          total: amount.value,
          address: {
            calle: clienteData.calle,
            colonia: clienteData.colonia,
            ciudad: clienteData.ciudad,
            estado: clienteData.estado,
            cp: clienteData.cp
          }
        });
      } catch (emailError) {
        console.error('Error al intentar enviar el email:', emailError);
      }

      // Retornamos también el número de orden para mostrarlo en la página de éxito
      return NextResponse.json({ ...captureData, numeroOrden });
    }
    
    return NextResponse.json(captureData);
  } catch (error: any) {
    console.error('Error capturando orden de PayPal:', error);
    return NextResponse.json({ error: 'Fallo al capturar el pago' }, { status: 500 });
  }
}

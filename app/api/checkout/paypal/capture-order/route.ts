import { NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import { db } from '@/lib/db';
import { ordenes, productos } from '@/lib/schema';
import { nanoid } from 'nanoid';
import { sendOrderConfirmation } from '@/lib/resend-utils';
import { and, eq, inArray } from 'drizzle-orm';

type CartItem = {
  asin?: string;
  cantidad?: number;
};

const DISCOUNT_CODE = 'GRACIAS10';
const DISCOUNT_RATE = 0.1;

function applyDiscount(subtotal: number, couponCode?: string) {
  if (couponCode?.trim().toUpperCase() !== DISCOUNT_CODE) {
    return { discount: 0, total: subtotal, appliedCode: null };
  }

  const discount = Math.round(subtotal * DISCOUNT_RATE * 100) / 100;
  return { discount, total: Math.max(subtotal - discount, 0), appliedCode: DISCOUNT_CODE };
}

function normalizeCart(items: CartItem[]) {
  const quantities = new Map<string, number>();

  for (const item of items) {
    if (!item.asin || typeof item.asin !== 'string') {
      throw new Error('Producto inválido en carrito');
    }

    const quantity = Number(item.cantidad);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new Error('Cantidad inválida en carrito');
    }

    quantities.set(item.asin, (quantities.get(item.asin) ?? 0) + quantity);
  }

  return quantities;
}

async function buildSecureOrderItems(items: CartItem[]) {
  const quantities = normalizeCart(items);
  const asins = Array.from(quantities.keys());
  const dbProducts = await db
    .select({
      id: productos.id,
      asin: productos.asin,
      titulo: productos.titulo,
      precio: productos.precio,
      imagenes: productos.imagenes,
    })
    .from(productos)
    .where(and(inArray(productos.asin, asins), eq(productos.activo, true)));

  if (dbProducts.length !== asins.length) {
    throw new Error('Producto no disponible');
  }

  const secureItems = dbProducts.map((product) => {
    const quantity = quantities.get(product.asin ?? '') ?? 0;
    const images = Array.isArray(product.imagenes) ? product.imagenes : [];

    return {
      productoId: product.id,
      asin: product.asin,
      titulo: product.titulo,
      precio: Number(product.precio),
      cantidad: quantity,
      imagen: images[0] ?? null,
    };
  });

  const subtotal = secureItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  if (subtotal <= 0) {
    throw new Error('Total inválido');
  }

  return { secureItems, subtotal };
}

function getCapturedAmount(captureData: any) {
  return Number(captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value ?? NaN);
}

export async function POST(request: Request) {
  try {
    const { orderID, clienteData, items, couponCode } = await request.json();

    if (!orderID) {
      return NextResponse.json({ error: 'Falta ID de orden' }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Carrito vacío' }, { status: 400 });
    }

    const { secureItems, subtotal } = await buildSecureOrderItems(items);
    const { discount, total, appliedCode } = applyDiscount(subtotal, couponCode);

    const captureData = await capturePayPalOrder(orderID);

    if (captureData.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Pago no completado', detail: captureData }, { status: 400 });
    }

    const numeroOrden = captureData.purchase_units?.[0]?.invoice_id ?? `CAP-${nanoid(8).toUpperCase()}`;
    const captureId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? orderID;
    const capturedAmount = getCapturedAmount(captureData);

    if (!Number.isFinite(capturedAmount) || Math.abs(capturedAmount - total) > 0.01) {
      console.error('Monto PayPal no coincide con total servidor', { orderID, capturedAmount, total });
      return NextResponse.json({ error: 'Monto de pago inválido' }, { status: 409 });
    }

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
      items: secureItems,
      subtotal: String(subtotal ?? 0),
      total: String(total ?? 0),
      metodoPago: 'paypal',
      pagoId: captureData.id,
      pagoEstado: 'pagado',
      notas: `PayPal Capture ID: ${captureId}${appliedCode ? ` | Cupón ${appliedCode}: -${discount}` : ''}`,
    });

    // Email de confirmación — no bloqueante
    try {
      await sendOrderConfirmation({
        email: clienteData?.email,
        orderNumber: numeroOrden,
        customerName: clienteData?.nombre,
        items: secureItems,
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

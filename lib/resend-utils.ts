import { Resend } from 'resend';
import OrderConfirmationEmail from '@/emails/OrderConfirmation';

export async function sendOrderConfirmation({
  email,
  orderNumber,
  customerName,
  items,
  total,
  address
}: any) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY no configurada — email omitido');
    return { success: false };
  }

  if (!email) {
    console.warn(`[CAPALSA] Orden ${orderNumber} sin email de cliente — solo se notificará a tienda.`);
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const itemLines = (items ?? [])
    .map((item: any) => `- ${item.titulo} | ASIN/SKU: ${item.asin ?? 'N/A'} | Cantidad: ${item.cantidad} | Precio: $${item.precio}`)
    .join('\n');
  const addressText = address
    ? [address.calle, address.colonia, address.ciudad, address.estado, address.cp].filter(Boolean).join(', ')
    : 'Sin direccion capturada';

  try {
    let data;
    if (email) {
      const customerEmail = await resend.emails.send({
        from: 'Capalsa <contacto@capalsa.com>',
        to: [email],
        subject: `Confirmación de Pedido: ${orderNumber}`,
        react: OrderConfirmationEmail({
          orderNumber,
          customerName,
          items,
          total,
          address
        }),
      });

      if (customerEmail.error) {
        throw new Error(`Resend cliente: ${customerEmail.error.message}`);
      }

      data = customerEmail.data;
    }

    // Copia de nueva venta a la cuenta de negocio
    const storeEmail = await resend.emails.send({
      from: 'Capalsa <contacto@capalsa.com>',
      to: ['contacto@capalsa.com'],
      subject: `Nueva venta Capalsa: ${orderNumber}`,
      text: `Tienda: Capalsa
Numero de orden: ${orderNumber}
Cliente: ${customerName || 'N/A'}
Email cliente: ${email || 'N/A'}
Direccion: ${addressText}
Total: $${total} MXN

Productos:
${itemLines || 'Sin productos capturados'}`,
    });

    if (storeEmail.error) {
      throw new Error(`Resend tienda: ${storeEmail.error.message}`);
    }

    return { success: true, data: data ?? storeEmail.data };
  } catch (error) {
    console.error('Error enviando email con Resend:', error);
    return { success: false, error };
  }
}

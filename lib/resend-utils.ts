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
      text: `Se ha recibido un nuevo pedido de ${customerName} por un total de $${total} MXN. Número de orden: ${orderNumber}`,
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

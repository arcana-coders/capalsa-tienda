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

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const data = await resend.emails.send({
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

    // Copia de nueva venta a la cuenta de negocio
    await resend.emails.send({
      from: 'Capalsa <contacto@capalsa.com>',
      to: ['contacto@capalsa.com'],
      subject: `NUEVA VENTA: ${orderNumber}`,
      text: `Se ha recibido un nuevo pedido de ${customerName} por un total de ${total} MXN.`,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error enviando email con Resend:', error);
    return { success: false, error };
  }
}

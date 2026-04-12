import { Resend } from 'resend';
import OrderConfirmationEmail from '@/emails/OrderConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation({ 
  email, 
  orderNumber, 
  customerName, 
  items, 
  total, 
  address 
}: any) {
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

    // También enviamos una copia a Arturo (Master)
    await resend.emails.send({
      from: 'Capalsa <contacto@capalsa.com>',
      to: ['ryscarrillo@gmail.com'], // Email principal de Arturo segun perfil
      subject: `NUEVA VENTA: ${orderNumber}`,
      text: `Se ha recibido un nuevo pedido de ${customerName} por un total de ${total} MXN.`,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error enviando email con Resend:', error);
    return { success: false, error };
  }
}

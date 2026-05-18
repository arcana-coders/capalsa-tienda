import { Resend } from 'resend';

const STORE_EMAIL = 'contacto@capalsa.com';
const PAYPAL_ENV = process.env.PAYPAL_ENV || (process.env.NODE_ENV === 'production' ? 'live' : 'sandbox');
const IS_SANDBOX = PAYPAL_ENV !== 'live';
const SANDBOX_ORDER_EMAIL = process.env.SANDBOX_ORDER_EMAIL || STORE_EMAIL;

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatMoney(value: unknown) {
  return `$${Number(value || 0).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} MXN`;
}

function buildAddressText(address?: Record<string, any>) {
  return address
    ? [
      [address.calle, address.numExt].filter(Boolean).join(' '),
      address.colonia ? `Col. ${address.colonia}` : '',
      address.ciudad,
      address.estado,
      address.cp ? `CP ${address.cp}` : '',
      address.referencias ? `Referencias: ${address.referencias}` : '',
    ].filter(Boolean).join(', ')
    : 'Sin direccion capturada';
}

function productRows(items: any[]) {
  return (items ?? []).map((item: any) => {
    const quantity = Number(item.cantidad || item.quantity || 0);
    const price = Number(item.precio || item.unit_amount?.value || 0);
    const lineTotal = price * quantity;

    return `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #e5e7eb;">
          <div style="font-weight:700;color:#111827;line-height:1.45;">${escapeHtml(item.titulo || item.name || 'Producto')}</div>
          <div style="font-size:12px;color:#6b7280;margin-top:5px;">ASIN/SKU: ${escapeHtml(item.asin || 'N/A')}</div>
        </td>
        <td style="padding:16px 12px;border-bottom:1px solid #e5e7eb;text-align:center;color:#111827;font-weight:700;">${quantity}</td>
        <td style="padding:16px 0;border-bottom:1px solid #e5e7eb;text-align:right;color:#111827;font-weight:700;white-space:nowrap;">${formatMoney(lineTotal)}</td>
      </tr>
    `;
  }).join('');
}

function orderEmailHtml({
  orderNumber,
  customerName,
  email,
  phone,
  items,
  total,
  discount,
  couponCode,
  addressText,
  storeCopy = false,
}: {
  orderNumber: string;
  customerName?: string;
  email?: string;
  phone?: string;
  items: any[];
  total: unknown;
  discount?: unknown;
  couponCode?: string | null;
  addressText: string;
  storeCopy?: boolean;
}) {
  const hasDiscount = Boolean(couponCode) && Number(discount || 0) > 0;

  return `
    <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
      <div style="max-width:720px;margin:0 auto;padding:28px 16px;">
        ${IS_SANDBOX ? `
          <div style="background:#fff7ed;color:#9a3412;border:1px solid #fed7aa;border-radius:12px;padding:12px 16px;margin-bottom:16px;font-size:13px;font-weight:700;">
            MODO SANDBOX: pago de prueba, no dinero real.
          </div>
        ` : ''}

        <div style="background:#00386c;color:#ffffff;border-radius:18px 18px 0 0;padding:24px;">
          <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;opacity:.85;">CAPALSA</div>
          <div style="font-size:28px;font-weight:900;margin-top:8px;">${storeCopy ? 'Nueva venta recibida' : 'Gracias por tu compra'}</div>
          <div style="font-size:15px;line-height:1.6;margin-top:10px;opacity:.9;">
            ${storeCopy ? 'Datos operativos del pedido para preparar envio.' : `Hola ${escapeHtml(customerName || 'cliente')}, recibimos tu pago correctamente.`}
          </div>
        </div>

        <div style="background:#ffffff;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 18px 18px;padding:24px;">
          <div style="display:block;background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;padding:18px;margin-bottom:22px;">
            <div style="font-size:12px;color:#6b7280;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Numero de pedido</div>
            <div style="font-size:22px;color:#00386c;font-weight:800;margin-top:4px;">${escapeHtml(orderNumber)}</div>
          </div>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:22px;">
            <tr>
              <td style="vertical-align:top;">
                <div style="font-size:12px;color:#6b7280;font-weight:700;text-transform:uppercase;">Cliente</div>
                <div style="font-size:15px;color:#111827;font-weight:700;margin-top:6px;">${escapeHtml(customerName || 'N/A')}</div>
                <div style="font-size:14px;color:#374151;margin-top:4px;">${escapeHtml(email || 'N/A')}</div>
                <div style="font-size:14px;color:#374151;margin-top:4px;"><strong>Telefono:</strong> ${escapeHtml(phone || 'N/A')}</div>
              </td>
            </tr>
            <tr>
              <td style="vertical-align:top;padding-top:16px;">
                <div style="font-size:12px;color:#6b7280;font-weight:700;text-transform:uppercase;">Direccion de envio</div>
                <div style="font-size:14px;color:#374151;line-height:1.5;margin-top:6px;">${escapeHtml(addressText)}</div>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
            <thead>
              <tr>
                <th align="left" style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;padding-bottom:8px;border-bottom:2px solid #e5e7eb;">Producto</th>
                <th align="center" style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;padding-bottom:8px;border-bottom:2px solid #e5e7eb;">Cant.</th>
                <th align="right" style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;padding-bottom:8px;border-bottom:2px solid #e5e7eb;">Importe</th>
              </tr>
            </thead>
            <tbody>
              ${productRows(items) || '<tr><td colspan="3" style="padding:16px 0;color:#6b7280;">Sin productos capturados</td></tr>'}
            </tbody>
          </table>

          <div style="margin-top:22px;background:#ecfdf5;border:1px solid #bbf7d0;border-radius:14px;padding:18px;text-align:right;">
            ${hasDiscount ? `
              <div style="font-size:13px;color:#047857;font-weight:700;margin-bottom:10px;">
                Descuento aplicado: ${escapeHtml(couponCode)} - ${formatMoney(discount)}
              </div>
            ` : ''}
            <div style="font-size:12px;color:#047857;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Total pagado</div>
            <div style="font-size:28px;color:#006c4a;font-weight:900;margin-top:4px;">${formatMoney(total)}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function sendOrderConfirmation({
  email,
  phone,
  orderNumber,
  customerName,
  items,
  total,
  discount,
  couponCode,
  address,
}: any) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY no configurada — email omitido');
    return { success: false };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const subjectPrefix = IS_SANDBOX ? '[SANDBOX] ' : '';
  const storeRecipientEmail = IS_SANDBOX ? SANDBOX_ORDER_EMAIL : STORE_EMAIL;
  const addressText = buildAddressText(address);
  const hasDiscount = Boolean(couponCode) && Number(discount || 0) > 0;
  const itemLines = (items ?? [])
    .map((item: any) => `- ${item.titulo || item.name} | ASIN/SKU: ${item.asin ?? 'N/A'} | Cantidad: ${item.cantidad || item.quantity} | Precio: $${item.precio || item.unit_amount?.value}`)
    .join('\n');
  const textBody = `${IS_SANDBOX ? 'MODO SANDBOX: pago de prueba, no dinero real.\n\n' : ''}Tienda: Capalsa
Numero de orden: ${orderNumber}
Cliente: ${customerName || 'N/A'}
Email cliente: ${email || 'N/A'}
Telefono cliente: ${phone || 'N/A'}
Direccion: ${addressText}
${hasDiscount ? `Descuento aplicado: ${couponCode} - ${formatMoney(discount)}\n` : ''}Total: ${formatMoney(total)}

Productos:
${itemLines || 'Sin productos capturados'}`;

  try {
    if (email) {
      const customerEmail = await resend.emails.send({
        from: `Capalsa <${STORE_EMAIL}>`,
        to: [email],
        subject: `${subjectPrefix}Confirmacion de Pedido: ${orderNumber}`,
        html: orderEmailHtml({ orderNumber, customerName, email, phone, items, total, discount, couponCode, addressText }),
        text: textBody,
      });

      if (customerEmail.error) {
        throw new Error(`Resend cliente: ${customerEmail.error.message}`);
      }
    }

    const storeEmail = await resend.emails.send({
      from: `Capalsa <${STORE_EMAIL}>`,
      to: [storeRecipientEmail],
      subject: `${subjectPrefix}Nueva venta Capalsa: ${orderNumber}`,
      html: orderEmailHtml({ orderNumber, customerName, email, phone, items, total, discount, couponCode, addressText, storeCopy: true }),
      text: textBody,
    });

    if (storeEmail.error) {
      throw new Error(`Resend tienda: ${storeEmail.error.message}`);
    }

    return { success: true, data: storeEmail.data };
  } catch (error) {
    console.error('Error enviando email con Resend:', error);
    return { success: false, error };
  }
}

/**
 * Utilidades de servidor para integración con PayPal REST API v2
 */

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

/**
 * Obtiene el token de acceso OAuth2 para llamadas a la API
 */
export async function getPayPalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('Faltan credenciales de PayPal en .env.local');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    cache: 'no-store', // No queremos cachear el token
  });

  const data = await response.json();
  return data.access_token;
}

/**
 * Crea una orden en PayPal
 */
export async function createPayPalOrder(items: any[], subtotal: number, clienteData?: any) {
  const accessToken = await getPayPalAccessToken();

  // Pre-cargar datos del comprador para que PayPal no pida dirección de facturación
  let payer: Record<string, any> | undefined;
  if (clienteData?.nombre) {
    const parts = clienteData.nombre.trim().split(' ');
    const givenName = parts[0] || 'Cliente';
    const surname = parts.slice(1).join(' ') || '.';
    payer = {
      name: { given_name: givenName, surname },
      ...(clienteData.email && { email_address: clienteData.email }),
      address: {
        address_line_1: [clienteData.calle, clienteData.numExt].filter(Boolean).join(' '),
        admin_area_2: clienteData.ciudad || '',
        admin_area_1: clienteData.estado || '',
        postal_code: clienteData.cp || '',
        country_code: 'MX',
      },
    };
  }

  const response = await fetch(`${BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      application_context: {
        shipping_preference: 'NO_SHIPPING',
      },
      ...(payer && { payer }),
      purchase_units: [
        {
          amount: {
            currency_code: 'MXN',
            value: subtotal.toFixed(2),
          },
        },
      ],
    }),
  });

  return await response.json();
}

/**
 * Captura un pago aprobado
 */
export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return await response.json();
}

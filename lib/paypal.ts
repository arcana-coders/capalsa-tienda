/**
 * Utilidades de servidor para integración con PayPal REST API v2
 */

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const EXPLICIT_PAYPAL_ENV = process.env.PAYPAL_ENV;
const PAYPAL_ENV = EXPLICIT_PAYPAL_ENV || (process.env.NODE_ENV === 'production' ? 'live' : 'sandbox');
const PAYPAL_API_URLS = {
  live: 'https://api-m.paypal.com',
  sandbox: 'https://api-m.sandbox.paypal.com',
} as const;

const BASE_URL = EXPLICIT_PAYPAL_ENV
  ? PAYPAL_API_URLS[PAYPAL_ENV === 'live' ? 'live' : 'sandbox']
  : process.env.PAYPAL_API_URL || PAYPAL_API_URLS[PAYPAL_ENV === 'live' ? 'live' : 'sandbox'];

export function getPayPalEnvironment() {
  return PAYPAL_ENV === 'live' ? 'live' : 'sandbox';
}

type PayPalItem = {
  asin?: string | null;
  titulo?: string | null;
  precio: number;
  cantidad: number;
};

type PayPalOrderMetadata = {
  storeName: string;
  orderNumber: string;
};

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
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Error obteniendo token de PayPal');
  }

  return data.access_token;
}

/**
 * Crea una orden en PayPal
 */
function buildPurchaseUnit(items: PayPalItem[], total: number, metadata?: PayPalOrderMetadata) {
  const paypalItems = items.map((item) => ({
    name: String(item.titulo || 'Producto').slice(0, 127),
    sku: String(item.asin || item.titulo || 'producto').slice(0, 127),
    quantity: String(item.cantidad),
    unit_amount: {
      currency_code: 'MXN',
      value: Number(item.precio).toFixed(2),
    },
  }));
  const itemTotal = items.reduce((sum, item) => sum + Number(item.precio) * Number(item.cantidad), 0);
  const discount = Math.max(itemTotal - total, 0);
  const description = `${metadata?.storeName || 'Capalsa'} - ${paypalItems.map((item) => item.name).join(', ')}`;

  return {
    ...(metadata?.orderNumber && { invoice_id: metadata.orderNumber }),
    ...(metadata?.storeName && { custom_id: `${metadata.storeName} ${metadata.orderNumber}`.slice(0, 127) }),
    description: description.slice(0, 127),
    amount: {
      currency_code: 'MXN',
      value: total.toFixed(2),
      breakdown: {
        item_total: {
          currency_code: 'MXN',
          value: itemTotal.toFixed(2),
        },
        ...(discount > 0 && {
          discount: {
            currency_code: 'MXN',
            value: discount.toFixed(2),
          },
        }),
      },
    },
    items: paypalItems,
  };
}

export async function createPayPalOrder(items: PayPalItem[], subtotal: number, clienteData?: any, metadata?: PayPalOrderMetadata) {
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
        buildPurchaseUnit(items, subtotal, metadata),
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

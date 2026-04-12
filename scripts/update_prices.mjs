import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { pgTable, text, numeric } from 'drizzle-orm/pg-core'
import { eq } from 'drizzle-orm'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, '../.env.local')

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=')
    if (key && value.length) {
      process.env[key.trim()] = value.join('=').trim()
    }
  })
}

// Schema duplicado para el script
const productos = pgTable('productos', {
  asin: text('asin').unique(),
  precio: numeric('precio', { precision: 10, scale: 2 }).notNull(),
  precioCompare: numeric('precio_compare', { precision: 10, scale: 2 }),
})

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL no definida en .env.local')
  process.exit(1)
}

const sql = neon(DATABASE_URL)
const db = drizzle(sql)

// Parámetros de la fórmula (Extraídos de C:\\robots\\capalsa-importer\\.env)
const TAX_TEXAS = 1.08
const IMPORT_FEE = 1.25
const TC_USD_MXN = 19
const ENVIO_MXN = 250
const GANANCIA = 1.30

const calcularPrecio = (costoUSD) =>
  ((costoUSD * TAX_TEXAS * IMPORT_FEE * TC_USD_MXN + ENVIO_MXN) * GANANCIA).toFixed(2)

const updates = [
  { asin: 'B084GHW5DR', usd: 59 },
  { asin: 'B079ZL7M45', usd: 29 },
  { asin: 'B0004JKJS0', usd: 20 },
]

async function main() {
  console.log('🚀 Iniciando actualización de precios en Neon...')
  console.log(`💱 Fórmula: ((USD × ${TAX_TEXAS} × ${IMPORT_FEE}) × ${TC_USD_MXN} + ${ENVIO_MXN}) × ${GANANCIA}`)

  for (const item of updates) {
    const precioMXN = calcularPrecio(item.usd)
    console.log(`📦 ASIN: ${item.asin} | USD: $${item.usd} -> MXN: $${precioMXN}`)

    try {
      const result = await db.update(productos)
        .set({ 
          precio: precioMXN,
          precioCompare: null // Comportamiento estándar del importador
        })
        .where(eq(productos.asin, item.asin))
        .returning()

      if (result.length > 0) {
        console.log(`✅ Actualizado correctamente.`)
      } else {
        console.log(`⚠️  No se encontró el producto con ASIN ${item.asin}`)
      }
    } catch (err) {
      console.error(`❌ Error al actualizar ${item.asin}:`, err.message)
    }
  }

  process.exit(0)
}

main()

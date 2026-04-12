import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema.js'

// Conexión HTTP serverless — ideal para Vercel Edge/Serverless functions
const sql = neon(process.env.DATABASE_URL)
export const db = drizzle(sql, { schema })

export { schema }

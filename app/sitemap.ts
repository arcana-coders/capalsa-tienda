import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { productos } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE = 'https://www.capalsa.com'

  const activos = await db
    .select({ slug: productos.slug, actualizadoEn: productos.actualizadoEn })
    .from(productos)
    .where(eq(productos.activo, true))

  const productUrls: MetadataRoute.Sitemap = activos.map((p) => ({
    url: `${BASE}/producto/${p.slug}`,
    lastModified: p.actualizadoEn ?? new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const staticUrls: MetadataRoute.Sitemap = [
    { url: BASE,                      lastModified: new Date(), changeFrequency: 'daily',  priority: 1.0 },
    { url: `${BASE}/categorias`,      lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/contacto`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/envios`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/devoluciones`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  return [...staticUrls, ...productUrls]
}

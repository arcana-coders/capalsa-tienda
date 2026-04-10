import { pgTable, uuid, text, numeric, boolean, integer, jsonb, timestamp } from 'drizzle-orm/pg-core'

export const categorias = pgTable('categorias', {
  id:        uuid('id').primaryKey().defaultRandom(),
  nombre:    text('nombre').notNull(),
  slug:      text('slug').unique().notNull(),
  padreId:   uuid('padre_id').references(() => categorias.id),
  imagenUrl: text('imagen_url'),
  emoji:     text('emoji'),
  activa:    boolean('activa').default(true),
  orden:     integer('orden').default(0),
  creadoEn:  timestamp('creado_en').defaultNow(),
})

export const productos = pgTable('productos', {
  id:             uuid('id').primaryKey().defaultRandom(),
  asin:           text('asin').unique(),
  titulo:         text('titulo').notNull(),
  slug:           text('slug').unique().notNull(),
  descripcion:    text('descripcion'),
  bullets:        jsonb('bullets'),               // string[]
  precio:         numeric('precio', { precision: 10, scale: 2 }).notNull(),
  precioCompare:  numeric('precio_compare', { precision: 10, scale: 2 }),
  categoriaId:    uuid('categoria_id').references(() => categorias.id),
  marca:          text('marca'),
  imagenes:       jsonb('imagenes'),              // string[] — URLs en R2
  destacado:      boolean('destacado').default(false),
  activo:         boolean('activo').default(true),
  creadoEn:       timestamp('creado_en').defaultNow(),
  actualizadoEn:  timestamp('actualizado_en').defaultNow(),
})

export const ordenes = pgTable('ordenes', {
  id:               uuid('id').primaryKey().defaultRandom(),
  numeroOrden:      text('numero_orden').unique().notNull(),
  clienteNombre:    text('cliente_nombre').notNull(),
  clienteEmail:     text('cliente_email').notNull(),
  clienteTelefono:  text('cliente_telefono'),
  clienteDireccion: jsonb('cliente_direccion'),   // { calle, ciudad, estado, cp, referencias }
  items:            jsonb('items'),               // [{ productoId, titulo, precio, cantidad, imagen }]
  subtotal:         numeric('subtotal', { precision: 10, scale: 2 }),
  envio:            numeric('envio', { precision: 10, scale: 2 }).default('0'),
  total:            numeric('total', { precision: 10, scale: 2 }),
  metodoPago:       text('metodo_pago'),          // 'mercadopago' | 'paypal'
  pagoId:           text('pago_id'),
  pagoEstado:       text('pago_estado').default('pendiente'), // pendiente | pagado | rechazado
  notas:            text('notas'),
  creadoEn:         timestamp('creado_en').defaultNow(),
})

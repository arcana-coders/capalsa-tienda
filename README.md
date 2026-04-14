# Capalsa Store — E-commerce de Alto Rendimiento

Este proyecto es la implementación de referencia para las tiendas e-commerce premium de Arturo Carrillo. Diseñado para escala masiva (77+ productos actualmente, meta 10k+) con un enfoque en **costo cero de mantenimiento** y **rendimiento extremo**.

## 🚀 Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Base de Datos**: Neon PostgreSQL (Serverless)
- **ORM**: Drizzle ORM
- **Estilos**: Tailwind CSS v4 + GSAP (Animaciones)
- **Pagos**: PayPal Smart Buttons (Server-side validation)
- **Infraestructura**: Desplegado en Vercel con imágenes en Cloudflare R2.

## 🛠️ Optimización y Estabilidad (Log de Ingeniería)

### Histórico de Mejoras Técnicas (Abril 2026)

Para garantizar la estabilidad del blueprint, se implementaron las siguientes mejoras tras detectar un consumo excesivo de memoria (15GB heap crash) en el entorno de desarrollo:

1.  **Estrategia ISR (Vercel Cost Optimization)**:
    - Se eliminó `force-dynamic` en favor de `revalidate = 600`.
    - Las páginas se sirven desde el CDN de Vercel, reduciendo las llamadas a la base de datos y el tiempo de ejecución de Serverless Functions a niveles mínimos.
    
2.  **Protección de Memoria (Column Projection)**:
    - Optimizamos las consultas de Drizzle en Home, Categorías y Búsqueda.
    - **Cambio**: Dejamos de pedir el objeto completo (`.select()`) para pedir solo los campos de la card (`id, titulo, precio, slug, imagenes`). 
    - **Resultado**: Evitamos la carga masiva de miles de reseñas y descripciones pesadas en las páginas de listado, estabilizando el consumo de RAM.

3.  **Remoción de Waterfalls (Pre-loading)**:
    - La carga de categorías del menú se movió del cliente (`useEffect`) al servidor (`RootLayout`). 
    - La navegación ahora es instantánea y no presenta latencia visual al cargar.

4.  **Robustez de UI y Animaciones (GSAP fromTo)**:
    - Se detectó un fallo en el escalado de opacidad de GSAP que dejaba elementos "faded" tras la hidratación en React.
    - **Lección**: Usar siempre `gsap.fromTo` en ScrollTrigger para forzar el estado final del 100%. Evitar colores de bajo contraste (grises claros) en fondos blancos para evitar la sensación de "desvanecimiento" en pantallas de alta resolución.

## 📖 Documentación Relacionada

- [Manual Maestro (Blueprint)](file:///c:/Asistente/blueprint-tienda-premium.md)
- [Catálogo de MCPs](file:///c:/Asistente/mcp_catalog.md)

---
*Mantenido por Rocket para Arturo Carrillo.*

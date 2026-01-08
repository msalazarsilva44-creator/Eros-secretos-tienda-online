-- Migraciones de base de datos para Eros Secretos
-- Este archivo contiene scripts para actualizar la estructura de la base de datos

-- Asegurar que la tabla products tiene soporte para imágenes (ya está incluido en schema.sql)
-- Pero si tienes una BD antigua, ejecuta esto:
-- ALTER TABLE products ADD COLUMN image_url VARCHAR(500) AFTER is_active;

-- Actualizar productos existentes con rutas de imágenes por defecto
-- Esto es opcional, solo si ya tienes productos sin imagen
-- UPDATE products SET image_url = '/placeholder.svg' WHERE image_url IS NULL OR image_url = '';

-- Índices adicionales para optimización
CREATE INDEX IF NOT EXISTS idx_products_image ON products(image_url);

-- Historial de cambios:
-- 2025-10-27: Agregado soporte para carga de imágenes con multer
--             - Campo image_url ya existía en la tabla products
--             - Ahora soporta rutas como /uploads/product-timestamp.jpg

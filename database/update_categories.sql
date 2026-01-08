-- Script para actualizar categorías en la base de datos existente
-- Eliminar categorías que no se usarán más

-- 1. Primero, eliminar productos asociados a Accesorios y Productos (opcional)
-- DELETE FROM product_attributes WHERE product_id IN (SELECT id FROM products WHERE category_id IN (SELECT id FROM categories WHERE name IN ('Productos', 'Accesorios')));
-- DELETE FROM product_images WHERE product_id IN (SELECT id FROM products WHERE category_id IN (SELECT id FROM categories WHERE name IN ('Productos', 'Accesorios')));
-- DELETE FROM products WHERE category_id IN (SELECT id FROM categories WHERE name IN ('Productos', 'Accesorios'));

-- 2. Eliminar las categorías Productos y Accesorios
DELETE FROM categories WHERE name IN ('Productos', 'Accesorios');

-- 3. Corregir el nombre de Lencería (en caso de que esté mal)
UPDATE categories SET name = 'Lencería' WHERE slug = 'lenceria';

-- 4. Verificar que las categorías correctas existen
-- SELECT * FROM categories;

-- Resultado esperado: Solo estas 3 categorías
-- - Juguetes
-- - Lencería
-- - Bienestar

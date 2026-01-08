-- Script para corregir categorías con encoding UTF-8
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Eliminar categorías no deseadas
DELETE FROM categories WHERE name LIKE '%Productos%' OR name LIKE '%Accesorios%';

-- Corregir Lencería (eliminando la versión mal codificada)
DELETE FROM categories WHERE slug = 'lenceria';

-- Insertar la categoría con el nombre correcto
INSERT INTO categories (name, slug, description) VALUES ('Lencería', 'lenceria', 'Lencería sexy y sensual');

-- Verificar resultado
SELECT id, name, slug FROM categories ORDER BY id;

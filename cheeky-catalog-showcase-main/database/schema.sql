-- Schema de Base de Datos para Eros Secretos
-- Creado: 2024
-- Descripción: Sistema de gestión de productos, juguetes y accesorios

CREATE DATABASE IF NOT EXISTS eros_secretos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eros_secretos;

-- Tabla de usuarios (para autenticación del dashboard)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de categorías (Productos, Juguetes, Accesorios, Lencería, Bienestar, etc.)
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla principal de productos (genérica para productos, juguetes, accesorios)
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id INT NOT NULL,
  stock INT DEFAULT 0,
  is_new BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de atributos específicos de productos
-- Almacena: Talla, Color, Modelo para productos
-- Almacena: Uso, Talla, Medida para juguetes
CREATE TABLE IF NOT EXISTS product_attributes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  attribute_name VARCHAR(50) NOT NULL, -- 'talla', 'color', 'modelo', 'uso', 'medida'
  attribute_value VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de imágenes adicionales (para tener múltiples imágenes por producto)
CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para mejorar performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_product_attributes_product ON product_attributes(product_id);
CREATE INDEX idx_product_images_product ON product_images(product_id);

-- Insertar datos iniciales
-- Usuario admin por defecto (password: alessa2028)
INSERT INTO users (name, email, password, role) VALUES 
('Administrador', 'admin@erossecretos.com', '$2b$10$FsGabgNxj7UPFZie15oxK.IjpES7Zan/Gi7/TK2AXOLnMJsSV7VUa', 'admin');

-- Categorías por defecto
INSERT INTO categories (name, slug, description) VALUES
('Juguetes', 'juguetes', 'Juguetes y vibradores'),
('Lencería', 'lenceria', 'Lencería sexy y sensual'),
('Bienestar', 'bienestar', 'Productos de bienestar y cuidado');

-- Productos de ejemplo (juguetes con sus atributos específicos)
INSERT INTO products (name, description, price, category_id, is_new, is_featured, is_active, image_url, stock) VALUES
('Vibrador Luxury Plus', 'Vibrador de alta calidad con múltiples velocidades', 45000, 2, TRUE, TRUE, TRUE, '/placeholder.svg', 15),
('Conjunto Encaje Premium', 'Conjunto sexy de encaje con corpiño y tanga', 35000, 1, TRUE, TRUE, TRUE, '/placeholder.svg', 20),
('Aceite de Masaje Sensual', 'Aceite para masajes sensuales y relajantes', 18000, 5, FALSE, FALSE, TRUE, '/placeholder.svg', 30),
('Anillo Vibrador Couples', 'Anillo vibrador para parejas', 28000, 2, FALSE, FALSE, TRUE, '/placeholder.svg', 12);

-- Atributos de productos de ejemplo
-- Para el vibrador (juguete)
INSERT INTO product_attributes (product_id, attribute_name, attribute_value) VALUES
(1, 'uso', 'Externo e Interno'),
(1, 'talla', 'Mediano'),
(1, 'medida', '20cm largo, 3.5cm diámetro'),
(1, 'material', 'Silicona médica'),
(1, 'control', 'Inalámbrico con 7 velocidades');

-- Para el conjunto (producto)
INSERT INTO product_attributes (product_id, attribute_name, attribute_value) VALUES
(2, 'talla', 'S, M, L (disponible)'),
(2, 'color', 'Negro encaje'),
(2, 'modelo', 'BJ-2024-Premium'),
(2, 'material', 'Encaje y malla elástica');

-- Para el aceite (accesorio/producto)
INSERT INTO product_attributes (product_id, attribute_name, attribute_value) VALUES
(3, 'talla', '100ml'),
(3, 'color', 'Transparente con olor a rosas'),
(3, 'modelo', 'Aceite Masaje Sensual'),
(3, 'ingredientes', 'Natural, hipoalergénico');

-- Para el anillo (juguete)
INSERT INTO product_attributes (product_id, attribute_name, attribute_value) VALUES
(4, 'uso', 'Parejas - Anillo'),
(4, 'talla', 'Ajustable (números 8-11)'),
(4, 'medida', 'Base 3cm x anillo ajustable'),
(4, 'control', 'Inalámbrico con 5 modos');

-- Guardar las URLs de las imágenes (como placeholders)
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
(1, '/placeholder.svg', TRUE, 1),
(2, '/placeholder.svg', TRUE, 1),
(3, '/placeholder.svg', TRUE, 1),
(4, '/placeholder.svg', TRUE, 1);



import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function debugDB() {
    console.log('🐞 Iniciando depuración de DB...');

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306
        });

        console.log('✅ Conectado a MySQL Server');

        const dbName = process.env.DB_NAME || 'eros_secretos';

        // 1. Borrar base de datos si existe (Clean Slate)
        console.log(`🗑️  Borrando base de datos ${dbName} si existe...`);
        await connection.query(`DROP DATABASE IF EXISTS ${dbName}`);
        console.log('✅ Base de datos borrada (o no existía)');

        // 2. Crear base de datos
        console.log(`✨ Creando base de datos ${dbName}...`);
        await connection.query(`CREATE DATABASE ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        console.log('✅ Base de datos creada');

        // 3. Usar base de datos
        await connection.query(`USE ${dbName}`);

        // 4. Crear tabla users
        console.log('Creating table: users');
        await connection.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

        // 5. Crear tabla categories
        console.log('Creating table: categories');
        await connection.query(`
      CREATE TABLE categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

        // 6. Crear tabla products
        console.log('Creating table: products');
        await connection.query(`
      CREATE TABLE products (
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
    `);

        // 7. Insertar datos básicos
        console.log('🌱 Insertando datos semilla...');

        // Admin user
        await connection.query(`
      INSERT INTO users (name, email, password, role) VALUES 
      ('Administrador', 'admin@erossecretos.com', '$2b$10$FsGabgNxj7UPFZie15oxK.IjpES7Zan/Gi7/TK2AXOLnMJsSV7VUa', 'admin');
    `);

        // Categories
        await connection.query(`
      INSERT INTO categories (name, slug, description) VALUES
      ('Juguetes', 'juguetes', 'Juguetes y vibradores'),
      ('Lencería', 'lenceria', 'Lencería sexy y sensual'),
      ('Bienestar', 'bienestar', 'Productos de bienestar y cuidado');
    `);

        // Products
        await connection.query(`
      INSERT INTO products (name, description, price, category_id, is_new, is_featured, is_active, image_url, stock) VALUES
      ('Vibrador Luxury Plus', 'Vibrador de alta calidad', 45000, 1, TRUE, TRUE, TRUE, '/placeholder.svg', 15),
      ('Conjunto Encaje Premium', 'Conjunto sexy', 35000, 2, TRUE, TRUE, TRUE, '/placeholder.svg', 20);
    `);

        console.log('✅ ¡Base de datos recreada y poblada exitosamente!');

        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error fatal:', error);
        process.exit(1);
    }
}

debugDB();

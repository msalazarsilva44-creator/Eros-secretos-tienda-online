
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Forzar carga desde .env en el directorio actual
dotenv.config({ path: path.join(__dirname, '.env') });

async function repairDB() {
    const dbName = process.env.DB_NAME || 'eros_shop';
    console.log(`🔧 Reparando DB: ${dbName} (Puerto: ${process.env.DB_PORT})`);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: dbName,
            port: process.env.DB_PORT || 3307
        });

        console.log('✅ Conectado a MySQL');

        // Crear tablas faltantes
        console.log('🛠️  Creando tablas faltantes...');

        await connection.query(`
      CREATE TABLE IF NOT EXISTS product_attributes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        attribute_name VARCHAR(50) NOT NULL,
        attribute_value VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

        await connection.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

        console.log('✅ Tablas creadas/verificadas');

        // Desactivar checks de llaves foraneas
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        console.log('🗑️  Vaciando todas las tablas de productos...');
        await connection.query('TRUNCATE TABLE product_attributes');
        await connection.query('TRUNCATE TABLE product_images');
        await connection.query('TRUNCATE TABLE products');

        // Reactivar checks
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('✨ Base de datos reparada y vaciada exitosamente.');

        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error reparando DB:', error);
        process.exit(1);
    }
}

repairDB();

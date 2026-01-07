
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Forzar carga desde .env en el directorio actual
dotenv.config({ path: path.join(__dirname, '.env') });

async function cleanProducts() {
    const dbName = process.env.DB_NAME || 'eros_shop';
    console.log(`🧹 Iniciando limpieza de productos en DB: ${dbName} (Puerto: ${process.env.DB_PORT})`);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: dbName,
            port: process.env.DB_PORT || 3307
        });

        console.log('✅ Conectado a MySQL');

        // Desactivar checks de llaves foraneas
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        console.log('🗑️  Vaciando tabla product_attributes...');
        await connection.query('TRUNCATE TABLE product_attributes');

        console.log('🗑️  Vaciando tabla product_images...');
        await connection.query('TRUNCATE TABLE product_images');

        console.log('🗑️  Vaciando tabla products...');
        await connection.query('TRUNCATE TABLE products');

        // Reactivar checks
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('✨ Tablas vaciadas correctamente. Ahora no hay productos.');

        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error limpiando productos:', error);
        process.exit(1);
    }
}

cleanProducts();

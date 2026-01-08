
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkCategories() {
    const dbName = process.env.DB_NAME || 'eros_shop';
    console.log(`🔍 Verificando categorías en DB: ${dbName}`);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: dbName,
            port: process.env.DB_PORT || 3307
        });

        const [rows] = await connection.execute('SELECT * FROM categories');
        console.log('📊 Categorías encontradas:', rows);

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkCategories();

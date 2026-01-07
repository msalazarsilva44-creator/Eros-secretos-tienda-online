
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function removeCategory() {
    const dbName = process.env.DB_NAME || 'eros_shop';
    console.log(`🗑️  Eliminando 'Bienestar' de DB: ${dbName}`);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: dbName,
            port: process.env.DB_PORT || 3307
        });

        console.log('✅ Conectado a MySQL');

        // Buscar si existe, por nombre o slug
        const [rows] = await connection.execute(
            "SELECT id FROM categories WHERE slug = 'bienestar' OR name = 'Bienestar'"
        );

        if (rows.length > 0) {
            console.log(`🔍 Encontrada categoría 'Bienestar' con ID: ${rows[0].id}`);

            // Eliminar productos asociados primero (si quedaron)
            await connection.execute('DELETE FROM products WHERE category_id = ?', [rows[0].id]);
            console.log('🗑️  Productos asociados eliminados');

            // Eliminar la categoría
            await connection.execute('DELETE FROM categories WHERE id = ?', [rows[0].id]);
            console.log("✨ Categoría 'Bienestar' eliminada exitosamente");
        } else {
            console.log("⚠️  No se encontró la categoría 'Bienestar'");
        }

        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

removeCategory();


import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDB() {
    const schemaPath = path.join(__dirname, '../database/schema.sql');

    console.log(`📖 Leyendo schema desde: ${schemaPath}`);

    try {
        const sql = fs.readFileSync(schemaPath, 'utf8');

        // Crear conexión sin seleccionar DB primero para poder crearla si no existe
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
            multipleStatements: true
        });

        console.log('✅ Conectado a MySQL');

        // Ejecutar el script SQL completo
        // Nota: schema.sql ya incluye CREATE DATABASE IF NOT EXISTS y USE eros_secretos
        await connection.query(sql);

        console.log('🚀 Schema importado exitosamente!');

        // Verificar tablas
        await connection.query('USE eros_secretos');
        const [rows] = await connection.query('SHOW TABLES');
        console.log('📊 Tablas creadas:', rows.map(r => Object.values(r)[0]).join(', '));

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error inicializando DB:', error);
        process.exit(1);
    }
}

initDB();

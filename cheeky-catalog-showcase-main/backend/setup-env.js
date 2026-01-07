
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = `PORT=8001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=eros_shop
DB_PORT=3307
JWT_SECRET=tu_super_secreto_jwt_key_2024
CORS_ORIGIN=http://localhost:3001
NODE_ENV=development
`;

fs.writeFileSync(path.join(__dirname, '.env'), envContent);
console.log('✅ .env actualizado correctamente');
console.log(envContent);

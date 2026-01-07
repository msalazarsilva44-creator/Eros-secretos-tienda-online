# Backend API - Eros Secretos

Backend API REST para el dashboard administrativo de Eros Secretos.

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
cd backend
npm install
```

### 2. Configurar Base de Datos

1. Instala MySQL en tu sistema
2. Ejecuta el archivo `database/schema.sql` para crear la base de datos:

```bash
mysql -u root -p < database/schema.sql
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `backend`:

```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=eros_secretos
DB_PORT=3306

# Configuración del Servidor
PORT=8001
NODE_ENV=development

# JWT Secret (cambiar en producción)
JWT_SECRET=tu_secret_jwt_muy_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3001
```

### 4. Iniciar el Servidor

```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:8001`

## 📋 Endpoints

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token
- `GET /api/auth/profile` - Obtener perfil

### Productos

- `GET /api/products` - Listar todos los productos (público)
- `GET /api/products/:id` - Obtener un producto (público)
- `POST /api/products` - Crear producto (requiere admin)
- `PUT /api/products/:id` - Actualizar producto (requiere admin)
- `DELETE /api/products/:id` - Eliminar producto (requiere admin)

### Categorías

- `GET /api/categories` - Listar categorías (público)
- `GET /api/categories/all` - Listar todas las categorías (requiere admin)

## 🔐 Credenciales por Defecto

```
Email: admin@eros-secretos.com
Password: admin123
```

**⚠️ IMPORTANTE**: Cambia la contraseña en producción.

## 🏗️ Estructura

```
backend/
├── config/
│   ├── database.js    # Configuración de MySQL
│   └── auth.js        # JWT y autenticación
├── routes/
│   ├── auth.js        # Rutas de autenticación
│   ├── products.js    # Rutas de productos
│   └── categories.js  # Rutas de categorías
├── .env               # Variables de entorno
├── package.json
└── server.js          # Servidor principal
```

## 🔧 Dependencias

- **express**: Framework web
- **mysql2**: Cliente MySQL
- **bcrypt**: Hash de contraseñas
- **jsonwebtoken**: JWT para autenticación
- **cors**: CORS headers
- **dotenv**: Variables de entorno

## 📝 Notas

- El backend usa ES Modules (`type: "module"` en package.json)
- Puerto por defecto: 8001
- Se requiere autenticación JWT para operaciones de admin
- La base de datos incluye datos de ejemplo


# Guía de Configuración - Eros Secretos Dashboard

## 📋 Resumen

Este documento explica cómo configurar y acceder al dashboard de administración de Eros Secretos.

## 🔧 Requisitos Previos

- Node.js instalado
- MySQL instalado y funcionando
- npm o yarn

## 🚀 Instalación y Setup

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd cheeky-catalog-showcase-main
```

### 2. Instalar dependencias

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

### 3. Configurar la base de datos

**Crear la base de datos y usuario admin:**
```bash
mysql -u root -p < database/schema.sql
```

Este comando:
- Crea la base de datos `eros_secretos`
- Crea las tablas necesarias (users, products, categories, etc.)
- Inserta el usuario administrador con:
  - **Email:** `admin@erossecretos.com`
  - **Contraseña:** `alessa2028`

### 4. Configurar variables de entorno

**Backend (.env)** - El archivo ya existe en `backend/.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=eros_secretos
DB_PORT=3306
PORT=8001
NODE_ENV=development
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
CORS_ORIGIN=http://localhost:3001
```

Si tu MySQL tiene contraseña, actualiza `DB_PASSWORD`.

## 🎯 Iniciar la Aplicación

### Terminal 1: Backend (Puerto 8001)
```bash
cd backend
npm run dev
```

Verás:
```
✅ Conexión a MySQL establecida
🚀 Servidor escuchando en http://localhost:8001
📊 API disponible en http://localhost:8001/api
```

### Terminal 2: Frontend (Puerto 3001)
```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:3001`

## 🔐 Credenciales de Acceso

**Usuario Administrador:**
- **Email:** `admin@erossecretos.com`
- **Contraseña:** `alessa2028`

## 📊 Acceder al Dashboard

1. Ve a `http://localhost:3001`
2. Ingresa las credenciales de administrador
3. ¡Accedes al dashboard!

## 🎨 Funcionalidades del Dashboard

- ✅ Ver lista de productos
- ✅ Crear nuevos productos
- ✅ Editar productos existentes
- ✅ Eliminar productos
- ✅ Gestionar categorías
- ✅ Subir imágenes
- ✅ Cerrar sesión

## 🐛 Solución de Problemas

### Error: "Credenciales inválidas"

**Solución:**
1. Verifica que el usuario existe en MySQL:
   ```sql
   SELECT * FROM users WHERE email = 'admin@erossecretos.com';
   ```

2. Si no existe, ejecuta el schema nuevamente:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

3. Verifica que el backend esté corriendo en puerto 8001:
   ```bash
   curl http://localhost:8001
   ```

### Error: "No se puede conectar con el servidor"

**Solución:**
1. Verifica que MySQL está corriendo
2. Verifica las credenciales en `backend/.env`
3. Reinicia el servidor backend:
   ```bash
   cd backend && npm run dev
   ```

### Error: "ERR_CONNECTION_REFUSED"

**Solución:**
1. Verifica que ambos servidores están corriendo:
   - Backend: `http://localhost:8001` (debe responder)
   - Frontend: `http://localhost:3001` (debe cargar)

2. Si los puertos están ocupados, mata los procesos:
   ```bash
   # Windows
   taskkill /F /IM node.exe
   
   # Linux/Mac
   lsof -ti:8001,3001 | xargs kill -9
   ```

## 📝 Scripts Disponibles

**Frontend:**
```bash
npm run dev      # Iniciar en desarrollo
npm run build    # Compilar para producción
npm run preview  # Previsualizar build
npm run lint     # Ejecutar linter
```

**Backend:**
```bash
npm run dev      # Iniciar con auto-reload
npm run start    # Iniciar en producción
```

## 🔐 Cambiar Credenciales del Admin

Si necesitas cambiar la contraseña del administrador:

1. Abre una terminal en `backend/`
2. Ejecuta:
   ```bash
   node create-admin.js
   ```
3. Copia el hash generado
4. Ejecuta en MySQL:
   ```sql
   UPDATE users SET password = '[HASH_AQUI]' WHERE email = 'admin@erossecretos.com';
   ```

## 📚 Estructura del Proyecto

```
cheeky-catalog-showcase-main/
├── backend/
│   ├── config/
│   │   ├── auth.js        # Configuración JWT
│   │   └── database.js    # Conexión MySQL
│   ├── routes/
│   │   ├── auth.js        # Rutas de autenticación
│   │   ├── products.js    # Rutas de productos
│   │   └── categories.js  # Rutas de categorías
│   ├── server.js          # Servidor principal
│   └── package.json
├── src/
│   ├── pages/
│   │   ├── Login.tsx      # Página de login
│   │   └── Dashboard.tsx  # Panel de administración
│   ├── components/
│   ├── hooks/
│   │   └── useAuth.ts     # Hook de autenticación
│   ├── lib/
│   │   └── api.ts         # Cliente HTTP
│   └── types/
│       └── index.ts       # Tipos TypeScript
├── database/
│   └── schema.sql         # Schema de la BD
└── package.json
```

## 🎓 Notas Técnicas

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Express.js + MySQL2 + JWT
- **Autenticación:** Token JWT con expiración de 24h
- **Base de Datos:** MySQL con estructura relacional

## 📞 Soporte

Para más información o reportar problemas, contacta al equipo de desarrollo.

# 🚀 Inicio Rápido - Eros Secretos Catalog

## Configuración del Proyecto

### 1. Puertos Configurados
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:8001
- **Variables**: `.env.local` (ya creado)

### 2. Ejecutar en Desarrollo

```bash
npm run dev
```

### 3. Abrir en Navegador
http://localhost:3001

---

## 📋 Comandos Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

---

## 📁 Estructura Rápida

- **src/pages**: Páginas principales
- **src/components**: Componentes reutilizables
- **src/components/ui**: Componentes shadcn-ui
- **src/hooks**: Custom hooks
- **src/lib**: Utilidades
- **tailwind.config.ts**: Configuración de estilos
- **vite.config.ts**: Configuración de Vite (puerto 3001)

---

## 🔧 Integración con Backend

Tu API debe estar corriendo en: **http://localhost:8001**

Ejemplo de request desde el código:
```typescript
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const response = await fetch(baseUrl + '/api/products');
```

---

## 📦 Dependencias Principales
- React 18.3.1
- Vite 5.4.19
- TypeScript 5.8.3
- Tailwind CSS 3.4.17
- React Query 5.83.0
- React Hook Form 7.61.1
- React Router v6.30.1
- shadcn-ui + Radix UI

---

## ✅ Status
✅ Listo para desarrollo local
ℹ️ Backend debe configurarse en puerto 8001

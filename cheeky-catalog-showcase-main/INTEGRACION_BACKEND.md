# 🔗 Guía de Integración Backend - Frontend 3001/Backend 8001

## 📋 Información de Conexión

| Item | Valor |
|------|-------|
| **Frontend URL** | http://localhost:3001 |
| **Backend URL** | http://localhost:8001 |
| **Variable de Entorno** | VITE_API_BASE_URL |
| **Configurada en** | .env.local |

---

## 🚀 Inicio Rápido

### 1. Verifica que tu Backend está en puerto 8001
```bash
# Prueba la conexión
curl http://localhost:8001
```

### 2. Inicia el Frontend
```bash
cd C:\Proyectos\Eros Secretos\cheeky-catalog-showcase-main
npm run dev
```

### 3. Abre en navegador
http://localhost:3001

---

## 📡 Configuración CORS en Backend

Tu backend **DEBE** permitir CORS desde http://localhost:3001

### Ejemplo: Node.js/Express
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Tus rutas aquí...
app.listen(8001, () => console.log('Backend en puerto 8001'));
```

### Ejemplo: Python/Flask
```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": "http://localhost:3001",
        "methods": ["GET", "POST", "PUT", "DELETE", "PATCH"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

if __name__ == '__main__':
    app.run(port=8001)
```

### Ejemplo: PHP/Laravel
```php
// config/cors.php
'allowed_origins' => ['http://localhost:3001'],
'allowed_origins_patterns' => [],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

---

## 🔄 Patrones de Integración

### Patrón 1: Fetch Directo (Simple)
```typescript
// src/pages/Index.tsx
import { useState, useEffect } from 'react';

const Index = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/products`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="grid grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};
```

### Patrón 2: React Query (RECOMENDADO - Ya instalado)
```typescript
// src/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/products`
      );
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10,   // 10 minutos (antes cacheTime)
  });
};

// src/pages/Index.tsx
import { useProducts } from '@/hooks/useProducts';

const Index = () => {
  const { data: products = [], isLoading, error } = useProducts();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};
```

### Patrón 3: Con Interceptor de Token (Autenticación)
```typescript
// src/lib/api.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expirado
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

// Uso:
const products = await apiCall('/api/products');
```

---

## 📊 Endpoints Esperados

### Productos
```
GET /api/products
Response: 
[
  {
    "id": 1,
    "name": "Vibrador Luxury Plus",
    "price": 45000,
    "category": "Juguetes",
    "image": "/path/to/image.jpg",
    "isNew": true
  },
  ...
]
```

### Categorías
```
GET /api/categories
Response:
["Juguetes", "Lencería", "Bienestar", "Accesorios"]
```

### Detalles de Producto
```
GET /api/products/:id
Response:
{
  "id": 1,
  "name": "Vibrador Luxury Plus",
  "price": 45000,
  "category": "Juguetes",
  "image": "/path/to/image.jpg",
  "description": "...",
  "stock": 10,
  "isNew": true
}
```

---

## 🔐 Autenticación

### Login
```typescript
const login = async (email: string, password: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }
  );

  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};
```

### Headers con Token
```typescript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
};
```

---

## 🧪 Testing de Conectividad

### 1. Verificar que Backend está corriendo
```bash
# Windows PowerShell
Test-NetConnection -ComputerName localhost -Port 8001

# Linux/Mac
nc -zv localhost 8001
```

### 2. Prueba API desde el navegador
```javascript
// En la consola del navegador (F12)
fetch('http://localhost:8001/api/products')
  .then(r => r.json())
  .then(console.log)
```

### 3. Verificar CORS
```javascript
// En la consola del navegador
fetch('http://localhost:8001/api/products')
  .then(r => r.json())
  .catch(e => console.error('CORS Error:', e))
```

---

## 🐛 Troubleshooting

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Solución**: Habilita CORS en tu backend (ver sección anterior)

### Error: "Failed to fetch"
**Solución**: Verifica que:
1. Backend está corriendo en puerto 8001
2. Usa la URL correcta en VITE_API_BASE_URL
3. No hay firewall bloqueando la conexión

### Error: 401 Unauthorized
**Solución**: 
- Verifica que el token sea válido
- Incluye el token en headers: `Authorization: Bearer <token>`

### Timeout / Lentitud
**Solución**:
- Aumenta el timeout de fetch:
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos

fetch(url, { signal: controller.signal })
  .finally(() => clearTimeout(timeoutId))
```

---

## 📚 Recursos

- [Fetch API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [React Query Docs](https://tanstack.com/query/latest)
- [CORS Explicado](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Environment Variables en Vite](https://vitejs.dev/guide/env-and-mode.html)

---

## ✅ Checklist de Integración

- [ ] Backend corriendo en puerto 8001
- [ ] CORS habilitado en backend
- [ ] Variables `.env.local` configuradas
- [ ] API endpoints documentados
- [ ] Autenticación implementada (si aplica)
- [ ] Error handling en frontend
- [ ] Loading states implementados
- [ ] Testing de endpoints completado

---

*Última actualización: 27 de Octubre 2025*

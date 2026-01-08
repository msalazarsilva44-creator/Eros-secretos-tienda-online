# Directorio de Imágenes - Eros Secretos

Este directorio contiene todas las imágenes de productos subidas por el administrador.

## 📁 Estructura

```
uploads/
├── product-timestamp-random.jpg
├── product-timestamp-random.png
└── product-timestamp-random.webp
```

## 📤 Cómo se Usan

1. Cuando subes una imagen en el dashboard, se almacena aquí con un nombre único
2. El backend guarda la ruta en la base de datos (`/uploads/producto-imagen.jpg`)
3. El frontend accede a la imagen a través de la URL `/uploads/imagen.jpg`

## 🔍 Formatos Soportados

- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ WebP (.webp)

## ⚙️ Límites

- **Tamaño máximo:** 5MB por imagen
- **Formatos:** Solo imágenes

## 🗑️ Limpieza

- Las imágenes antiguas se eliminan automáticamente cuando actualizas un producto
- Para limpiar manualmente, elimina archivos no utilizados

## ⚡ Notas de Rendimiento

- Las imágenes se sirven como archivos estáticos (muy rápido)
- Se pueden optimizar las imágenes manualmente para mejor performance
- Considera usar imagen comprimidas para mejorar tiempos de carga

---

**Creado:** Octubre 27, 2025
**Sistema:** Eros Secretos Dashboard

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';
import { authenticateToken, requireAdmin } from '../config/auth.js';

const router = express.Router();

// Configurar multer para subir imágenes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

// Asegurar que el directorio existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Crear nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Aceptar solo imágenes
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se aceptan imágenes'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});

// Obtener todos los productos (público)
router.get('/', async (req, res) => {
  try {
    const [products] = await pool.execute(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = TRUE
      ORDER BY p.created_at DESC
    `);

    // Obtener atributos para cada producto
    const productsWithAttributes = await Promise.all(
      products.map(async (product) => {
        const [attributes] = await pool.execute(
          'SELECT attribute_name, attribute_value FROM product_attributes WHERE product_id = ?',
          [product.id]
        );

        return {
          ...product,
          attributes: attributes.reduce((acc, attr) => {
            acc[attr.attribute_name] = attr.attribute_value;
            return acc;
          }, {})
        };
      })
    );

    res.json(productsWithAttributes);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ 
      message: 'Error al obtener productos' 
    });
  }
});

// Obtener un producto por ID (público)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await pool.execute(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);

    if (products.length === 0) {
      return res.status(404).json({ 
        message: 'Producto no encontrado' 
      });
    }

    const product = products[0];

    // Obtener atributos
    const [attributes] = await pool.execute(
      'SELECT attribute_name, attribute_value FROM product_attributes WHERE product_id = ?',
      [id]
    );

    // Obtener imágenes
    const [images] = await pool.execute(
      'SELECT image_url, is_primary FROM product_images WHERE product_id = ?',
      [id]
    );

    res.json({
      ...product,
      attributes: attributes.reduce((acc, attr) => {
        acc[attr.attribute_name] = attr.attribute_value;
        return acc;
      }, {}),
      images
    });
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ 
      message: 'Error al obtener producto' 
    });
  }
});

// Crear producto (requiere admin)
router.post('/', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    let { 
      name, 
      description, 
      price, 
      category_id, 
      stock, 
      is_new, 
      is_featured, 
      image_url,
      attributes 
    } = req.body;

    // Convertir FormData strings a tipos correctos
    price = parseFloat(price);
    category_id = parseInt(category_id);
    stock = parseInt(stock) || 0;
    is_new = is_new === 'true' || is_new === true;
    is_featured = is_featured === 'true' || is_featured === true;

    if (!name || !price || !category_id) {
      return res.status(400).json({ 
        message: 'Nombre, precio y categoría son requeridos' 
      });
    }

    // Validar que la categoría existe
    const [categoryExists] = await pool.execute(
      'SELECT id FROM categories WHERE id = ?',
      [category_id]
    );

    if (categoryExists.length === 0) {
      return res.status(400).json({ 
        message: 'La categoría seleccionada no existe',
        validCategories: 'Juguetes, Lencería, Bienestar'
      });
    }

    // Determinar la URL de la imagen
    let finalImageUrl = image_url || null;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    const [result] = await pool.execute(
      `INSERT INTO products (name, description, price, category_id, stock, is_new, is_featured, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description || null, price, category_id, stock, is_new ? 1 : 0, is_featured ? 1 : 0, finalImageUrl]
    );

    const productId = result.insertId;

    // Insertar atributos si existen
    if (attributes && typeof attributes === 'object') {
      const attributeEntries = Object.entries(attributes);
      for (const [key, value] of attributeEntries) {
        await pool.execute(
          'INSERT INTO product_attributes (product_id, attribute_name, attribute_value) VALUES (?, ?, ?)',
          [productId, key, value]
        );
      }
    }

    res.status(201).json({ 
      message: 'Producto creado exitosamente',
      id: productId,
      image_url: finalImageUrl
    });
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ 
      message: 'Error al crear producto',
      error: error.message
    });
  }
});

// Actualizar producto (requiere admin)
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    let { 
      name, 
      description, 
      price, 
      category_id, 
      stock, 
      is_new, 
      is_featured, 
      is_active,
      image_url,
      attributes 
    } = req.body;

    // Convertir FormData strings a tipos correctos
    price = parseFloat(price);
    category_id = parseInt(category_id);
    stock = parseInt(stock) || 0;
    is_new = is_new === 'true' || is_new === true;
    is_featured = is_featured === 'true' || is_featured === true;
    is_active = is_active === 'true' || is_active === true || true; // default true

    // Validar que la categoría existe
    const [categoryExists] = await pool.execute(
      'SELECT id FROM categories WHERE id = ?',
      [category_id]
    );

    if (categoryExists.length === 0) {
      return res.status(400).json({ 
        message: 'La categoría seleccionada no existe',
        validCategories: 'Juguetes, Lencería, Bienestar'
      });
    }

    // Obtener el producto actual para conservar la imagen si no se actualiza
    const [currentProduct] = await pool.execute(
      'SELECT image_url FROM products WHERE id = ?',
      [id]
    );

    let finalImageUrl = image_url || currentProduct[0]?.image_url || null;
    
    // Si hay una nueva imagen, usar su ruta
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
      
      // Eliminar imagen anterior si existe
      if (currentProduct[0]?.image_url && currentProduct[0].image_url.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', currentProduct[0].image_url);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error eliminando imagen anterior:', err);
        });
      }
    }

    await pool.execute(
      `UPDATE products 
       SET name = ?, description = ?, price = ?, category_id = ?, 
           stock = ?, is_new = ?, is_featured = ?, is_active = ?, image_url = ?
       WHERE id = ?`,
      [name, description, price, category_id, stock, is_new ? 1 : 0, is_featured ? 1 : 0, is_active ? 1 : 0, finalImageUrl, id]
    );

    // Actualizar atributos
    if (attributes && typeof attributes === 'object') {
      // Eliminar atributos existentes
      await pool.execute(
        'DELETE FROM product_attributes WHERE product_id = ?',
        [id]
      );

      // Insertar nuevos atributos
      const attributeEntries = Object.entries(attributes);
      for (const [key, value] of attributeEntries) {
        await pool.execute(
          'INSERT INTO product_attributes (product_id, attribute_name, attribute_value) VALUES (?, ?, ?)',
          [id, key, value]
        );
      }
    }

    res.json({ 
      message: 'Producto actualizado exitosamente',
      image_url: finalImageUrl
    });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ 
      message: 'Error al actualizar producto',
      error: error.message
    });
  }
});

// Eliminar producto (requiere admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.execute(
      'DELETE FROM products WHERE id = ?',
      [id]
    );

    res.json({ 
      message: 'Producto eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ 
      message: 'Error al eliminar producto' 
    });
  }
});

export default router;


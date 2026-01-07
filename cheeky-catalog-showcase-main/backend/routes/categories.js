import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireAdmin } from '../config/auth.js';

const router = express.Router();

// Obtener todas las categorías (público)
router.get('/', async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT * FROM categories WHERE is_active = TRUE ORDER BY name'
    );

    res.json(categories.map(cat => cat.name));
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ 
      message: 'Error al obtener categorías' 
    });
  }
});

// Obtener categorías con detalles (para admin)
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT * FROM categories ORDER BY name'
    );

    res.json(categories);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ 
      message: 'Error al obtener categorías' 
    });
  }
});

export default router;


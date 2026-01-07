import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/database.js';
import { generateToken, authenticateToken } from '../config/auth.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    const user = users[0];

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    // Generar token
    const token = generateToken(user.id, user.email, user.role);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      message: 'Error al iniciar sesión' 
    });
  }
});

// Verificar token
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    // Obtener datos completos del usuario desde la BD
    const [users] = await pool.execute(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    res.json({ 
      valid: true, 
      user: users[0]
    });
  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(500).json({ 
      message: 'Error al verificar token' 
    });
  }
});

// Obtener perfil
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ 
      message: 'Error al obtener perfil' 
    });
  }
});

export default router;


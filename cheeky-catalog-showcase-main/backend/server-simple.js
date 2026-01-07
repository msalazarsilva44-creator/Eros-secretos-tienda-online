import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

// Datos mock para desarrollo sin base de datos
const mockUser = {
  id: 1,
  name: 'Administrador',
  email: 'admin@eros-secretos.com',
  role: 'admin'
};

const mockProducts = [
  { 
    id: 1, 
    name: "Vibrador Luxury Plus", 
    description: "Vibrador de alta calidad con múltiples velocidades",
    price: 45000, 
    category_id: 2,
    category_name: "Juguetes",
    category_slug: "juguetes",
    stock: 15,
    is_new: true, 
    is_featured: true, 
    is_active: true, 
    image_url: "/placeholder.svg",
    attributes: {
      uso: "Externo e Interno",
      talla: "Mediano",
      medida: "20cm largo, 3.5cm diámetro"
    }
  },
  { 
    id: 2, 
    name: "Conjunto Encaje Premium", 
    description: "Conjunto sexy de encaje con corpiño y tanga",
    price: 35000, 
    category_id: 1,
    category_name: "Productos",
    category_slug: "productos",
    stock: 20,
    is_new: true, 
    is_featured: true, 
    is_active: true, 
    image_url: "/placeholder.svg",
    attributes: {
      talla: "S, M, L (disponible)",
      color: "Negro encaje",
      modelo: "BJ-2024-Premium"
    }
  }
];

const mockCategories = ["Productos", "Juguetes", "Accesorios", "Lencería", "Bienestar"];

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Eros Secretos funcionando (modo demo)',
    mode: 'Mock Data - Sin base de datos',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories'
    },
    note: 'Para funcionalidad completa, configura MySQL'
  });
});

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      message: 'Email y contraseña son requeridos' 
    });
  }

  // Credenciales demo
  if (email === 'admin@eros-secretos.com' && password === 'admin123') {
    const token = 'mock-jwt-token-' + Date.now();
    res.json({
      token,
      user: mockUser
    });
  } else {
    res.status(401).json({ 
      message: 'Credenciales inválidas' 
    });
  }
});

app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  res.json({ 
    valid: true, 
    user: mockUser 
  });
});

app.get('/api/auth/profile', (req, res) => {
  res.json(mockUser);
});

// Products Routes
app.get('/api/products', (req, res) => {
  res.json(mockProducts);
});

app.get('/api/products/:id', (req, res) => {
  const product = mockProducts.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    id: mockProducts.length + 1,
    ...req.body,
    is_active: true
  };
  mockProducts.push(newProduct);
  res.status(201).json({
    message: 'Producto creado exitosamente',
    id: newProduct.id
  });
});

app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockProducts.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  mockProducts[index] = { ...mockProducts[index], ...req.body };
  res.json({ message: 'Producto actualizado exitosamente' });
});

app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockProducts.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  mockProducts.splice(index, 1);
  res.json({ message: 'Producto eliminado exitosamente' });
});

// Categories Routes
app.get('/api/categories', (req, res) => {
  res.json(mockCategories);
});

app.get('/api/categories/all', (req, res) => {
  res.json(mockCategories);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);
  console.log(`⚠️  Modo: Demo (sin base de datos)`);
  console.log(`💡 Usa credenciales: admin@eros-secretos.com / admin123`);
});


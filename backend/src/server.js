require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const productosRouter = require('./routes/productos');
const reseñasRouter = require('./routes/reseñas');
const visitasRouter = require('./routes/visitas');
const configRouter = require('./routes/config');
const heroImagenesRouter = require('./routes/hero-imagenes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middlewares globales ────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);

// ─── Rutas ───────────────────────────────────────────────────────────────────
app.use('/api/productos', productosRouter);
app.use('/api/resenas', reseñasRouter);
app.use('/api/visitas', visitasRouter);
app.use('/api/config', configRouter);
app.use('/api/hero-imagenes', heroImagenesRouter);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🎀 Servidor de Lazos funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// Manejador de errores global
app.use(errorHandler);

// ─── Conexión a MongoDB ───────────────────────────────────────────────────────
const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('\n✅ Conectado a MongoDB Atlas');
  } catch (err) {
    console.error('❌ Error al conectar a MongoDB:', err.message);
    process.exit(1);
  }
};

// ─── Iniciar servidor ─────────────────────────────────────────────────────────
conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log('\n┌──────────────────────────────────────────┐');
    console.log('│     🎀  SERVIDOR DE LAZOS ACTIVO          │');
    console.log('├──────────────────────────────────────────┤');
    console.log(`│  🚀 Puerto    : ${PORT}`);
    console.log(`│  🌍 Entorno   : ${process.env.NODE_ENV || 'development'}`);
    console.log(`│  🗄️  Base datos: MongoDB Atlas`);
    console.log(`│  🖼️  Imágenes  : Cloudinary`);
    console.log('└──────────────────────────────────────────┘\n');
  });
});

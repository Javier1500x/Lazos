const express = require('express');
const router = express.Router();
const HeroImagen = require('../models/HeroImagen');
const { upload, cloudinary, subirACloudinary } = require('../config/cloudinary');

// GET /api/hero-imagenes — obtener imágenes activas del hero (público)
router.get('/', async (req, res, next) => {
  try {
    const imagenes = await HeroImagen.find({ activa: true }).sort({ orden: 1, createdAt: -1 }).limit(6);
    res.json({ success: true, data: imagenes });
  } catch (err) {
    next(err);
  }
});

// GET /api/hero-imagenes/admin — todas las imágenes (admin)
router.get('/admin', async (req, res, next) => {
  try {
    const imagenes = await HeroImagen.find().sort({ orden: 1, createdAt: -1 });
    res.json({ success: true, data: imagenes });
  } catch (err) {
    next(err);
  }
});

// POST /api/hero-imagenes — subir nueva imagen al hero
router.post('/', upload.single('imagen'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Imagen requerida' });
    }

    const resultado = await subirACloudinary(req.file.buffer, 'lazos/hero');

    const imagen = await HeroImagen.create({
      url: resultado.secure_url,
      publicId: resultado.public_id,
      titulo: req.body.titulo || '',
      subtitulo: req.body.subtitulo || '',
      orden: parseInt(req.body.orden) || 0,
    });

    res.status(201).json({ success: true, data: imagen });
  } catch (err) {
    next(err);
  }
});

// PUT /api/hero-imagenes/:id — editar imagen
router.put('/:id', async (req, res, next) => {
  try {
    const imagen = await HeroImagen.findById(req.params.id);
    if (!imagen) {
      return res.status(404).json({ success: false, message: 'Imagen no encontrada' });
    }

    const { titulo, subtitulo, orden, activa } = req.body;
    if (titulo !== undefined) imagen.titulo = titulo;
    if (subtitulo !== undefined) imagen.subtitulo = subtitulo;
    if (orden !== undefined) imagen.orden = parseInt(orden);
    if (activa !== undefined) imagen.activa = activa === 'true' || activa === true;

    await imagen.save();
    res.json({ success: true, data: imagen });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/hero-imagenes/:id — eliminar imagen
router.delete('/:id', async (req, res, next) => {
  try {
    const imagen = await HeroImagen.findById(req.params.id);
    if (!imagen) {
      return res.status(404).json({ success: false, message: 'Imagen no encontrada' });
    }

    // Eliminar de Cloudinary
    await cloudinary.uploader.destroy(imagen.publicId).catch(() => {});

    await imagen.deleteOne();
    res.json({ success: true, message: 'Imagen eliminada' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

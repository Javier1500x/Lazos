const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const Producto = require('../models/Producto');
const { upload, cloudinary, subirACloudinary } = require('../config/cloudinary');

// Helper para manejar errores de validación
const validar = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ success: false, errores: errores.array() });
  }
  next();
};

// GET /api/productos — todos los productos activos (público)
router.get('/', async (req, res, next) => {
  try {
    const { seccion } = req.query;
    const filtro = { activo: true };
    if (seccion) filtro.seccion = seccion;

    const productos = await Producto.find(filtro).sort({ orden: 1, createdAt: -1 });
    res.json({ success: true, data: productos });
  } catch (err) {
    next(err);
  }
});

// GET /api/productos/admin — todos (incluyendo inactivos) para admin
router.get('/admin', async (req, res, next) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    res.json({ success: true, data: productos });
  } catch (err) {
    next(err);
  }
});

// GET /api/productos/:id — detalle de un producto
router.get(
  '/:id',
  param('id').isMongoId().withMessage('ID inválido'),
  validar,
  async (req, res, next) => {
    try {
      const producto = await Producto.findById(req.params.id);
      if (!producto) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }
      res.json({ success: true, data: producto });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/productos — crear producto con imágenes
router.post(
  '/',
  upload.array('imagenes', 6),
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio').trim(),
    body('precio')
      .isFloat({ min: 0 })
      .withMessage('El precio debe ser un número positivo'),
    body('descripcion').optional().trim(),
    body('seccion')
      .optional()
      .isIn(['hero', 'catalogo', 'destacado']),
  ],
  validar,
  async (req, res, next) => {
    try {
      const { nombre, precio, descripcion, seccion, orden } = req.body;

      // Subir imágenes a Cloudinary
      const imagenes = [];
      for (let i = 0; i < (req.files || []).length; i++) {
        const resultado = await subirACloudinary(req.files[i].buffer);
        imagenes.push({
          url: resultado.secure_url,
          publicId: resultado.public_id,
          esPortada: i === 0,
        });
      }

      const producto = await Producto.create({
        nombre,
        precio: parseFloat(precio),
        descripcion,
        seccion,
        orden: orden ? parseInt(orden) : 0,
        imagenes,
      });

      res.status(201).json({ success: true, data: producto });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/productos/:id — editar producto
router.put(
  '/:id',
  upload.array('imagenes', 6),
  param('id').isMongoId().withMessage('ID inválido'),
  validar,
  async (req, res, next) => {
    try {
      const producto = await Producto.findById(req.params.id);
      if (!producto) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }

      const { nombre, precio, descripcion, seccion, activo, orden } = req.body;

      if (nombre !== undefined) producto.nombre = nombre;
      if (precio !== undefined) producto.precio = parseFloat(precio);
      if (descripcion !== undefined) producto.descripcion = descripcion;
      if (seccion !== undefined) producto.seccion = seccion;
      if (activo !== undefined) producto.activo = activo === 'true' || activo === true;
      if (orden !== undefined) producto.orden = parseInt(orden);

      // Subir y agregar nuevas imágenes
      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const resultado = await subirACloudinary(req.files[i].buffer);
          producto.imagenes.push({
            url: resultado.secure_url,
            publicId: resultado.public_id,
            esPortada: producto.imagenes.length === 0 && i === 0,
          });
        }
      }

      await producto.save();
      res.json({ success: true, data: producto });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/productos/:id/portada/:publicId — marcar imagen como portada
router.patch(
  '/:id/portada/:publicId',
  param('id').isMongoId().withMessage('ID inválido'),
  validar,
  async (req, res, next) => {
    try {
      const producto = await Producto.findById(req.params.id);
      if (!producto) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }

      const publicId = decodeURIComponent(req.params.publicId);
      producto.imagenes = producto.imagenes.map((img) => ({
        ...img.toObject(),
        esPortada: img.publicId === publicId,
      }));

      await producto.save();
      res.json({ success: true, data: producto });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/productos/:id/imagen/:publicId — eliminar una imagen
router.delete(
  '/:id/imagen/:publicId',
  param('id').isMongoId().withMessage('ID inválido'),
  validar,
  async (req, res, next) => {
    try {
      const producto = await Producto.findById(req.params.id);
      if (!producto) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }

      const publicId = decodeURIComponent(req.params.publicId);

      // Eliminar de Cloudinary
      await cloudinary.uploader.destroy(publicId);

      // Eliminar del array
      producto.imagenes = producto.imagenes.filter((img) => img.publicId !== publicId);

      // Si se eliminó la portada, asignar la primera imagen restante
      const tienePortada = producto.imagenes.some((img) => img.esPortada);
      if (!tienePortada && producto.imagenes.length > 0) {
        producto.imagenes[0].esPortada = true;
      }

      await producto.save();
      res.json({ success: true, data: producto });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/productos/:id — eliminar producto completo
router.delete(
  '/:id',
  param('id').isMongoId().withMessage('ID inválido'),
  validar,
  async (req, res, next) => {
    try {
      const producto = await Producto.findById(req.params.id);
      if (!producto) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }

      // Eliminar todas las imágenes de Cloudinary
      for (const img of producto.imagenes) {
        await cloudinary.uploader.destroy(img.publicId).catch(() => {});
      }

      await producto.deleteOne();
      res.json({ success: true, message: 'Producto eliminado correctamente' });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const Reseña = require('../models/Reseña');

const validar = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ success: false, errores: errores.array() });
  }
  next();
};

// GET /api/reseñas — reseñas aprobadas (público)
router.get('/', async (req, res, next) => {
  try {
    const reseñas = await Reseña.find({ aprobada: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: reseñas });
  } catch (err) {
    next(err);
  }
});

// GET /api/reseñas/admin — todas las reseñas (para admin)
router.get('/admin', async (req, res, next) => {
  try {
    const reseñas = await Reseña.find().sort({ createdAt: -1 });
    res.json({ success: true, data: reseñas });
  } catch (err) {
    next(err);
  }
});

// POST /api/reseñas — crear nueva reseña (público)
router.post(
  '/',
  [
    body('nombre')
      .notEmpty().withMessage('El nombre es obligatorio')
      .trim()
      .isLength({ max: 60 }).withMessage('Nombre muy largo'),
    body('mensaje')
      .notEmpty().withMessage('El mensaje es obligatorio')
      .trim()
      .isLength({ max: 300 }).withMessage('Mensaje muy largo (máx 300 caracteres)'),
    body('estrellas')
      .isInt({ min: 1, max: 5 }).withMessage('Las estrellas deben ser entre 1 y 5'),
  ],
  validar,
  async (req, res, next) => {
    try {
      const { nombre, mensaje, estrellas } = req.body;
      const reseña = await Reseña.create({ nombre, mensaje, estrellas });
      res.status(201).json({
        success: true,
        message: 'Reseña enviada. Será visible una vez aprobada.',
        data: reseña,
      });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/reseñas/:id/aprobar — aprobar reseña (admin)
router.patch(
  '/:id/aprobar',
  param('id').isMongoId().withMessage('ID inválido'),
  validar,
  async (req, res, next) => {
    try {
      const reseña = await Reseña.findByIdAndUpdate(
        req.params.id,
        { aprobada: true },
        { new: true }
      );
      if (!reseña) {
        return res.status(404).json({ success: false, message: 'Reseña no encontrada' });
      }
      res.json({ success: true, data: reseña });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/reseñas/:id — eliminar reseña (admin)
router.delete(
  '/:id',
  param('id').isMongoId().withMessage('ID inválido'),
  validar,
  async (req, res, next) => {
    try {
      const reseña = await Reseña.findByIdAndDelete(req.params.id);
      if (!reseña) {
        return res.status(404).json({ success: false, message: 'Reseña no encontrada' });
      }
      res.json({ success: true, message: 'Reseña eliminada' });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

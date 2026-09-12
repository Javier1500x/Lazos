const express = require('express');
const router = express.Router();
const Configuracion = require('../models/Configuracion');

// Configuraciones por defecto
const DEFAULTS = {
  // General
  nombre_negocio: 'Lazos',
  whatsapp: '85383864',
  whatsapp_mensaje: 'Hola, me interesa hacer un pedido de lazos',
  // Hero / portada
  hero_titulo: 'Cada lazo, una historia',
  hero_subtitulo: 'Elaborados uno por uno con dedicación',
  hero_badge: 'Hecho a mano',
  // Catálogo
  mostrar_precios: true,
  catalogo_columnas: 3,
  // Redes sociales
  instagram: '',
  facebook: '',
  tiktok: '',
  // Footer
  footer_texto: 'Lazos artesanales hechos con amor',
  footer_direccion: '',
  // Moneda
  moneda: 'C$',
  // Anuncio flotante
  anuncio_activo: true,
  anuncio_texto: '¡Envíos gratis esta semana! Haz tu pedido por WhatsApp',
  // SEO / meta
  meta_descripcion: 'Tienda de lazos artesanales hechos a mano',
};

// GET /api/config — obtener todas las configuraciones
router.get('/', async (req, res, next) => {
  try {
    const configs = await Configuracion.find();

    // Combinar defaults con los guardados en DB
    const resultado = { ...DEFAULTS };
    for (const config of configs) {
      resultado[config.clave] = config.valor;
    }

    res.json({ success: true, data: resultado });
  } catch (err) {
    next(err);
  }
});

// PUT /api/config — actualizar una o múltiples configuraciones
router.put('/', async (req, res, next) => {
  try {
    const updates = req.body; // { clave: valor, clave2: valor2, ... }

    for (const [clave, valor] of Object.entries(updates)) {
      await Configuracion.findOneAndUpdate(
        { clave },
        { clave, valor },
        { upsert: true, new: true }
      );
    }

    res.json({ success: true, message: 'Configuración actualizada' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

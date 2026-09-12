const express = require('express');
const router = express.Router();
const Visita = require('../models/Visita');

// GET /api/visitas — estadísticas completas de visitas (admin)
router.get('/', async (req, res, next) => {
  try {
    const total = await Visita.countDocuments();

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const visitasHoy = await Visita.countDocuments({ createdAt: { $gte: hoy } });

    // Ayer
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);
    const visitasAyer = await Visita.countDocuments({
      createdAt: { $gte: ayer, $lt: hoy },
    });

    // Últimas 50 visitas
    const ultimas = await Visita.find().sort({ createdAt: -1 }).limit(50);

    // Agrupar por dispositivo
    const porDispositivo = await Visita.aggregate([
      { $group: { _id: '$dispositivo', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    // Agrupar por navegador
    const porNavegador = await Visita.aggregate([
      {
        $group: {
          _id: { $arrayElemAt: [{ $split: ['$navegador', ' '] }, 0] },
          total: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 6 },
    ]);

    // Últimos 7 días (incluyendo hoy)
    const hace7Dias = new Date(hoy);
    hace7Dias.setDate(hace7Dias.getDate() - 6);

    const porDia = await Visita.aggregate([
      { $match: { createdAt: { $gte: hace7Dias } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: '-06:00' },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Rellenar días sin visitas para que siempre haya 7 puntos
    const diasCompletos = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoy);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const found = porDia.find((x) => x._id === key);
      diasCompletos.push({ fecha: key, total: found ? found.total : 0 });
    }

    // Por hora del día (últimas 24h)
    const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const porHora = await Visita.aggregate([
      { $match: { createdAt: { $gte: hace24h } } },
      {
        $group: {
          _id: { $hour: { date: '$createdAt', timezone: '-06:00' } },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Rellenar 24 horas
    const horasCompletas = Array.from({ length: 24 }, (_, h) => {
      const found = porHora.find((x) => x._id === h);
      return { hora: h, total: found ? found.total : 0 };
    });

    // Sistema operativo top
    const porSistema = await Visita.aggregate([
      {
        $group: {
          _id: { $arrayElemAt: [{ $split: ['$sistemaOperativo', ' '] }, 0] },
          total: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      data: {
        total,
        hoy: visitasHoy,
        ayer: visitasAyer,
        porDispositivo,
        porNavegador,
        porSistema,
        ultimas,
        porDia: diasCompletos,
        porHora: horasCompletas,
      },
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/visitas — borrar TODOS los registros de visitas
router.delete('/', async (req, res, next) => {
  try {
    const resultado = await Visita.deleteMany({});
    res.json({
      success: true,
      message: `${resultado.deletedCount} registros de visitas eliminados`,
      eliminados: resultado.deletedCount,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/visitas — registrar visita desde el frontend
router.post('/', async (req, res, next) => {
  try {
    const UAParser = require('ua-parser-js');
    const ua = UAParser(req.headers['user-agent'] || '');

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      'Desconocida';

    const visita = await Visita.create({
      ip,
      navegador: `${ua.browser.name || 'Desconocido'} ${ua.browser.version || ''}`.trim(),
      sistemaOperativo: `${ua.os.name || 'Desconocido'} ${ua.os.version || ''}`.trim(),
      dispositivo: ua.device.type || 'desktop',
      pagina: req.body.pagina || '/',
      userAgent: req.headers['user-agent'] || '',
    });

    console.log('\n┌─────────────────────────────────────────┐');
    console.log('│           🎀  NUEVA VISITA               │');
    console.log('├─────────────────────────────────────────┤');
    console.log(`│  🕐 Hora       : ${new Date().toLocaleString('es-NI')}`);
    console.log(`│  🌐 IP         : ${ip}`);
    console.log(`│  🖥️  Dispositivo: ${visita.dispositivo}`);
    console.log(`│  🔭 Navegador  : ${visita.navegador}`);
    console.log(`│  💻 Sistema    : ${visita.sistemaOperativo}`);
    console.log(`│  📄 Página     : ${visita.pagina}`);
    console.log('└─────────────────────────────────────────┘\n');

    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const UAParser = require('ua-parser-js');
const Visita = require('../models/Visita');

const registrarVisita = async (req, res, next) => {
  try {
    const ua = UAParser(req.headers['user-agent'] || '');
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      'Desconocida';

    const visita = {
      ip,
      navegador: `${ua.browser.name || 'Desconocido'} ${ua.browser.version || ''}`.trim(),
      sistemaOperativo: `${ua.os.name || 'Desconocido'} ${ua.os.version || ''}`.trim(),
      dispositivo: ua.device.type || 'desktop',
      pagina: req.path,
      userAgent: req.headers['user-agent'] || '',
    };

    // Guardar en DB de forma asíncrona sin bloquear la respuesta
    Visita.create(visita).catch((err) =>
      console.error('[VISITA] Error al guardar:', err.message)
    );

    // Log organizado en consola
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
  } catch (err) {
    console.error('[VISITA] Error en middleware:', err.message);
  }

  next();
};

module.exports = registrarVisita;

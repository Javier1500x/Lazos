const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join(', ');
  }

  // ID de MongoDB inválido
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'ID inválido';
  }

  // Clave duplicada en MongoDB
  if (err.code === 11000) {
    statusCode = 400;
    const campo = Object.keys(err.keyValue)[0];
    message = `Ya existe un registro con ese ${campo}`;
  }

  // Error de Multer (archivo muy grande)
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'El archivo es demasiado grande. Máximo 10MB.';
  }

  console.error(`[ERROR] ${statusCode} - ${message}`, err.stack ? `\n${err.stack}` : '');

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;

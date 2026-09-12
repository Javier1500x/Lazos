const mongoose = require('mongoose');

const reseñaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: [60, 'El nombre no puede superar 60 caracteres'],
    },
    mensaje: {
      type: String,
      required: [true, 'El mensaje es obligatorio'],
      trim: true,
      maxlength: [300, 'El mensaje no puede superar 300 caracteres'],
    },
    estrellas: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    aprobada: {
      type: Boolean,
      default: false, // Admin debe aprobar antes de mostrar
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reseña', reseñaSchema);

const mongoose = require('mongoose');

const heroImagenSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    titulo: { type: String, default: '' },
    subtitulo: { type: String, default: '' },
    orden: { type: Number, default: 0 },
    activa: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HeroImagen', heroImagenSchema);

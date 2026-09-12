const mongoose = require('mongoose');

const configuracionSchema = new mongoose.Schema(
  {
    clave: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    valor: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    descripcion: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Configuracion', configuracionSchema);

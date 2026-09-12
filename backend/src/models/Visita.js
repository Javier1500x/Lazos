const mongoose = require('mongoose');

const visitaSchema = new mongoose.Schema(
  {
    ip: { type: String },
    pais: { type: String },
    ciudad: { type: String },
    navegador: { type: String },
    sistemaOperativo: { type: String },
    dispositivo: { type: String },
    pagina: { type: String, default: '/' },
    userAgent: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Visita', visitaSchema);

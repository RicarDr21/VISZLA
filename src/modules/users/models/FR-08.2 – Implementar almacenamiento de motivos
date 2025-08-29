const mongoose = require("mongoose");

const MotivoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // quién creó el motivo
    required: true
  },
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Motivo", MotivoSchema);

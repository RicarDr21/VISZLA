const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['player', 'admin', 'staff'], default: 'player' },
  suspended: { type: Boolean, default: false },

  motivo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Motivo',
    default: null
  },
  fechaSuspension: {
    type: Date,
    default: null
  },
  fechaReactivacion: {
    type: Date,
    default: null
  },

  // Recuperación de contraseña
  resetToken: { type: String, default: null },
  resetTokenExp: { type: Date, default: null }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

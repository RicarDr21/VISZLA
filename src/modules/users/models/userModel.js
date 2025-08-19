// src/modules/users/models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  nombres: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ["jugador", "admin"], default: "jugador" },
  estado: { type: String, enum: ["activo", "baneado", "inactivo"], default: "activo" },
  fechaCreacion: { type: Date, default: Date.now },
  confirmacionToken: { type: String }, // token para confirmar cuenta
  confirmacionExpira: { type: Date },  // tiempo límite
  confirmado: { type: Boolean, default: false }
});

// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 12);
//   }
//   next();
// });

module.exports = mongoose.model("Usuario", UserSchema);
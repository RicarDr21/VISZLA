const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  accion: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Audit", auditSchema);

// src/modules/users/services/user.service.js
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Usuario = require("../models/user.model");
const emailService = require("../../email/services/email.service");

async function registerUser({ nombres, email, password }) {
  // verificar que no exista
  const existingUser = await Usuario.findOne({ email });
  if (existingUser) {
    throw new Error("El correo ya está registrado.");
  }

  // hash de contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // token de confirmación
  const token = crypto.randomBytes(32).toString("hex");

  const newUser = new Usuario({
    nombres,
    email,
    password: hashedPassword,
    confirmacionToken: token,
    confirmacionExpira: Date.now() + 3600000 // 1 hora
  });

  await newUser.save();

  // enviar correo
  await emailService.sendConfirmationEmail(email, token);

  return newUser;
}

module.exports = { registerUser };

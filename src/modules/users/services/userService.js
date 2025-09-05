// src/modules/users/services/user.service.js
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Usuario = require("../models/userModel");
const emailService = require("../../email/services/emailServices");

async function registerUser({ nombres, apellidos, apodo, avatar, email, password }) {
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
    apellidos,
    apodo,
    avatar,
    email,
    password: hashedPassword,
    confirmacionToken: token,
    confirmacionExpira: Date.now() + 3600000
  });

  await newUser.save();

  // enviar correo
  await emailService.sendConfirmationEmail(email, token);

  return newUser;
}

module.exports = { registerUser };

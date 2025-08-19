const express = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/userModel");
const jwt = require("jsonwebtoken");

const router = express.Router();

// 📌 Registro de usuario
router.post("/usuarios/register", async (req, res) => {
  try {
    const { nombres, apellidos, apodo, avatar, email, password, confirmPassword } = req.body;

    // Validar contraseñas
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    // Verificar si ya existe el email
    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombres,
      apellidos,
      apodo,
      avatar,
      email,
      password: hashedPassword
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: "Usuario registrado con éxito", usuario: nuevoUsuario });

  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

router.post("/usuarios/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Validar contraseña
    const validaPassword = await bcrypt.compare(password, usuario.password);
    if (!validaPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      "clave_secreta", // 🔑 usa variable de entorno
      { expiresIn: "2h" }
    );

    res.status(200).json({ message: "Login exitoso", token });

  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

module.exports = router;


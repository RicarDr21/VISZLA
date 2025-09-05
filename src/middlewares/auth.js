// auth.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Usuario = require("../modules/users/models/userModel");

// ---------------- LOGIN ----------------
const loginUsuario = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(400).json({ mensaje: "Contraseña incorrecta" });
    }

    // Crear token con rol incluido
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    let redireccion;
    if (usuario.rol === "admin") {
      redireccion = "/panel-admin";
    } else {
      redireccion = "/menu-inicio";
    }

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombres,
        rol: usuario.rol,
      },
      redireccion,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
  }
};

// ---------------- MIDDLEWARES ----------------
const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(403).json({ mensaje: "Acceso denegado, token faltante" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Guardamos payload en la request
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido" });
  }
};

const verificarAdmin = (req, res, next) => {
  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ mensaje: "Acceso denegado: Solo administradores" });
  }
  next();
};

// Exportamos todo
module.exports = { loginUsuario, verificarToken, verificarAdmin };

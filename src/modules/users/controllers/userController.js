// src/modules/users/controllers/user.controller.js
const { validateRegisterInput } = require("../validates/userValidate");
const { registerUser } = require("../services/userService");

async function register(req, res) {
  try {
    const { nombres, apellidos, apodo, avatar, email, password, confirmPassword } = req.body;

    const errors = validateRegisterInput({ nombres, email, password, confirmPassword });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const user = await registerUser({ nombres, apellidos, apodo, avatar, email, password });

    res.status(201).json({
      success: true,
      message: "Usuario registrado. Verifica tu correo para confirmar tu cuenta.",
      userId: user._id
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = { register };

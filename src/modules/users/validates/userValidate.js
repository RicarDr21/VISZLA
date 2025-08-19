// src/modules/users/validators/user.validator.js

const validateEmail = require("../../../utils/validateEmail");

function validateRegisterInput({ nombres, email, password, confirmPassword }) {
  const errors = [];

  if (!nombres || nombres.length < 3) {
    errors.push("El nombre debe tener al menos 3 caracteres.");
  }

  if (!validateEmail(email)) {
    errors.push("El correo no tiene un formato válido.");
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  if (!passwordRegex.test(password)) {
    errors.push("La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial.");
  }

  if (password !== confirmPassword) {
    errors.push("Las contraseñas no coinciden.");
  }

  return errors;
}

module.exports = { validateRegisterInput };

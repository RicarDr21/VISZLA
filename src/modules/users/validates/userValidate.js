const mongoose = require('mongoose');

const validateUserId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de usuario inválido' });
  }
  next();
};

const validateRegistration = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];

  // Validar nombre
  if (!name || name.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('El correo electrónico debe tener un formato válido');
  }

  // Validar contraseña
  if (!password) {
    errors.push('La contraseña es requerida');
  } else {
    const passwordErrors = validatePassword(password);
    errors.push(...passwordErrors);
  }

  // Validar confirmación de contraseña
  if (!confirmPassword) {
    errors.push('La confirmación de contraseña es requerida');
  } else if (password !== confirmPassword) {
    errors.push('Las contraseñas no coinciden');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      message: 'Datos de registro inválidos', 
      errors 
    });
  }

  next();
};

const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una mayúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('La contraseña debe contener al menos un carácter especial');
  }
  
  return errors;
};

module.exports = { validateUserId, validateRegistration };
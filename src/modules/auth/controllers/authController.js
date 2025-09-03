const User = require('../../users/models/userModel');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ 
        message: 'El correo electrónico ya está registrado',
        errors: ['Este correo electrónico ya tiene una cuenta asociada']
      });
    }

    // Crear el nuevo usuario
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    await newUser.save();

    // Responder sin incluir la contraseña
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userResponse
    });

  } catch (error) {
    console.error('Error en registro:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({ 
        message: 'El correo electrónico ya está registrado',
        errors: ['Este correo electrónico ya tiene una cuenta asociada']
      });
    }

    return res.status(500).json({ 
      message: 'Error interno del servidor',
      errors: ['Ocurrió un error al procesar el registro']
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Credenciales requeridas',
        errors: ['Email y contraseña son requeridos']
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas',
        errors: ['Email o contraseña incorrectos']
      });
    }

    if (user.suspended) {
      return res.status(403).json({ 
        message: 'Usuario suspendido. Acceso denegado.',
        errors: ['Tu cuenta ha sido suspendida']
      });
    }

    // Verificar contraseña
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas',
        errors: ['Email o contraseña incorrectos']
      });
    }

    return res.json({
      message: 'Login exitoso',
      user: { 
        _id: user._id, 
        name: user.name,
        email: user.email, 
        role: user.role 
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ 
      message: 'Error interno del servidor',
      errors: ['Ocurrió un error al procesar el login']
    });
  }
};

module.exports = { register, login };
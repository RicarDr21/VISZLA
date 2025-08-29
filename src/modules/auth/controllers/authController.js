const User = require('../../users/models/userModel');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// --- Login existente ---
const login = async (req, res) => {
  try {
    const { email } = req.body; // demo: solo email
    if (!email) return res.status(400).json({ message: 'Correo requerido' });

    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (user.suspended) {
      return res.status(403).json({ message: 'Usuario suspendido. Acceso denegado.' });
    }

    return res.json({
      message: 'Login ok',
      user: { _id: user._id, email: user.email, role: user.role }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// --- FR-09.2: Solicitar restablecimiento ---
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Correo no registrado' });

    // Generar token temporal
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExp = Date.now() + 3600000; // 1 hora
    await user.save();

    // Aquí deberías enviar correo real (ej: nodemailer)
    console.log(`🔗 Enlace de recuperación: http://localhost:3000/pages/resetPassword.html?token=${token}`);

    res.json({ message: 'Se envió un enlace de recuperación al correo registrado (revisa consola en demo)' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- FR-09.3: Validar token ---
const validateToken = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: 'Token inválido o expirado' });

    res.json({ message: 'Token válido' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- FR-09.4: Resetear contraseña ---
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: 'Token inválido o expirado' });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExp = undefined;
    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente, ya puedes iniciar sesión' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { 
  login,
  forgotPassword,
  validateToken,
  resetPassword
};

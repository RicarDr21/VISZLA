const User = require('../../users/models/userModel');

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

module.exports = { login };

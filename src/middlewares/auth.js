module.exports = (req, res, next) => {
  const role = req.header('x-role');
  if (!role) return res.status(401).json({ message: 'No autenticado' });
  req.user = { role };
  next();
};

const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'VISZLA', time: new Date().toISOString() });
});

app.get('/', (_req, res) => res.redirect('/pages/users.html'));

app.use('/users', require('./modules/users/routes/userRoute'));
app.use('/auth', require('./modules/auth/routes/authRoute'));

// 404 simple para API /users
app.use('/users', (_req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

module.exports = app;

require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ Falta MONGO_URI en .env');
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Conectado a MongoDB Atlas');

    app.listen(PORT, () => {
      const base = `http://localhost:${PORT}`;
      console.log('🚀 Servidor iniciado correctamente');
      console.log(`   ▶ UI (usuarios):   ${base}/pages/users.html`);
      console.log(`   ▶ Healthcheck:      ${base}/health`);
      console.log('   ▶ API base:         /users');
    });
  } catch (err) {
    console.error('❌ Error al conectar a MongoDB:', err.message);
    process.exit(1);
  }
})();

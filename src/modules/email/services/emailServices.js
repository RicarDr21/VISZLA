// src/modules/email/services/email.service.js
const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025, // MailHog
  secure: false
});

async function sendConfirmationEmail(email, token) {
  const confirmUrl = `${BASE_URL}/api/users/confirm/${token}`;

  await transporter.sendMail({
    from: '"Nexus Battles IV" <noreply@nexus.com>',
    to: email,
    subject: "Confirma tu cuenta",
    html: `<p>Gracias por registrarte en <b>Nexus Battles IV</b>.</p>
           <p>Haz clic en el siguiente enlace para confirmar tu cuenta:</p>
           <a href="${confirmUrl}">Confirmar cuenta</a>
           <p>Este enlace expira en 1 hora.</p>`
  });
}

module.exports = { sendConfirmationEmail };

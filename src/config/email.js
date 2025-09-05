// src/config/email.js
const sgMail = require('@sendgrid/mail');

// API Key desde las variables de entorno
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = sgMail;

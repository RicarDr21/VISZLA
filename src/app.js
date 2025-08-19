// src/app.js
const express = require("express");
const path = require("path");

const app = express();

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (html, css, js)
app.use(express.static(path.join(__dirname, "public")));

// Ruta raíz -> muestra el formulario de registro
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/register.html"));
});

module.exports = app;
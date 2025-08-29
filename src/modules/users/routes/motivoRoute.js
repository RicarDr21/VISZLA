const express = require('express');
const router = express.Router();
const motivoController = require('../controllers/motivoController');
const authRole = require('../../middlewares/authRole');

// Solo admin puede crear o modificar motivos
router.post('/', authRole(['admin']), motivoController.createMotivo);
router.put('/:id', authRole(['admin']), motivoController.updateMotivo);

// Cualquier usuario autenticado puede verlos
router.get('/', motivoController.getMotivos);

module.exports = router;

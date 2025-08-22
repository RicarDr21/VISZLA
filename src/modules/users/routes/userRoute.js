const express = require('express');
const router = express.Router();

const { postUser, getUsers, deleteUser, suspend, reactivate, updateUser, getUserById } =
  require('../controllers/userController');
const { validateUserId } = require('../validates/userValidate');
const authMiddleware = require('../../../middlewares/auth');

// Endpoints para la UI
router.post('/', postUser);     // crear usuario
router.get('/', getUsers);      // listar usuarios

// US-06
router.delete('/:id', authMiddleware, validateUserId, deleteUser);

// US-07
router.put('/:id/suspend', authMiddleware, validateUserId, suspend);
router.put('/:id/reactivate', authMiddleware, validateUserId, reactivate);
// US-10.2
router.put('/:id/update', authMiddleware, validateUserId, updateUser);
router.get('/:id', authMiddleware, validateUserId, getUserById);

module.exports = router;

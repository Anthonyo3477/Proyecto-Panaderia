const express = require('express');
const router = express.Router();
const authController = require('../../db/controllers/authController.js');

// Rutas de autenticación
router.get('/login', authController.mostrarFormularioLogin);
router.post('/login', authController.login);
router.post('/registrar', authController.registrar);

module.exports = router;

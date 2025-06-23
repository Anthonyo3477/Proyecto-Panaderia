const express = require('express');
const router = express.Router();
const authController = require('../../db/controllers/authController.js');

// Procesar login
router.post('/login', authController.login);

// Procesar registro
router.post('/registrar', authController.registrar);

module.exports = router;
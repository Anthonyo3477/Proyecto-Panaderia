const express = require('express');
const router = express.Router();
const authController = require('../../db/controllers/authController.js');

// Procesar login
router.post('/login', authController.login);

// Procesar registro
router.post('/registrar', authController.registrar);

// Cerrar sesión
router.get('/carro', (req, res) => {
  if (!req.session.usuario_id) {
    return res.redirect('/Login_Registrar?error=No%20has%20iniciado%20sesión');
  }

  // Consulta productos del carrito del usuario
  // (asumiendo que tienes la lógica de obtención en un controlador)
  productoController.mostrarCarro(req, res);
});


module.exports = router;

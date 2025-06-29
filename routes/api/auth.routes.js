const express = require('express');
const router = express.Router();
const authController = require('../../db/controllers/authController.js');

// Procesar login
router.post('/login', authController.login);

// Procesar registro
router.post('/registrar', authController.registrar);

// Cierre de sesión
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('❌ Error al cerrar sesión:', err);
      return res.status(500).send('Error al cerrar sesión');
    }
    res.redirect('/Login_Registrar'); // Puedes cambiarlo por '/' si prefieres
  });
});

module.exports = router;

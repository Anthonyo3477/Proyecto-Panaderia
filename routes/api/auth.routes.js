const express = require('express');
const router = express.Router();
const authController = require('../../db/controllers/authController.js');

// === Formularios ===
// Mostrar formulario de login/registro
router.get('/login', authController.mostrarFormularioLogin);

// === Procesos ===
// Procesar inicio de sesión
router.post('/login', authController.login);

// Procesar registro de usuario
router.post('/registrar', authController.registrar);

// === Cierre de sesión ===
// Cerrar sesión y destruir datos
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/Login_Registrar');
    });
});

module.exports = router;

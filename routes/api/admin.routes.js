// routes/api/admin.routes.js
const express = require('express');
const router = express.Router();

// Ruta para el home del administrador
router.get('/home', (req, res) => {
    // Aquí puedes añadir lógica de autenticación o verificación de rol si ya iniciaste sesión
    // Por ahora, simplemente renderizamos la vista de HomeAdmin
    res.render('HomeAdmin', { title: 'Home Administrador' });
});

module.exports = router;
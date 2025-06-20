const express = require('express');
const router = express.Router();
const db = require('../db/Conexion');

// Mostrar productos del carro
router.get('/', async (req, res) => {
    try {
        const [carro] = await db.execute('SELECT * FROM carro');
        res.render('Carro', { title: 'Tu Carrito', carro });
    } catch (error) {
        console.error('Error al cargar el carro:', error);
        res.status(500).render('error', { message: 'Error al mostrar el carro' });
    }
});

// Agregar producto al carro
router.post('/agregar', async (req, res) => {
    try {
        const { producto_id, nombre, precio, cantidad } = req.body;

        if (!producto_id || !cantidad || isNaN(cantidad) || cantidad <= 0) {
            return res.status(400).send('Cantidad inválida');
        }

        const total = parseFloat(precio) * parseInt(cantidad);

        // Insertar en carro
        await db.execute(
            'INSERT INTO carro (producto_id, nombre, precio, cantidad, subtotal) VALUES (?, ?, ?, ?, ?)',
            [producto_id, nombre, precio, cantidad, total]
        );

        // Actualizar stock
        await db.execute(
            'UPDATE producto SET cantidad = cantidad - ? WHERE id = ? AND cantidad >= ?',
            [cantidad, producto_id, cantidad]
        );

        res.redirect('/Carro');
    } catch (error) {
        console.error('Error al agregar al carro:', error);
        res.status(500).send('Error al agregar al carro');
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../../db/Conexion');  // Asegúrate que la ruta y el objeto db sean correctos

// Mostrar carrito
router.get('/', async (req, res) => {
    try {
        const cliente_id = req.session.cliente_id;

        if (!cliente_id) {
            return res.redirect('/Login_Registrar'); // Redirige si no está logueado
        }

        // Obtener productos en el carrito para ese cliente
        const [carro] = await db.execute(`
            SELECT c.id, p.nombre, p.clasificación, p.descripcion, p.precio, c.cantidad,
                   (p.precio * c.cantidad) AS total
            FROM carro c
            JOIN producto p ON c.producto_id = p.id
            WHERE c.cliente_id = ?
        `, [cliente_id]);

        res.render('Carro', {
            title: 'Tu Carrito',
            carro
        });
    } catch (error) {
        console.error('Error al cargar el carro:', error);
        res.status(500).render('error', { message: 'Error al mostrar el carro' });
    }
});

// Agregar producto al carrito
router.post('/agregar', async (req, res) => {
    try {
        const { producto_id, cantidad } = req.body;
        const cliente_id = req.session.cliente_id;

        if (!producto_id || !cantidad || isNaN(cantidad) || cantidad <= 0 || !cliente_id) {
            return res.status(400).send('Datos inválidos');
        }

        // Buscar producto para validar stock
        const [productoRows] = await db.execute('SELECT * FROM producto WHERE id = ?', [producto_id]);
        const producto = productoRows[0];

        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }

        if (producto.cantidad < cantidad) {
            return res.status(400).send('Stock insuficiente');
        }

        // Verificar si el producto ya está en el carrito
        const [existente] = await db.execute(
            'SELECT * FROM carro WHERE cliente_id = ? AND producto_id = ?',
            [cliente_id, producto_id]
        );

        if (existente.length > 0) {
            // Actualizar cantidad si ya existe
            await db.execute(
                'UPDATE carro SET cantidad = cantidad + ? WHERE cliente_id = ? AND producto_id = ?',
                [cantidad, cliente_id, producto_id]
            );
        } else {
            // Insertar producto nuevo en el carrito
            await db.execute(
                'INSERT INTO carro (cliente_id, producto_id, cantidad) VALUES (?, ?, ?)',
                [cliente_id, producto_id, cantidad]
            );
        }

        // Reducir stock en producto
        await db.execute(
            'UPDATE producto SET cantidad = cantidad - ? WHERE id = ?',
            [cantidad, producto_id]
        );

        res.redirect('/carro');
    } catch (error) {
        console.error('Error al agregar al carro:', error);
        res.status(500).send('Error interno al agregar al carro');
    }
});

// Eliminar producto del carrito
router.post('/eliminar/:id', async (req, res) => {
    try {
        const carro_id = req.params.id;
        const cliente_id = req.session.cliente_id;

        // Obtener producto y cantidad para reponer stock
        const [carroItem] = await db.execute(
            'SELECT producto_id, cantidad FROM carro WHERE id = ? AND cliente_id = ?',
            [carro_id, cliente_id]
        );

        if (carroItem.length === 0) {
            return res.status(404).send('Producto no encontrado en el carrito');
        }

        const { producto_id, cantidad } = carroItem[0];

        // Eliminar producto del carrito
        await db.execute(
            'DELETE FROM carro WHERE id = ? AND cliente_id = ?',
            [carro_id, cliente_id]
        );

        // Reponer stock del producto
        await db.execute(
            'UPDATE producto SET cantidad = cantidad + ? WHERE id = ?',
            [cantidad, producto_id]
        );

        res.redirect('/carro');
    } catch (error) {
        console.error('Error al eliminar del carro:', error);
        res.status(500).send('Error al eliminar producto del carrito');
    }
});

module.exports = router;

const db = require('../Conexion');

module.exports = {
    // Mostrar productos del carrito del cliente actual
    mostrarCarro: async (req, res) => {
        try {
            const cliente_id = req.session.cliente_id;

            if (!cliente_id) {
                return res.redirect('/Login_Registrar');
            }

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
            console.error('Error al mostrar el carro:', error);
            res.status(500).render('error', { message: 'Error al mostrar el carrito' });
        }
    },

    // Agregar producto al carrito
    agregarAlCarro: async (req, res) => {
        try {
            const { producto_id, cantidad } = req.body;
            const cliente_id = req.session.cliente_id;

            if (!producto_id || !cantidad || isNaN(cantidad) || cantidad <= 0 || !cliente_id) {
                return res.status(400).send('Datos inválidos');
            }

            const [productoRows] = await db.execute('SELECT * FROM producto WHERE id = ?', [producto_id]);
            const producto = productoRows[0];

            if (!producto || producto.cantidad < cantidad) {
                return res.status(400).send('Producto no disponible o stock insuficiente');
            }

            // Verificar si ya está en el carrito
            const [existente] = await db.execute(
                'SELECT * FROM carro WHERE cliente_id = ? AND producto_id = ?',
                [cliente_id, producto_id]
            );

            if (existente.length > 0) {
                await db.execute(
                    'UPDATE carro SET cantidad = cantidad + ? WHERE cliente_id = ? AND producto_id = ?',
                    [cantidad, cliente_id, producto_id]
                );
            } else {
                await db.execute(
                    'INSERT INTO carro (cliente_id, producto_id, cantidad) VALUES (?, ?, ?)',
                    [cliente_id, producto_id, cantidad]
                );
            }

            // Reducir stock del producto
            await db.execute(
                'UPDATE producto SET cantidad = cantidad - ? WHERE id = ? AND cantidad >= ?',
                [cantidad, producto_id, cantidad]
            );

            res.redirect('/carro');
        } catch (error) {
            console.error('Error al agregar al carro:', error);
            res.status(500).send('Error interno al agregar al carro');
        }
    },

    // Eliminar producto del carrito
    eliminarDelCarro: async (req, res) => {
        try {
            const carro_id = req.params.id;
            const cliente_id = req.session.cliente_id;

            const [carroItem] = await db.execute(
                'SELECT producto_id, cantidad FROM carro WHERE id = ? AND cliente_id = ?',
                [carro_id, cliente_id]
            );

            if (carroItem.length === 0) {
                return res.status(404).send('Producto no encontrado en el carrito');
            }

            const { producto_id, cantidad } = carroItem[0];

            // Eliminar del carro
            await db.execute(
                'DELETE FROM carro WHERE id = ? AND cliente_id = ?',
                [carro_id, cliente_id]
            );

            // Devolver stock
            await db.execute(
                'UPDATE producto SET cantidad = cantidad + ? WHERE id = ?',
                [cantidad, producto_id]
            );

            res.redirect('/carro');
        } catch (error) {
            console.error('Error al eliminar del carro:', error);
            res.status(500).send('Error interno al eliminar del carro');
        }
    }
};
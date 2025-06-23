const express = require('express');
const router = express.Router();
const db = require('../../db/Conexion');

// Middleware para verificar sesión activa
function verificarSesion(req, res, next) {
  if (!req.session.usuario_id) {
    return res.redirect('/Carro');
  }
  next();
}

// Mostrar carrito
router.get('/', verificarSesion, async (req, res) => {
  try {
    const usuario_id = req.session.usuario_id;

    const [carro] = await db.execute(`
      SELECT c.id, p.nombre, p.clasificación, p.descripcion, p.precio, c.cantidad,
             (p.precio * c.cantidad) AS total
      FROM carro c
      JOIN producto p ON c.producto_id = p.id
      WHERE c.cliente_id = ?
    `, [usuario_id]);

    res.render('Carro', {
      title: 'Carrito de Compras',
      carro,
      nombreUsuario: req.session.usuario_nombre,
      rol: req.session.rol
    });
  } catch (error) {
    console.error('❌ Error al mostrar el carrito:', error);
    res.status(500).render('error', { message: 'Error al mostrar el carrito' });
  }
});

// Agregar producto al carrito
router.post('/agregar', verificarSesion, async (req, res) => {
  try {
    const { producto_id, cantidad } = req.body;
    const usuario_id = req.session.usuario_id;

    if (!producto_id || !cantidad || isNaN(cantidad) || cantidad <= 0) {
      return res.status(400).send('Datos del producto inválidos');
    }

    const [productoRows] = await db.execute(
      'SELECT * FROM producto WHERE id = ?',
      [producto_id]
    );

    const producto = productoRows[0];
    if (!producto) return res.status(404).send('Producto no encontrado');
    if (producto.cantidad < cantidad) return res.status(400).send('Stock insuficiente');

    // Verificar si ya está en el carrito
    const [existente] = await db.execute(
      'SELECT * FROM carro WHERE cliente_id = ? AND producto_id = ?',
      [usuario_id, producto_id]
    );

    if (existente.length > 0) {
      await db.execute(
        'UPDATE carro SET cantidad = cantidad + ? WHERE cliente_id = ? AND producto_id = ?',
        [cantidad, usuario_id, producto_id]
      );
    } else {
      await db.execute(
        'INSERT INTO carro (cliente_id, producto_id, cantidad) VALUES (?, ?, ?)',
        [usuario_id, producto_id, cantidad]
      );
    }

    // Actualizar stock del producto
    await db.execute(
      'UPDATE producto SET cantidad = cantidad - ? WHERE id = ?',
      [cantidad, producto_id]
    );

    res.redirect('/carro');
  } catch (error) {
    console.error('❌ Error al agregar al carrito:', error);
    res.status(500).send('Error interno al agregar producto al carrito');
  }
});

// Eliminar producto del carrito
router.post('/eliminar/:id', verificarSesion, async (req, res) => {
  try {
    const carro_id = req.params.id;
    const usuario_id = req.session.usuario_id;

    const [carroItem] = await db.execute(
      'SELECT producto_id, cantidad FROM carro WHERE id = ? AND cliente_id = ?',
      [carro_id, usuario_id]
    );

    if (carroItem.length === 0) {
      return res.status(404).send('Producto no encontrado en el carrito');
    }

    const { producto_id, cantidad } = carroItem[0];

    await db.execute(
      'DELETE FROM carro WHERE id = ? AND cliente_id = ?',
      [carro_id, usuario_id]
    );

    await db.execute(
      'UPDATE producto SET cantidad = cantidad + ? WHERE id = ?',
      [cantidad, producto_id]
    );

    res.redirect('/Carro');
  } catch (error) {
    console.error('❌ Error al eliminar del carrito:', error);
    res.status(500).send('Error interno al eliminar del carrito');
  }
});

module.exports = router;

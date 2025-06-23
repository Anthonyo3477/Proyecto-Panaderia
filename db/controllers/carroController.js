const db = require('../Conexion');

module.exports = {
  mostrarCarro: async (req, res) => {
    try {
      if (!req.session.usuario) {
        req.session.returnTo = '/carro';
        return res.redirect('/Login_Registrar');
      }

      const [carro] = await db.execute(
        `SELECT c.id, p.id as producto_id, p.nombre, p.clasificacion, 
         p.descripcion, p.precio, c.cantidad, (p.precio * c.cantidad) AS total
         FROM carro c
         JOIN producto p ON c.producto_id = p.id
         WHERE c.cliente_id = ?`,
        [req.session.usuario.id]
      );

      const total = carro.reduce((sum, item) => sum + item.total, 0);

      res.render('Carro', {
        title: 'Carrito de Compras',
        carro,
        total,
        usuario: req.session.usuario
      });

    } catch (error) {
      console.error('❌ Error en carrito:', error);
      res.status(500).render('error', { message: 'Error al cargar el carrito' });
    }
  },

  agregarAlCarro: async (req, res) => {
    try {
      if (!req.session.usuario) {
        req.session.pendingProduct = {
          producto_id: req.body.producto_id,
          cantidad: req.body.cantidad
        };
        return res.redirect('/Login_Registrar');
      }

      const { producto_id, cantidad } = req.body;
      const usuario_id = req.session.usuario.id;

      // Verificar stock
      const [producto] = await db.execute(
        'SELECT cantidad FROM producto WHERE id = ?',
        [producto_id]
      );

      if (producto[0].cantidad < cantidad) {
        return res.status(400).json({ error: 'Stock insuficiente' });
      }

      // Verificar si ya está en el carrito
      const [existente] = await db.execute(
        'SELECT * FROM carro WHERE cliente_id = ? AND producto_id = ?',
        [usuario_id, producto_id]
      );

      if (existente.length > 0) {
        await db.execute(
          'UPDATE carro SET cantidad = cantidad + ? WHERE id = ?',
          [cantidad, existente[0].id]
        );
      } else {
        await db.execute(
          'INSERT INTO carro (cliente_id, producto_id, cantidad) VALUES (?, ?, ?)',
          [usuario_id, producto_id, cantidad]
        );
      }

      // Actualizar stock
      await db.execute(
        'UPDATE producto SET cantidad = cantidad - ? WHERE id = ?',
        [cantidad, producto_id]
      );

      res.redirect('/carro');

    } catch (error) {
      console.error('❌ Error al agregar al carrito:', error);
      res.status(500).json({ error: 'Error al agregar producto' });
    }
  },

  eliminarDelCarro: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario_id = req.session.usuario.id;

      const [item] = await db.execute(
        'SELECT producto_id, cantidad FROM carro WHERE id = ? AND cliente_id = ?',
        [id, usuario_id]
      );

      if (item.length === 0) {
        return res.status(404).json({ error: 'Item no encontrado' });
      }

      // Eliminar del carrito
      await db.execute(
        'DELETE FROM carro WHERE id = ?',
        [id]
      );

      // Devolver stock
      await db.execute(
        'UPDATE producto SET cantidad = cantidad + ? WHERE id = ?',
        [item[0].cantidad, item[0].producto_id]
      );

      res.redirect('/carro');

    } catch (error) {
      console.error('❌ Error al eliminar:', error);
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  }
};
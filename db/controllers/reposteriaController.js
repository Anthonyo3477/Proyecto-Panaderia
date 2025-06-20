const db = require('../Conexion');

module.exports = {
    getProductosReposteria: async () => {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM producto WHERE clasificacion = ? ORDER BY nombre',
                ['Repostería']
            );
            return rows;
        } catch (error) {
            console.error('Error en getProductosReposteria:', error);
            throw new Error('Error al obtener productos de repostería');
        }
    },

    getProductoReposteriaById: async (id) => {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM producto WHERE id = ? AND clasificacion = ?',
                [id, 'Repostería']
            );
            return rows.length ? rows[0] : null;
        } catch (error) {
            console.error('Error en getProductoReposteriaById:', error);
            throw new Error('Error al obtener producto de repostería');
        }
    },

    insertProductoReposteria: async ({ nombre, clasificacion, precio, descripcion, cantidad }) => {
        try {
            if (!nombre || !descripcion || precio == null || cantidad == null) {
                throw new Error('Faltan campos obligatorios');
            }

            const [result] = await db.execute(
                'INSERT INTO producto (nombre, clasificacion, descripcion, precio, cantidad) VALUES (?, ?, ?, ?, ?)',
                [nombre.trim(), 'Repostería', descripcion.trim(), parseFloat(precio), parseInt(cantidad)]
            );

            return {
                id: result.insertId,
                nombre: nombre.trim(),
                clasificacion: 'Repostería',
                descripcion: descripcion.trim(),
                precio: parseFloat(precio),
                cantidad: parseInt(cantidad)
            };
        } catch (error) {
            console.error('Error en insertProductoReposteria:', error);
            throw new Error('Error al crear producto de repostería');
        }
    },

    updateProductoReposteria: async (id, { nombre, clasificacion, precio, descripcion, cantidad }) => {
        try {
            if (!nombre || !descripcion || precio == null || cantidad == null) {
                throw new Error('Faltan campos obligatorios');
            }

            const [rows] = await db.execute(
                'SELECT * FROM producto WHERE id = ? AND clasificacion = ?',
                [id, 'Repostería']
            );

            if (rows.length === 0) {
                throw new Error('Producto de repostería no encontrado');
            }

            const [result] = await db.execute(
                'UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, cantidad = ? WHERE id = ?',
                [nombre.trim(), descripcion.trim(), parseFloat(precio), parseInt(cantidad), id]
            );

            return {
                id,
                nombre: nombre.trim(),
                clasificacion: 'Repostería',
                descripcion: descripcion.trim(),
                precio: parseFloat(precio),
                cantidad: parseInt(cantidad)
            };
        } catch (error) {
            console.error('Error en updateProductoReposteria:', error);
            throw new Error('Error al actualizar producto de repostería');
        }
    },

    deleteProductoReposteria: async (id) => {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM producto WHERE id = ? AND clasificacion = ?',
                [id, 'Repostería']
            );

            if (rows.length === 0) {
                throw new Error('Producto de repostería no encontrado');
            }

            const [result] = await db.execute(
                'DELETE FROM producto WHERE id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                throw new Error('No se pudo eliminar el producto');
            }
        } catch (error) {
            console.error('Error en deleteProductoReposteria:', error);
            throw new Error('Error al eliminar producto de repostería');
        }
    }
};
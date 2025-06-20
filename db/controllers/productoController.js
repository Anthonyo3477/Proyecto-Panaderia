const db = require('../Conexion');

module.exports = {
    getAllProductos: async (page = 1, limit = 10) => {
        try {
            const offset = (page - 1) * limit;
            const [rows] = await db.execute(
                'SELECT * FROM producto ORDER BY nombre LIMIT ? OFFSET ?',
                [limit, offset]
            );
            return rows;
        } catch (error) {
            console.error('Error en getAllProductos:', error);
            throw new Error('Error al obtener los productos');
        }
    },

    getProductoById: async (id) => {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM producto WHERE id = ?',
                [id]
            );
            return rows.length ? rows[0] : null;
        } catch (error) {
            console.error('Error en getProductoById:', error);
            throw new Error('Error al obtener el producto');
        }
    },

    insertProducto: async ({ nombre, clasificacion, precio, descripcion }) => {
        try {
            if (!nombre || !clasificacion || precio == null || !descripcion) {
                throw new Error('Faltan campos obligatorios');
            }

            const [result] = await db.execute(
                'INSERT INTO producto (nombre, clasificacion, precio, descripcion) VALUES (?, ?, ?, ?)',
                [nombre.trim(), clasificacion.trim(), parseFloat(precio), descripcion.trim()]
            );

            return {
                id: result.insertId,
                nombre: nombre.trim(),
                clasificacion: clasificacion.trim(),
                precio: parseFloat(precio),
                descripcion: descripcion.trim()
            };
        } catch (error) {
            console.error('Error en insertProducto:', error);
            throw new Error('Error al crear el producto');
        }
    },

    updateProducto: async (id, { nombre, clasificacion, precio, descripcion }) => {
        try {
            if (!nombre || !clasificacion || precio == null || !descripcion) {
                throw new Error('Faltan campos obligatorios');
            }

            const [result] = await db.execute(
                'UPDATE producto SET nombre = ?, clasificacion = ?, precio = ?, descripcion = ? WHERE id = ?',
                [nombre.trim(), clasificacion.trim(), parseFloat(precio), descripcion.trim(), id]
            );

            if (result.affectedRows === 0) {
                throw new Error('Producto no encontrado');
            }

            return {
                id,
                nombre: nombre.trim(),
                clasificacion: clasificacion.trim(),
                precio: parseFloat(precio),
                descripcion: descripcion.trim()
            };
        } catch (error) {
            console.error('Error en updateProducto:', error);
            throw new Error('Error al actualizar el producto');
        }
    },

    deleteProducto: async (id) => {
        try {
            const [result] = await db.execute(
                'DELETE FROM producto WHERE id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            console.error('Error en deleteProducto:', error);
            throw new Error('Error al eliminar el producto');
        }
    },

    getProductosPorClasificacion: async (clasificacion) => {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM producto WHERE clasificacion = ? ORDER BY nombre',
                [clasificacion]
            );
            return rows;
        } catch (error) {
            console.error('Error en getProductosPorClasificacion:', error);
            throw new Error('Error al filtrar productos');
        }
    }
};

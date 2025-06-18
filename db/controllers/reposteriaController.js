const db = require('../Conexion'); // Ajusta la ruta si está en otro lugar

module.exports = {
    /**
     * Obtiene todos los productos clasificados como "Pastel"
     * @returns {Promise<Array>} Lista de productos de repostería
     */
    getProductosReposteria: async () => {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM producto WHERE clasificacion = ? ORDER BY nombre',
                ['Pastel'] // Cambia a 'Repostería' si es tu categoría real
            );
            return rows;
        } catch (error) {
            console.error('Error en getProductosReposteria:', error);
            throw new Error('Error al obtener productos de repostería');
        }
    },

    /**
     * Obtiene un producto de repostería por su ID
     * @param {number} id - ID del producto
     * @returns {Promise<Object|null>} Producto encontrado o null
     */
    getProductoReposteriaById: async (id) => {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM producto WHERE id = ? AND clasificacion = ?',
                [id, 'Pastel']
            );
            return rows.length ? rows[0] : null;
        } catch (error) {
            console.error('Error en getProductoReposteriaById:', error);
            throw new Error('Error al obtener producto de repostería');
        }
    },

    /**
     * Inserta un nuevo producto clasificado como "Pastel"
     * @param {Object} producto - Datos del producto
     * @param {string} producto.nombre
     * @param {string} producto.descripcion
     * @returns {Promise<Object>} Producto creado
     */
    insertProductoReposteria: async (producto) => {
        try {
            const { nombre, descripcion } = producto;

            if (!nombre || !descripcion) {
                throw new Error('Faltan campos obligatorios');
            }

            const [result] = await db.execute(
                'INSERT INTO producto (nombre, clasificacion, descripcion) VALUES (?, ?, ?)',
                [nombre.trim(), 'Pastel', descripcion.trim()]
            );

            return {
                id: result.insertId,
                nombre: nombre.trim(),
                clasificacion: 'Pastel',
                descripcion: descripcion.trim()
            };
        } catch (error) {
            console.error('Error en insertProductoReposteria:', error);
            throw new Error('Error al crear producto de repostería');
        }
    },

    /**
     * Actualiza un producto de repostería existente
     * @param {number} id - ID del producto
     * @param {Object} producto - Nuevos datos
     * @returns {Promise<Object>} Producto actualizado
     */
    updateProductoReposteria: async (id, producto) => {
        try {
            const { nombre, descripcion } = producto;

            if (!nombre || !descripcion) {
                throw new Error('Faltan campos obligatorios');
            }

            // Verificar que el producto es de repostería
            const [rows] = await db.execute(
                'SELECT * FROM producto WHERE id = ? AND clasificacion = ?',
                [id, 'Pastel']
            );

            if (rows.length === 0) {
                throw new Error('Producto de repostería no encontrado');
            }

            const [result] = await db.execute(
                'UPDATE producto SET nombre = ?, descripcion = ? WHERE id = ?',
                [nombre.trim(), descripcion.trim(), id]
            );

            return {
                id,
                nombre: nombre.trim(),
                clasificacion: 'Pastel',
                descripcion: descripcion.trim()
            };
        } catch (error) {
            console.error('Error en updateProductoReposteria:', error);
            throw new Error('Error al actualizar producto de repostería');
        }
    },

    /**
     * Elimina un producto de repostería por ID
     * @param {number} id - ID del producto
     * @returns {Promise<void>}
     */
    deleteProductoReposteria: async (id) => {
        try {
            // Verificar primero que sea de repostería
            const [rows] = await db.execute(
                'SELECT * FROM producto WHERE id = ? AND clasificacion = ?',
                [id, 'Pastel']
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
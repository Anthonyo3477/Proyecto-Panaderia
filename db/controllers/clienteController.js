const db = require('../Conexion'); // Asegúrate de que la ruta sea correcta

module.exports = {
    getAllClientes: async () => {
        try {
            const [rows] = await db.execute('SELECT * FROM cliente ORDER BY nombre');
            return rows;
        } catch (error) {
            console.error('Error en getAllClientes:', error);
            throw new Error('Error al obtener los clientes');
        }
    },

    getClienteById: async (id) => {
        try {
            const [rows] = await db.execute('SELECT * FROM cliente WHERE id = ?', [id]);
            return rows;
        } catch (error) {
            console.error('Error en getClienteById:', error);
            throw new Error('Error al obtener el cliente');
        }
    },

    insertCliente: async (cliente) => {
        try {
            const { nombre, correo, contraseña, telefono, direccion } = cliente;

            if (!nombre || !correo || !contraseña) {
                throw new Error('Faltan campos obligatorios');
            }

            const [result] = await db.execute(
                'INSERT INTO cliente (nombre, correo, contraseña, telefono, direccion) VALUES (?, ?, ?, ?, ?)',
                [
                    nombre.trim(),
                    correo.trim(),
                    contraseña.trim(),
                    telefono?.trim() || null,
                    direccion?.trim() || null
                ]
            );

            return {
                id: result.insertId,
                ...cliente
            };
        } catch (error) {
            console.error('Error en insertCliente:', error);
            throw new Error('Error al crear el cliente');
        }
    },

    updateCliente: async (id, cliente) => {
        try {
            const { nombre, correo, contraseña, telefono, direccion } = cliente;

            if (!nombre || !correo || !contraseña) {
                throw new Error('Faltan campos obligatorios');
            }

            const [result] = await db.execute(
                'UPDATE cliente SET nombre = ?, correo = ?, contraseña = ?, telefono = ?, direccion = ? WHERE id = ?',
                [
                    nombre.trim(),
                    correo.trim(),
                    contraseña.trim(),
                    telefono?.trim() || null,
                    direccion?.trim() || null,
                    id
                ]
            );

            if (result.affectedRows === 0) {
                throw new Error('Cliente no encontrado');
            }

            return { id, ...cliente };
        } catch (error) {
            console.error('Error en updateCliente:', error);
            throw new Error('Error al actualizar el cliente');
        }
    },

    deleteCliente: async (id) => {
        try {
            const [result] = await db.execute('DELETE FROM cliente WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                throw new Error('Cliente no encontrado');
            }

            return { id, message: 'Cliente eliminado correctamente' };
        } catch (error) {
            console.error('Error en deleteCliente:', error);
            throw new Error('Error al eliminar el cliente');
        }
    }
};

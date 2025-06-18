const express = require('express');
const router = express.Router();
const clienteController = require('../../db/controllers/clienteController');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Formulario para nuevo cliente
router.get('/nuevo', (req, res) => {
    try {
        res.render('nuevo-cliente', {
            title: 'Registrar Nuevo Cliente'
        });
    } catch (error) {
        console.error('Error al renderizar formulario:', error);
        res.status(500).render('error', { message: 'Error al cargar el formulario' });
    }
});

// Listar todos los clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await clienteController.getAllClientes();
        res.render('clientes', {
            title: 'Listado de Clientes',
            clientes
        });
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).render('error', { message: 'Error al cargar los clientes' });
    }
});

// Mostrar detalle de un cliente
router.get('/:id', async (req, res) => {
    try {
        const cliente = await clienteController.getClienteById(req.params.id);

        if (!cliente || cliente.length === 0) {
            return res.status(404).render('error', { message: 'Cliente no encontrado' });
        }

        res.render('cliente-detalle', {
            title: cliente[0].nombre,
            cliente: cliente[0]
        });
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        res.status(500).render('error', { message: 'Error al cargar el cliente' });
    }
});

// Procesar nuevo cliente
router.post('/insert', async (req, res) => {
    try {
        const { nombre, correo, contraseña, telefono, direccion } = req.body;

        if (!nombre?.trim() || !correo?.trim() || !contraseña?.trim()) {
            return res.status(400).render('nuevo-cliente', {
                error: 'Nombre, correo y contraseña son obligatorios',
                valores: req.body
            });
        }

        const nuevoCliente = {
            nombre: nombre.trim(),
            correo: correo.trim(),
            contraseña: contraseña.trim(),
            telefono: telefono?.trim() || '',
            direccion: direccion?.trim() || ''
        };

        await clienteController.insertCliente(nuevoCliente);

        res.redirect('/cliente');
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).render('nuevo-cliente', {
            error: 'Error al guardar el cliente',
            valores: req.body
        });
    }
});

// Formulario para editar cliente
router.get('/editar/:id', async (req, res) => {
    try {
        const cliente = await clienteController.getClienteById(req.params.id);

        if (!cliente || cliente.length === 0) {
            return res.status(404).render('error', { message: 'Cliente no encontrado' });
        }

        res.render('editar-cliente', {
            title: `Editar ${cliente[0].nombre}`,
            cliente: cliente[0]
        });
    } catch (error) {
        console.error('Error al cargar formulario de edición:', error);
        res.status(500).render('error', { message: 'Error al cargar el formulario' });
    }
});

// Procesar actualización de cliente
router.post('/actualizar/:id', async (req, res) => {
    try {
        const { nombre, correo, contraseña, telefono, direccion } = req.body;

        if (!nombre?.trim() || !correo?.trim() || !contraseña?.trim()) {
            return res.status(400).render('editar-cliente', {
                error: 'Nombre, correo y contraseña son obligatorios',
                cliente: { id: req.params.id, ...req.body }
            });
        }

        const clienteActualizado = {
            nombre: nombre.trim(),
            correo: correo.trim(),
            contraseña: contraseña.trim(),
            telefono: telefono?.trim() || '',
            direccion: direccion?.trim() || ''
        };

        await clienteController.updateCliente(req.params.id, clienteActualizado);

        res.redirect(`/cliente/${req.params.id}`);
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).render('editar-cliente', {
            error: 'Error al actualizar el cliente',
            cliente: { id: req.params.id, ...req.body }
        });
    }
});

// Eliminar cliente
router.post('/eliminar/:id', async (req, res) => {
    try {
        await clienteController.deleteCliente(req.params.id);
        res.redirect('/cliente');
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).render('error', { message: 'Error al eliminar el cliente' });
    }
});

module.exports = router;

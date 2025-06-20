const express = require('express');
const router = express.Router();
const productoController = require('../../db/controllers/productoController');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Mostrar formulario para crear nuevo producto
router.get('/nuevo', (req, res) => {
    res.render('nuevo-producto', {
        title: 'Registrar Nuevo Producto',
        categorias: ['Pan', 'Torta', 'Pastel', 'Otro']
    });
});

// Procesar creación de producto
router.post('/insert', async (req, res) => {
    try {
        const { nombre, clasificacion, precio, descripcion, cantidad } = req.body;

        if (!nombre?.trim() || !clasificacion?.trim() || !descripcion?.trim() || !precio || isNaN(precio) || !cantidad || isNaN(cantidad)) {
            return res.status(400).render('nuevo-producto', {
                error: 'Todos los campos son obligatorios y deben ser válidos',
                valores: req.body,
                categorias: ['Pan', 'Torta', 'Pastel', 'Otro']
            });
        }

        await productoController.insertProducto({
            nombre: nombre.trim(),
            clasificacion: clasificacion.trim(),
            precio: parseFloat(precio),
            descripcion: descripcion.trim(),
            cantidad: parseInt(cantidad)
        });

        res.redirect('/panaderia');
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).render('nuevo-producto', {
            error: 'Error al guardar el producto',
            valores: req.body,
            categorias: ['Pan', 'Torta', 'Pastel', 'Otro']
        });
    }
});

// Mostrar formulario para editar producto
router.get('/editar/:id', async (req, res) => {
    try {
        const producto = await productoController.getProductoById(req.params.id);

        if (!producto) {
            return res.status(404).render('error', { message: 'Producto no encontrado' });
        }

        res.render('EditarProducto', {
            title: `Editar ${producto.nombre}`,
            producto,
            categorias: ['Pan', 'Torta', 'Pastel', 'Otro']
        });
    } catch (error) {
        console.error('Error al cargar el formulario de edición:', error);
        res.status(500).render('error', { message: 'Error al cargar el formulario' });
    }
});

// Procesar actualización de producto
router.post('/actualizar/:id', async (req, res) => {
    try {
        const { nombre, clasificacion, precio, descripcion, cantidad } = req.body;

        if (!nombre?.trim() || !clasificacion?.trim() || !descripcion?.trim() || !precio || isNaN(precio) || !cantidad || isNaN(cantidad)) {
            return res.status(400).render('EditarProducto', {
                error: 'Todos los campos son obligatorios y deben ser válidos',
                producto: {
                    id: req.params.id,
                    nombre,
                    clasificacion,
                    descripcion,
                    precio,
                    cantidad
                },
                categorias: ['Pan', 'Torta', 'Pastel', 'Otro']
            });
        }

        await productoController.updateProducto(req.params.id, {
            nombre: nombre.trim(),
            clasificacion: clasificacion.trim(),
            precio: parseFloat(precio),
            descripcion: descripcion.trim(),
            cantidad: parseInt(cantidad)
        });

        res.redirect('/panaderia');
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).render('EditarProducto', {
            error: 'Error al actualizar el producto',
            producto: {
                id: req.params.id,
                ...req.body
            },
            categorias: ['Pan', 'Torta', 'Pastel', 'Otro']
        });
    }
});

// Mostrar todos los productos clasificados como "Pan"
router.get('/', async (req, res) => {
    try {
        const productos = await productoController.getProductosPorClasificacion('Pan');

        res.render('Panaderia', {
            title: 'Productos de Panadería',
            productos
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { message: 'Error al cargar los productos de panadería' });
    }
});

// Eliminar producto
router.post('/eliminar/:id', async (req, res) => {
    try {
        await productoController.deleteProducto(req.params.id);
        res.redirect('/panaderia');
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).render('error', { message: 'Error al eliminar el producto' });
    }
});

module.exports = router;
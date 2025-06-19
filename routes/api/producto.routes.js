const express = require('express');
const router = express.Router();
const productoController = require('../../db/controllers/productoController');

// Middleware para parsear datos
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Mostrar formulario para crear nuevo producto
router.get('/nuevo', (req, res) => {
    res.render('nuevo-producto', {
        title: 'Registrar Nuevo Producto',
        categorias: ['Pan', 'Reposteria', 'Otro']
    });
});

// Procesar creación de producto (POST)
router.post('/insert', async (req, res) => {
    try {
        const { nombre, clasificacion, descripcion } = req.body;

        if (!nombre?.trim() || !clasificacion?.trim() || !descripcion?.trim()) {
            return res.status(400).render('nuevo-producto', {
                error: 'Todos los campos son obligatorios',
                valores: req.body,
                categorias: ['Pan', 'Torta', 'Pastel', 'Otro']
            });
        }

        await productoController.insertProducto({ nombre, clasificacion, descripcion });

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

// Mostrar detalle de producto
router.get('/:id', async (req, res) => {
    try {
        const producto = await productoController.getProductoById(req.params.id);

        if (!producto) {
            return res.status(404).render('error', { message: 'Producto no encontrado' });
        }

        res.render('producto-detalle', {
            title: producto.nombre,
            producto
        });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).render('error', { message: 'Error al cargar el producto' });
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
        const { nombre, clasificacion, descripcion } = req.body;

        if (!nombre?.trim() || !clasificacion?.trim() || !descripcion?.trim()) {
            return res.status(400).render('EditarProducto', {
                error: 'Todos los campos son obligatorios',
                producto: {
                    id: req.params.id,
                    nombre,
                    clasificacion,
                    descripcion
                },
                categorias: ['Pan', 'Torta', 'Pastel', 'Otro']
            });
        }

        await productoController.updateProducto(req.params.id, { nombre, clasificacion, descripcion });

        // ✅ Ahora redirige a la tabla de productos
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

// Procesar eliminación de producto
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
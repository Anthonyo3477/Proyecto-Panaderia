const express = require('express');
const router = express.Router();
const productoController = require('../../db/controllers/productoController');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Mostrar formulario para crear nuevo producto de repostería
router.get('/nuevo', (req, res) => {
    res.render('nuevo-producto', {
        title: 'Registrar Producto de Repostería',
        categorias: ['Repostería']
    });
});

// Mostrar todos los productos de repostería
router.get('/', async (req, res) => {
    try {
        const productos = await productoController.getProductosPorClasificacion('Repostería');

        res.render('Reposteria', {
            title: 'Productos de Repostería',
            productos
        });
    } catch (error) {
        console.error('Error al obtener productos de repostería:', error);
        res.status(500).render('error', { message: 'Error al cargar los productos de repostería' });
    }
});

// Mostrar detalle de un producto de repostería
router.get('/:id', async (req, res) => {
    try {
        const producto = await productoController.getProductoById(req.params.id);

        if (!producto || producto.clasificacion !== 'Repostería') {
            return res.status(404).render('error', { message: 'Producto de repostería no encontrado' });
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

// Procesar creación de producto de repostería
router.post('/insert', async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const clasificacion = 'Repostería';

        if (!nombre?.trim() || !descripcion?.trim()) {
            return res.status(400).render('nuevo-producto', {
                error: 'Todos los campos son obligatorios',
                valores: { nombre, clasificacion, descripcion },
                categorias: ['Repostería']
            });
        }

        await productoController.insertProducto({ nombre, clasificacion, descripcion });
        res.redirect('/Reposteria');
    } catch (error) {
        console.error('Error al crear producto de repostería:', error);
        res.status(500).render('nuevo-producto', {
            error: 'Error al guardar el producto',
            valores: req.body,
            categorias: ['Repostería']
        });
    }
});

// Mostrar formulario para editar producto de repostería
router.get('/editar/:id', async (req, res) => {
    try {
        const producto = await productoController.getProductoById(req.params.id);

        if (!producto || producto.clasificacion !== 'Repostería') {
            return res.status(404).render('error', { message: 'Producto de repostería no encontrado' });
        }

        res.render('editar-producto', {
            title: `Editar ${producto.nombre}`,
            producto,
            categorias: ['Repostería']
        });
    } catch (error) {
        console.error('Error al cargar el formulario de edición:', error);
        res.status(500).render('error', { message: 'Error al cargar el formulario' });
    }
});

// Procesar actualización de producto de repostería
router.post('/actualizar/:id', async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const clasificacion = 'Repostería';

        if (!nombre?.trim() || !descripcion?.trim()) {
            return res.status(400).render('editar-producto', {
                error: 'Todos los campos son obligatorios',
                producto: {
                    id: req.params.id,
                    nombre,
                    clasificacion,
                    descripcion
                },
                categorias: ['Repostería']
            });
        }

        await productoController.updateProducto(req.params.id, { nombre, clasificacion, descripcion });

        res.redirect(`/Reposteria/${req.params.id}`);
    } catch (error) {
        console.error('Error al actualizar producto de repostería:', error);
        res.status(500).render('editar-producto', {
            error: 'Error al actualizar el producto',
            producto: {
                id: req.params.id,
                nombre,
                clasificacion: 'Repostería',
                descripcion
            },
            categorias: ['Repostería']
        });
    }
});

// Procesar eliminación de producto de repostería
router.post('/eliminar/:id', async (req, res) => {
    try {
        const producto = await productoController.getProductoById(req.params.id);

        if (producto?.clasificacion !== 'Repostería') {
            return res.status(400).render('error', { message: 'Producto no es de repostería' });
        }

        await productoController.deleteProducto(req.params.id);
        res.redirect('/Reposteria');
    } catch (error) {
        console.error('Error al eliminar producto de repostería:', error);
        res.status(500).render('error', { message: 'Error al eliminar el producto' });
    }
});

module.exports = router;

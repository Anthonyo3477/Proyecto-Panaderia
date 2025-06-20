const express = require('express');
const router = express.Router();
const productoController = require('../../db/controllers/reposteriaController');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Mostrar formulario para crear nuevo producto de repostería
router.get('/nuevo', (req, res) => {
    res.render('nuevo-producto', {
        title: 'Registrar Producto de Repostería',
        categorias: ['Reposteria']
    });
});

// Procesar creación de producto de repostería
router.post('/insert', async (req, res) => {
    try {
        const { nombre, precio, descripcion } = req.body;
        const clasificacion = 'Reposteria'; // Fijo

        if (
            !nombre?.trim() ||
            !precio || isNaN(precio) ||
            !descripcion?.trim()
        ) {
            return res.status(400).render('nuevo-producto', {
                error: 'Todos los campos son obligatorios y el precio debe ser válido',
                valores: { nombre, precio, descripcion },
                categorias: ['Reposteria']
            });
        }

        await productoController.insertProductoReposteria({
            nombre,
            clasificacion,
            precio,
            descripcion
        });

        res.redirect('/Reposteria');
    } catch (error) {
        console.error('Error al crear producto de repostería:', error);
        res.status(500).render('nuevo-producto', {
            error: 'Error al guardar el producto',
            valores: req.body,
            categorias: ['Reposteria']
        });
    }
});

// Mostrar todos los productos de repostería
router.get('/', async (req, res) => {
    try {
        const productos = await productoController.getProductosReposteria();

        res.render('Reposteria', {
            title: 'Productos de Repostería',
            productos
        });
    } catch (error) {
        console.error('Error al obtener productos de repostería:', error);
        res.status(500).render('error', {
            message: 'Error al cargar los productos de repostería'
        });
    }
});

// Mostrar detalle de un producto de repostería
router.get('/:id', async (req, res) => {
    try {
        const producto = await productoController.getProductoReposteriaById(req.params.id);

        if (!producto) {
            return res.status(404).render('error', {
                message: 'Producto de repostería no encontrado'
            });
        }

        res.render('producto-detalle', {
            title: producto.nombre,
            producto
        });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).render('error', {
            message: 'Error al cargar el producto'
        });
    }
});

// Mostrar formulario para editar un producto de repostería
router.get('/editar/:id', async (req, res) => {
    try {
        const producto = await productoController.getProductoReposteriaById(req.params.id);

        if (!producto) {
            return res.status(404).render('error', {
                message: 'Producto no encontrado'
            });
        }

        res.render('EditarProducto', {
            title: 'Editar Producto de Repostería',
            producto,
            categorias: ['Reposteria']
        });
    } catch (error) {
        console.error('Error al cargar el formulario de edición:', error);
        res.status(500).render('error', {
            message: 'Error al cargar el producto'
        });
    }
});

// Procesar actualización de producto de repostería
router.post('/actualizar/:id', async (req, res) => {
    try {
        const { nombre, precio, descripcion } = req.body;
        const clasificacion = 'Reposteria';

        if (
            !nombre?.trim() ||
            !precio || isNaN(precio) ||
            !descripcion?.trim()
        ) {
            const producto = await productoController.getProductoReposteriaById(req.params.id);
            return res.status(400).render('EditarProducto', {
                error: 'Todos los campos son obligatorios y el precio debe ser válido',
                producto: {
                    id: req.params.id,
                    nombre,
                    clasificacion,
                    precio,
                    descripcion
                },
                categorias: ['Reposteria']
            });
        }

        await productoController.updateProductoReposteria(req.params.id, {
            nombre,
            clasificacion,
            precio,
            descripcion
        });

        res.redirect('/Reposteria');
    } catch (error) {
        console.error('Error al actualizar producto de repostería:', error);
        res.status(500).render('error', {
            message: 'Error al actualizar el producto'
        });
    }
});
// Procesar eliminación de producto de repostería
router.post('/eliminar/:id', async (req, res) => {
    try {
        await productoController.deleteProductoReposteria(req.params.id);
        res.redirect('/Reposteria');
    } catch (error) {
        console.error('Error al eliminar producto de repostería:', error);
        res.status(500).render('error', {
            message: 'Error al eliminar el producto'
        });
    }
});

module.exports = router;

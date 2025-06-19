const express = require('express');
const router = express.Router();
const productoController = require('../../db/controllers/reposteriaController');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Mostrar formulario para crear nuevo producto de reposteria
router.get('/nuevo', (req, res) => {
    res.render('nuevo-producto', {
        title: 'Registrar Producto de Reposteria',
        categorias: ['Reposteria']
    });
});

// Mostrar todos los productos de reposteria
router.get('/', async (req, res) => {
    try {
        const productos = await productoController.getProductosReposteria();

        res.render('Reposteria', {
            title: 'Productos de Reposteria',
            productos
        });
    } catch (error) {
        console.error('Error al obtener productos de reposteria:', error);
        res.status(500).render('error', { message: 'Error al cargar los productos de reposteria' });
    }
});

// Mostrar detalle de un producto de reposteria
router.get('/:id', async (req, res) => {
    try {
        const producto = await productoController.getProductoReposteriaById(req.params.id);

        if (!producto) {
            return res.status(404).render('error', { message: 'Producto de reposteria no encontrado' });
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

// Mostrar formulario para editar un producto de repostería
router.get('/editar/:id', async (req, res) => {
    try {
        const producto = await productoController.getProductoReposteriaById(req.params.id);
        if (!producto) {
            return res.status(404).render('error', { message: 'Producto no encontrado' });
        }

        res.render('EditarProducto', {
            title: 'Editar Producto de Repostería',
            producto
        });
    } catch (error) {
        console.error('Error al obtener producto de repostería:', error);
        res.status(500).render('error', { message: 'Error al cargar el producto' });
    }
});

// Procesar actualización de producto de repostería
router.post('/actualizar/:id', async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre?.trim() || !descripcion?.trim()) {
            const producto = await productoController.getProductoReposteriaById(req.params.id);
            return res.status(400).render('modificarproducto', {
                error: 'Todos los campos son obligatorios',
                producto
            });
        }

        await productoController.updateProductoReposteria(req.params.id, { nombre, descripcion });
        res.redirect('/Reposteria');
    } catch (error) {
        console.error('Error al actualizar producto de repostería:', error);
        res.status(500).render('error', { message: 'Error al actualizar el producto' });
    }
});

// Procesar creación de producto de reposteria
router.post('/insert', async (req, res) => {
    try {
        const { nombre, descripcion, precio, cantidad } = req.body;

        if (!nombre?.trim() || !descripcion?.trim() || !precio || !cantidad) {
            return res.status(400).render('nuevo-producto', {
                error: 'Todos los campos son obligatorios',
                valores: { nombre, descripcion, precio, cantidad },
                categorias: ['Reposteria']
            });
        }

        const producto = await productoController.insertProductoReposteria({ nombre, descripcion, precio, cantidad });
        res.redirect('/Reposteria');
    } catch (error) {
        console.error('Error al crear producto de reposteria:', error);
        res.status(500).render('nuevo-producto', {
            error: 'Error al guardar el producto',
            valores: req.body,
            categorias: ['Reposteria']
        });
    }
});

// Procesar eliminación de producto de repostería
router.post('/eliminar/:id', async (req, res) => {
    try {
        await productoController.deleteProductoReposteria(req.params.id);
        res.redirect('/Reposteria');
    } catch (error) {
        console.error('Error al eliminar producto de reposteria:', error);
        res.status(500).render('error', { message: 'Error al eliminar el producto' });
    }
});

module.exports = router;

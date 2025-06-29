const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash'); // ✅ Agregado
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para interpretar formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones
app.use(session({
    secret: 'unSecretoMuySeguro12345',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hora
}));

// Usar flash
app.use(flash());

// Middleware para pasar mensajes flash a las vistas
app.use((req, res, next) => {
    if (req.query.logout) {
        res.locals.success_msg = 'Sesión cerrada correctamente';
    }
    next();
});


// Logger para debug
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Body:', req.body);
    console.log('Sesión:', req.session);
    next();
});

// Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para proteger rutas que requieren login
function requireLogin(req, res, next) {
    if (!req.session.usuario_id) {
        return res.redirect('/Login_Registrar');
    }
    next();
}

// Solo clientes
function requireCliente(req, res, next) {
    if (req.session.usuario_id && req.session.rol === 'cliente') {
        return next();
    }
    return res.redirect('/Login_Registrar');
}

// Rutas
const productoRoutes = require('./routes/api/producto.routes.js');
app.use('/Panaderia', productoRoutes);

const reposteriaRoutes = require('./routes/api/reposteria.routes.js');
app.use('/Reposteria', reposteriaRoutes);

const carroRoutes = require('./routes/api/carro.routes.js');
app.use('/carro', requireCliente, carroRoutes);

const authRoutes = require('./routes/api/auth.routes.js');
app.use('/auth', authRoutes);

const rutas = require('./routes/index.js');
app.use(rutas);

// Página principal
app.get('/', (req, res) => {
    res.render('Index', {
        title: 'Panadería Don Juanito',
        nombreUsuario: req.session.usuario_nombre,
        rol: req.session.rol,
        success_msg: req.flash('success_msg') // ✅ pasamos el mensaje flash a la vista
    });
});

// Vista carro protegida
app.get('/carro', requireCliente, (req, res) => {
    res.render('Carro', {
        title: 'Carrito de Compras',
        nombreUsuario: req.session.usuario_nombre,
        rol: req.session.rol
    });
});

// Login y registro
app.get('/Login_Registrar', (req, res) => {
    res.render('Login_Registrar', { title: 'Iniciar Sesión' });
});

// Agregar producto solo para admin
app.get('/AgregarProducto', (req, res) => {
    if (req.session.rol !== 'admin') {
        return res.status(403).send('Acceso denegado');
    }
    res.render('AgregarProducto', { title: 'Registrar Producto' });
});

// Ruta logout con mensaje
app.get('/auth/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        req.flash('success_msg', 'Sesión cerrada correctamente.');
        res.redirect('/');
    });
});

// Error 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
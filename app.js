const express = require('express');
const path = require('path');
const session = require('express-session');
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

// Rutas importadas
const productoRoutes = require('./routes/api/producto.routes.js');
app.use('/Panaderia', productoRoutes);

const reposteriaRoutes = require('./routes/api/reposteria.routes.js');
app.use('/Reposteria', reposteriaRoutes);

const carroRoutes = require('./routes/api/carro.routes.js');
app.use('/carro', carroRoutes);

const authRoutes = require('./routes/api/auth.routes.js');
app.use('/auth', authRoutes);

const rutas = require('./routes/index.js');
app.use(rutas);

// Ruta raíz redirige a /carro si el usuario está logueado
app.get('/', (req, res) => {
    if (req.session.usuario_id) {
        // Usuario autenticado: renderiza directamente la vista Carro
        res.render('Carro', {
            title: 'Carrito de Compras',
            nombreUsuario: req.session.usuario_nombre,
            rol: req.session.rol
        });
    } else {
        // Usuario no autenticado: redirige al formulario de login
        res.redirect('/Login_Registrar');
    }
});


// Vista del carro (Carro.ejs)
app.get('/carro', (req, res) => {
    if (!req.session.usuario_id) {
        return res.redirect('/Login_Registrar');
    }

    res.render('Carro', {
        title: 'Carrito de Compras',
        nombreUsuario: req.session.usuario_nombre,
        rol: req.session.rol
    });
});

// Formulario de login y registro
app.get('/Login_Registrar', (req, res) => {
    res.render('Login_Registrar', { title: 'Iniciar Sesión' });
});

// Vista para agregar producto (accesible solo como admin si quieres protegerla)
app.get('/AgregarProducto', (req, res) => {
    if (req.session.rol !== 'admin') {
        return res.status(403).send('Acceso denegado');
    }

    res.render('AgregarProducto', { title: 'Registrar Producto' });
});

// Ruta logout
app.get('/auth/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/Login_Registrar');
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

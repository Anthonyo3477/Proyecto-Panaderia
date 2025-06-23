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

// Logger para debug - Muestra sesión en cada request
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

// ✅ Nuevo middleware: solo permite acceso a clientes
function requireCliente(req, res, next) {
    if (req.session.usuario_id && req.session.rol === 'cliente') {
        return next();
    }
    return res.redirect('/Login_Registrar');
}

// Rutas importadas
const productoRoutes = require('./routes/api/producto.routes.js');
app.use('/Panaderia', productoRoutes);

const reposteriaRoutes = require('./routes/api/reposteria.routes.js');
app.use('/Reposteria', reposteriaRoutes);

const carroRoutes = require('./routes/api/carro.routes.js');
// 🔁 Usamos el nuevo middleware requireCliente
app.use('/carro', requireCliente, carroRoutes);

const authRoutes = require('./routes/api/auth.routes.js');
app.use('/auth', authRoutes);

const rutas = require('./routes/index.js');
app.use(rutas);

// 🔁 Cambiado: ahora renderiza la página principal, no redirige directo al carro
app.get('/', (req, res) => {
    if (req.session.usuario_id) {
        return res.render('Index', {
            title: 'Panadería Don Juanito',
            nombreUsuario: req.session.usuario_nombre,
            rol: req.session.rol
        });
    }
    res.redirect('/Login_Registrar');
});

// Vista del carro (ya protegida con requireCliente)
app.get('/carro', requireCliente, (req, res) => {
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

// Vista para agregar producto (solo admin)
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
            console.error('Error al cerrar sesión:', err);
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
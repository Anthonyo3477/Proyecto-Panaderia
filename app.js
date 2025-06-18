const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares para interpretar el body antes de las rutas
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Logger para depurar body y requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Body:', req.body);
    next();
});

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas importadas y declaradas
const productoRoutes = require('./routes/api/producto.routes.js');
app.use('/Panaderia', productoRoutes); // Cambiado aquí para cargar los productos correctamente

const rutas = require('./routes/index.js');
app.use(rutas);

// Rutas principales
app.get('/', (req, res) => {
    res.render('Index', { title: 'Inicio' });
});

app.get('/Reposteria', (req, res) => {
    res.render('Reposteria', { title: 'Repostería' });
});

app.get('/Carro', (req, res) => {
    res.render('Carro', { title: 'Carro de Compras' });
});

app.get('/Login_Registrar', (req, res) => {
    res.render('Login_Registrar', { title: 'Iniciar Sesión' });
});

app.get('/AgregarProducto', (req, res) => {
    res.render('AgregarProducto', { title: 'Registrar Producto' });
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

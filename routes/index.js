const { Router } = require('express');
const routes = Router();

// Importar rutas
const indexRoutes = require('./api/index.routes');
const pedidoRoutes = require('./api/pedido.routes');
const clienteRoutes = require('./api/cliente.routes');
const adminRoutes = require('./api/admin.routes');
const authRoutes = require('./api/auth.routes');
const carroRoutes = require('./api/carro.routes');


// Añadir rutas
routes.use('/', indexRoutes);
routes.use('/pedidos', pedidoRoutes);
routes.use('/clientes', clienteRoutes);
routes.use('/admins', adminRoutes);
routes.use('/auth', authRoutes);
routes.use('/carro', carroRoutes);

module.exports = routes;
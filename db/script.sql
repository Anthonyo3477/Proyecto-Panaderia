-- Create database
CREATE DATABASE IF NOT EXISTS panaderiadb;
USE panaderiadb;

-- Admin table
CREATE TABLE IF NOT EXISTS admin (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

-- Cliente table
CREATE TABLE IF NOT EXISTS cliente (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    PRIMARY KEY (id)
);

-- Producto table
CREATE TABLE IF NOT EXISTS producto (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    clasificación VARCHAR(50),
    descripcion TEXT,
    PRIMARY KEY (id)
);

-- Pedido table
CREATE TABLE IF NOT EXISTS pedido (
    id INT(11) NOT NULL AUTO_INCREMENT,
    cliente_id INT(11) NOT NULL,
    fecha DATETIME NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

-- Pedido_detalle table
CREATE TABLE IF NOT EXISTS pedido_detalle (
    id INT(11) NOT NULL AUTO_INCREMENT,
    pedido_id INT(11) NOT NULL,
    producto_id INT(11) NOT NULL,
    cantidad INT(11) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (pedido_id) REFERENCES pedido(id),
    FOREIGN KEY (producto_id) REFERENCES producto(id)
);

-- Pasteleria table
CREATE TABLE IF NOT EXISTS pasteleria (
    id INT(11) NOT NULL AUTO_INCREMENT,
    producto_id INT(11) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    cantidad_pasteleria INT(11) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (producto_id) REFERENCES producto(id)
);

-- Pan table
CREATE TABLE IF NOT EXISTS pan (
    id INT(11) NOT NULL AUTO_INCREMENT,
    producto_id INT(11) NOT NULL,
    peso DECIMAL(6,2) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    cantidad INT(11) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (producto_id) REFERENCES producto(id)
);
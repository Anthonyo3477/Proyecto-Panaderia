-- Create database
CREATE DATABASE IF NOT EXISTS panaderiadb;
USE panaderiadb;

-- Nueva tabla usuario
CREATE TABLE IF NOT EXISTS usuario (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    rol ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',
    PRIMARY KEY (id)
);


-- Producto table
CREATE TABLE IF NOT EXISTS producto (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    clasificacion VARCHAR(50),
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    cantidad INT(11) NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
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

DROP TABLE IF EXISTS carro;

CREATE TABLE carro (
    id INT(11) NOT NULL AUTO_INCREMENT,
    usuario_id INT(11) NOT NULL,
    producto_id INT(11) NOT NULL,
    cantidad INT(11) NOT NULL,
    fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (producto_id) REFERENCES producto(id)
);
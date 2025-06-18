const { Router } = require('express');
const controller = require('../../db/controllers/pedidoController.js');
const ruta = Router();

// Obtener todos los pedidos
ruta.get("/", async (req, res) => {
    try {
        const data = await controller.getAll();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        res.status(500).send("Error al obtener los pedidos");
    }
});

// Obtener un pedido por ID
ruta.get("/:id", async (req, res) => {
    try {
        const pedido = await controller.getById(req.params.id);
        if (!pedido) return res.status(404).send("Pedido no encontrado");
        res.status(200).json(pedido);
    } catch (error) {
        console.error("Error al obtener el pedido:", error);
        res.status(500).send("Error al obtener el pedido");
    }
});

// Insertar un nuevo pedido
ruta.post("/insert", async (req, res) => {
    try {
        const result = await controller.insert(req.body);
        res.status(201).json({ mensaje: "Pedido creado con éxito", resultado: result });
    } catch (error) {
        console.error("Error al insertar el pedido:", error);
        res.status(500).send("Error al insertar el pedido");
    }
});

// Actualizar un pedido existente
ruta.put("/update/:id", async (req, res) => {
    try {
        const result = await controller.update(req.params.id, req.body);
        res.status(200).json({ mensaje: "Pedido actualizado correctamente", resultado: result });
    } catch (error) {
        console.error("Error al actualizar el pedido:", error);
        res.status(500).send("Error al actualizar el pedido");
    }
});

// Eliminar un pedido
ruta.delete("/delete/:id", async (req, res) => {
    try {
        const result = await controller.remove(req.params.id);
        res.status(200).json({ mensaje: "Pedido eliminado correctamente", resultado: result });
    } catch (error) {
        console.error("Error al eliminar el pedido:", error);
        res.status(500).send("Error al eliminar el pedido");
    }
});

module.exports = ruta;

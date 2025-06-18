const con = require('../Conexion.js');
const TABLA = "pedido";

function insert(data) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO ${TABLA} SET ?`;
        con.query(query, data, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

function getAll() {
    return new Promise((resolve, reject) => {
        const query = `SELECT p.*, c.nombre AS cliente FROM ${TABLA} p INNER JOIN cliente c ON p.cliente_id = c.id`;
        con.query(query, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

function getById(id) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${TABLA} WHERE id = ?`;
        con.query(query, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    });
}

function update(id, data) {
    return new Promise((resolve, reject) => {
        const query = `UPDATE ${TABLA} SET ? WHERE id = ?`;
        con.query(query, [data, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

function remove(id) {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM ${TABLA} WHERE id = ?`;
        con.query(query, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

module.exports = { insert, getAll, getById, update, remove };

const conn = require('../Conexion.js');
const TABLA = 'admin';

function createAdmin(admin) {
  const { nombre, correo, contraseña } = admin;
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO ${TABLA} (nombre, correo, contraseña) VALUES (?, ?, ?)`,
      [nombre, correo, contraseña],
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}

function getAllAdmins() {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT id, nombre, correo FROM ${TABLA}`, (error, result) => {
      return error ? reject(error) : resolve(result);
    });
  });
}

function getAdminById(id) {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT id, nombre, correo FROM ${TABLA} WHERE id = ?`, [id], (error, result) => {
      return error ? reject(error) : resolve(result[0]);
    });
  });
}

function getAdminByEmail(correo) {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM ${TABLA} WHERE correo = ?`, [correo], (error, result) => {
      return error ? reject(error) : resolve(result[0]);
    });
  });
}

function updateAdmin(id, admin) {
  const { nombre, correo } = admin;
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE ${TABLA} SET nombre = ?, correo = ? WHERE id = ?`,
      [nombre, correo, id],
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}

function updateAdminPassword(id, contraseña) {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE ${TABLA} SET contraseña = ? WHERE id = ?`,
      [contraseña, id],
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}

function deleteAdmin(id) {
  return new Promise((resolve, reject) => {
    conn.query(`DELETE FROM ${TABLA} WHERE id = ?`, [id], (error, result) => {
      return error ? reject(error) : resolve(result);
    });
  });
}

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  getAdminByEmail,
  updateAdmin,
  updateAdminPassword,
  deleteAdmin
};
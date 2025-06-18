const db = require('../Conexion.js');

exports.mostrarFormularioLogin = (req, res) => {
  res.render('Login_Registrar');
};

exports.login = (req, res) => {
  const { correo, contraseña } = req.body;  // Cambié 'contrasena' para evitar la ñ

  if (!correo || !contraseña) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  db.query(
    'SELECT * FROM cliente WHERE correo = ? AND contraseña = ?', // Cambié 'contraseña' a 'contrasena'
    [correo, contraseña],
    (err, resultados) => {
      if (err) {
        console.error('Error en consulta login:', err);
        return res.status(500).send('Error al verificar credenciales');
      }
      if (resultados.length > 0) {
        // Login exitoso, renderizar la vista HomeAdmin
        return res.render('HomeAdmin', { title: 'Home Administrador' });
      } else {
        // Credenciales incorrectas
        return res.status(401).send('Credenciales incorrectas');
      }

    }
  );
};

exports.registrar = (req, res) => {
  const { nombre, correo, contraseña, telefono, direccion } = req.body; // Consistencia en contrasena

  // Validación de campos obligatorios
  if (!nombre || !correo || !contraseña || !telefono || !direccion) {
    return res.status(400).json({ error: 'Faltan campos del formulario' });
  }

  db.query(
    'INSERT INTO cliente (nombre, correo, contraseña, telefono, direccion) VALUES (?, ?, ?, ?, ?)', // Cambiado contraseña a contrasena
    [nombre, correo, contraseña, telefono, direccion],
    (err) => {
      if (err) {
        console.error('Error en la base de datos:', err);
        return res.status(500).json({ error: 'Error al registrar el usuario' });
      }

      return res.status(200).json({ mensaje: 'Usuario registrado correctamente' });
    }
  );
};

const db = require('../Conexion.js');

exports.mostrarFormularioLogin = (req, res) => {
  res.render('Login_Registrar');
};

exports.login = (req, res) => {
  const { correo, contrasena } = req.body; // usa "contrasena" sin ñ

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  db.query(
    'SELECT * FROM usuario WHERE correo = ? AND contrasena = ?',
    [correo, contrasena],
    (err, resultados) => {
      if (err) {
        console.error('Error en consulta login:', err);
        return res.status(500).send('Error al verificar credenciales');
      }

      if (resultados.length > 0) {
        const usuario = resultados[0];

        // Guardar datos en sesión
        req.session.usuario_id = usuario.id;
        req.session.usuario_nombre = usuario.nombre;
        req.session.rol = usuario.rol;

        // Redirigir según rol
        if (usuario.rol === 'admin') {
          return res.redirect('/HomeAdmin');
        } else {
          return res.redirect('/');
        }

      } else {
        return res.status(401).send('Credenciales incorrectas');
      }
    }
  );
};

exports.registrar = (req, res) => {
  const { nombre, correo, contrasena, telefono, direccion, rol } = req.body;

  if (!nombre || !correo || !contrasena || !telefono || !direccion || !rol) {
    return res.status(400).json({ error: 'Faltan campos del formulario' });
  }

  db.query(
    'INSERT INTO usuario (nombre, correo, contrasena, telefono, direccion, rol) VALUES (?, ?, ?, ?, ?, ?)',
    [nombre, correo, contrasena, telefono, direccion, rol],
    (err) => {
      if (err) {
        console.error('Error en la base de datos:', err);
        return res.status(500).json({ error: 'Error al registrar el usuario' });
      }

      return res.status(200).json({ mensaje: 'Usuario registrado correctamente' });
    }
  );
};
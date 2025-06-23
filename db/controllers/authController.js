const db = require('../Conexion.js');

// Muestra el formulario de login
exports.mostrarFormularioLogin = (req, res) => {
  if (req.session.usuario_id) {
    return res.redirect('/');
  }

  const { error, returnTo } = req.query;
  res.render('Login_Registrar', {
    title: 'Iniciar Sesión',
    error,
    returnTo: returnTo || '/' // Redirige a inicio
  });
};

// Iniciar sesión
exports.login = async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.redirect('/Login_Registrar?error=Campos%20obligatorios');
  }

  try {
    const [resultados] = await db.execute(
      'SELECT * FROM usuario WHERE correo = ? AND contrasena = ?',
      [correo, contrasena]
    );

    if (resultados.length === 0) {
      return res.redirect('/Login_Registrar?error=Credenciales%20inválidas');
    }

    const usuario = resultados[0];

    // ✅ Guardar los datos en sesión con claves individuales
    req.session.usuario_id = usuario.id;
    req.session.usuario_nombre = usuario.nombre;
    req.session.rol = usuario.rol;

    // Si había un producto pendiente antes del login, lo redirige para agregarlo
    if (req.session.pendingProduct) {
      const { producto_id, cantidad } = req.session.pendingProduct;
      delete req.session.pendingProduct;
      return res.redirect(`/carro/agregar?producto_id=${producto_id}&cantidad=${cantidad}`);
    }

    // Redirige al inicio
    res.redirect('/');
  } catch (err) {
    console.error('Error en login:', err);
    res.redirect('/Login_Registrar?error=Error%20en%20el%20servidor');
  }
};

// Registrar nuevo usuario
exports.registrar = async (req, res) => {
  const { nombre, correo, contrasena, telefono, direccion, rol = 'cliente' } = req.body;

  const camposRequeridos = { nombre, correo, contrasena, telefono, direccion };
  for (const [campo, valor] of Object.entries(camposRequeridos)) {
    if (!valor) return res.status(400).json({ error: `Falta el campo: ${campo}` });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO usuario (nombre, correo, contrasena, telefono, direccion, rol)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, correo, contrasena, telefono, direccion, rol]
    );

    // ✅ Guardar también en sesión tras registro
    req.session.usuario_id = result.insertId;
    req.session.usuario_nombre = nombre;
    req.session.rol = rol;

    res.status(200).json({ 
      success: true,
      redirect: '/' // Redirige al inicio
    });

  } catch (err) {
    console.error('Error al registrar:', err);
    const errorMsg = err.code === 'ER_DUP_ENTRY' 
      ? 'El correo ya está registrado' 
      : 'Error al registrar usuario';
    res.status(500).json({ error: errorMsg });
  }
};
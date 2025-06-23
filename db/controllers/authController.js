const db = require('../Conexion.js');

exports.mostrarFormularioLogin = (req, res) => {
  // Si ya está logueado, redirigir al carrito
  if (req.session.usuario) {
    return res.redirect('/carro');
  }

  const { error, returnTo } = req.query;
  res.render('Login_Registrar', {
    title: 'Iniciar Sesión',
    error,
    returnTo: returnTo || '/carro' // Siempre redirigir al carrito por defecto
  });
};

exports.login = async (req, res) => {
  const { correo, contrasena, returnTo } = req.body;

  if (!correo || !contrasena) {
    return res.redirect('/Login_Registrar?error=Campos obligatorios');
  }

  try {
    const [resultados] = await db.execute(
      'SELECT * FROM usuario WHERE correo = ? AND contrasena = ?',
      [correo, contrasena]
    );

    if (resultados.length === 0) {
      return res.redirect('/Login_Registrar?error=Credenciales inválidas');
    }

    const usuario = resultados[0];
    req.session.usuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol
    };

    // Procesar producto pendiente si existe
    if (req.session.pendingProduct) {
      const { producto_id, cantidad } = req.session.pendingProduct;
      delete req.session.pendingProduct;
      return res.redirect(`/carro/agregar?producto_id=${producto_id}&cantidad=${cantidad}`);
    }

    // Redirigir siempre al carrito (ignorando el rol)
    res.redirect(returnTo || '/carro');

  } catch (err) {
    console.error('❌ Error en login:', err);
    res.redirect('/Login_Registrar?error=Error en el servidor');
  }
};

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

    // Autologin después de registro
    req.session.usuario = {
      id: result.insertId,
      nombre,
      rol
    };

    res.status(200).json({ 
      success: true,
      redirect: '/carro' // Siempre al carrito después de registro
    });

  } catch (err) {
    console.error('❌ Error al registrar:', err);
    const errorMsg = err.code === 'ER_DUP_ENTRY' 
      ? 'El correo ya está registrado' 
      : 'Error al registrar usuario';
    res.status(500).json({ error: errorMsg });
  }
};
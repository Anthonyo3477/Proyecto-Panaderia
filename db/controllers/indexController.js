exports.mostrarHome = (req, res) => {
    const Home = []; // o tus datos reales
    res.render('index', { title: 'Inicio - Panadería Don Juanito', Home });
};

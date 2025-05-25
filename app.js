const express = require('express');
const path = require('path');
const app = express();

const adminRoutes = require('./routes/admin');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Bienvenue sur le panneau d’administration 🎉');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));

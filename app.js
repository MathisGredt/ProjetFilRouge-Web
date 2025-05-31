const express = require('express');
const app = express();
const session = require('express-session');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const passport = require('passport');
require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
};

// Initialisation Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://encheres-app-default-rtdb.europe-west1.firebasedatabase.app/'
});

// Middleware
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({ extended: true })); // Pour les formulaires HTML
app.use(express.json()); // Pour les requêtes JSON (optionnel mais utile)
app.use(express.static('public')); // Pour servir les fichiers statiques (CSS, images, etc.)
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Passez à true si vous utilisez HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

// Import des routeurs
const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');
const usersRouter = require('./routes/users');
const offersRouter = require('./routes/offers');

// Routes
app.use('/auth', authRouter);
app.use('/dashboard', dashboardRouter);
app.use('/users', usersRouter);
app.use('/offers', offersRouter);

// Redirection vers la page d'authentification par défaut
app.get('/', (req, res) => res.redirect('/auth'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur : http://localhost:${PORT}`);
});
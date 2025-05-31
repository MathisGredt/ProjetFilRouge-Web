const express = require('express');
const app = express();
const session = require('express-session');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const passport = require('passport');
const { isAuthenticated } = require('./routes/middleware');
require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
};

// Firebase initialization
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://encheres-app-default-rtdb.europe-west1.firebasedatabase.app/'
});

// Middleware
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

// Public routes
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

// Apply authentication middleware globally
app.use(isAuthenticated);

// Protected routes
const dashboardRouter = require('./routes/dashboard');
const usersRouter = require('./routes/users');
const offersRouter = require('./routes/offers');
app.use('/dashboard', dashboardRouter);
app.use('/users', usersRouter);
app.use('/offers', offersRouter);

// Default route
app.get('/', (req, res) => res.redirect('/auth'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
});
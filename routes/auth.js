const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const axios = require('axios');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// ----------- GOOGLE PASSPORT STRATEGY -----------
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const usersSnapshot = await db.ref('users').once('value');
        const users = usersSnapshot.val() || {};

        let matchedUser = null;
        for (const uid in users) {
            if (users[uid].email === email || users[uid].email1 === email) {
                matchedUser = users[uid];
                break;
            }
        }

        if (!matchedUser) {
            return done(null, false, { message: "Utilisateur non trouvé." });
        }
        if (!matchedUser.admin) {
            return done(null, false, { message: "Accès refusé. Seuls les administrateurs peuvent se connecter." });
        }

        return done(null, {
            uid: matchedUser.uid,
            name: matchedUser.name,
            email: matchedUser.email || matchedUser.email1
        });
    } catch (err) {
        return done(err, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// ----------- ROUTES -----------

router.get('/', (req, res) => {
    res.render('login', { error: null });
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).send('Erreur lors de la déconnexion');
        }
        res.redirect('/auth'); // Redirect to the authentication page
    });
});

router.post('/', async (req, res) => {
    const email = req.body.username || req.body.email; // selon le champ du formulaire
    const password = req.body.password;

    try {
        // Vérifie dans Realtime Database si un utilisateur avec cet email existe
        const usersSnapshot = await db.ref('users').once('value');
        const users = usersSnapshot.val() || {};

        let matchedUser = null;
        for (const uid in users) {
            if (users[uid].email === email || users[uid].email1 === email) {
                matchedUser = users[uid];
                break;
            }
        }

        if (!matchedUser) {
            return res.render('login', { error: 'Utilisateur non trouvé.' });
        }
        if (!matchedUser.admin) {
            return res.render('login', { error: 'Accès refusé. Seuls les administrateurs peuvent se connecter.' });
        }

        // Authentifier avec l'API REST de Firebase
        const apiKey = process.env.FIREBASE_API_KEY;
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

        await axios.post(url, {
            email: email,
            password: password,
            returnSecureToken: true
        });

        req.session.user = {
            uid: matchedUser.uid,
            name: matchedUser.name,
            email: matchedUser.email || matchedUser.email1
        };

        return res.redirect('/dashboard');
    } catch (error) {
        console.error('Erreur d\'authentification :', error.response?.data || error.message);
        return res.render('login', { error: 'Email ou mot de passe incorrect.' });
    }
});

// ----------- GOOGLE OAUTH ROUTES -----------
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth',
        failureFlash: false
    }),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/dashboard');
    }
);

module.exports = router;
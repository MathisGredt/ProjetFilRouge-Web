const express = require('express');
const admin = require('firebase-admin'); // Import du Firebase Admin SDK
const router = express.Router();
const db = admin.database();
const axios = require('axios');



router.get('/', (req, res) => {
    res.render('login', { error: null }); // Pass an empty error by default
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Vérifier si l'utilisateur est dans la base "admins"
        const adminSnapshot = await db.ref('admins').once('value');
        const admins = adminSnapshot.val();

        if (!admins || !Object.values(admins).includes(username)) {
            return res.render('login', { error: 'Accès refusé : vous n’êtes pas un administrateur autorisé.' });
        }

        // Authentifier via l'API REST de Firebase Auth
        const firebaseApiKey = process.env.FIREBASE_API_KEY;

        const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`, {
            email: username,
            password: password,
            returnSecureToken: true
        });

        // Connexion réussie
        req.session.user = response.data.email; // si tu utilises des sessions
        return res.redirect('/dashboard');

    } catch (error) {
        console.error('Erreur lors de l\'authentification :', error.response?.data || error.message);

        // Affichez l'erreur complète pour déboguer
        if (error.response?.data) {
            console.log('Détails de l\'erreur Firebase :', error.response.data);
        }

        return res.render('login', { error: 'Email ou mot de passe incorrect.' });
    }
});


module.exports = router;
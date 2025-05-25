const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

router.get('/dashboard', async (req, res) => {
    try {
        const snapshot = await db.ref('test').once('value');
        const data = snapshot.val();

        // Convertit l'objet en tableau
        const users = data ? Object.values(data) : [];

        res.render('dashboard', { users });
    } catch (error) {
        console.error('Erreur de connexion à la Realtime Database :', error.stack);
        res.status(500).send('Erreur de connexion à la base de données');
    }
});

module.exports = router;

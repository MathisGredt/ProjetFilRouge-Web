const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.database();

router.get('/', async (req, res) => {
    const snapshot = await db.ref('offers').once('value');
    const offers = snapshot.exists() ? snapshot.val() : {};
    res.render('offers', { offers });
});

router.post('/delete/:id', async (req, res) => {
    await db.ref('offers/' + req.params.id).remove();
    res.redirect('/offers');
});

module.exports = router;
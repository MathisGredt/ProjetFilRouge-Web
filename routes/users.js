const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.database();

router.get('/', async (req, res) => {
    const snapshot = await db.ref('users').once('value');
    const users = snapshot.exists() ? snapshot.val() : {};
    res.render('users', { users });
});

router.post('/delete/:id', async (req, res) => {
    await db.ref('users/' + req.params.id).remove();
    res.redirect('/users');
});

module.exports = router;
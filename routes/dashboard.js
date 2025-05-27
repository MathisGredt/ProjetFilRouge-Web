const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.database();

router.get('/', async (req, res) => {
    const users = await db.ref('users').once('value');
    const offers = await db.ref('offers').once('value');
    const bids = await db.ref('bids').once('value');

    res.render('dashboard', {
        usersCount: users.exists() ? Object.keys(users.val()).length : 0,
        offersCount: offers.exists() ? Object.keys(offers.val()).length : 0,
        bidsCount: bids.exists() ? Object.keys(bids.val()).length : 0
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const ShortURL = require('../models/ShortUrl');
const shortid = require('shortid');

// middleware to verify jwt token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ error: 'Access denied. Token is required.' });
    }
    jwt.verify(token, config.secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.userId = decoded.userId;
        next();
    });
};

router.post('/shorten', verifyToken, async (req, res) => {
    try {
        const { originalURL } = req.body;
        // short ID generation using shortid
        const shortID = shortid.generate();
        const user = req.userId;
        const shortURL = new ShortURL({ originalURL, shortID, user });
        await shortURL.save();
        res.json({
            originalURL: shortURL.originalURL,
            shortURL: `http://yourdomain.com/${shortURL.shortID}`,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//routes for accessing the original URL using the short ID
router.get('/:shortID', async (req, res) => {
    try {
        const { shortID } = req.params;
        const shortURL = await ShortURL.findOne({ shortID });
        if (!shortURL) {
            return res.status(404).json({ error: 'Short URL not found' });
        }
        res.json({ originalURL: shortURL.originalURL });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;

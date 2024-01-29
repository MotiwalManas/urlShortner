const mongoose = require('mongoose');

const shortURLSchema = new mongoose.Schema({
    originalURL: { type: String, required: true },
    shortID: { type: String, unique: true, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const ShortURL = mongoose.model('ShortURL', shortURLSchema);

module.exports = ShortURL;

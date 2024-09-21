const mongoose = require('mongoose');

const favoriteComicSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comic',
        required: true
    }
}, { timestamps: true });

const FavoriteComic = mongoose.model('FavoriteComic', favoriteComicSchema);

module.exports = FavoriteComic;
// models/Comic.js
const mongoose = require('mongoose');

const comicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        trim: true,
    },
    year: {
        type: Number,
    },
    description: {
        type: String,
        required: false,
    },
    genres: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
    }],
    chapters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
    }],
    readCount: {
        type: Number,
        default: 0,
    },
    coverImage: {
        type: String, // Lưu đường dẫn ảnh bìa
        required: false,
    },
}, { timestamps: true });

const Comic = mongoose.model('Comic', comicSchema);

module.exports = Comic;
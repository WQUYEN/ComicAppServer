const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
        trim: true,
    },
    chapterNumber: {
        type: Number,
        required: true,
        min: 0,
    },
    content: {
        type: String,
        required: false,
    },
    images: { // Lưu trữ mảng các liên kết ảnh
        type: [String],
        required: true,
    },
    comic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comic',
        required: true,
    },
}, { timestamps: true });// Thêm timestamps cho createdAt và updatedAt

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;
const mongoose = require('mongoose');

const readingHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Giả sử bạn có mô hình User
        required: true,
    },
    comic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comic',
        required: true,
    },
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
        required: true,
    },
    lastReadAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const ReadingHistory = mongoose.model('ReadingHistory', readingHistorySchema);

module.exports = ReadingHistory;
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    comic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comic',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true }); // Timestamps để tự động thêm createdAt và updatedAt

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
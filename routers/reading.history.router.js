const express = require('express');
const {
    updateReadingHistory,
    getReadingHistory
} = require('../controllers/reading.history.controller'); // Đường dẫn đến controller

const router = express.Router();

// Route để cập nhật lịch sử đọc
router.post('/update', updateReadingHistory);
//router.post('/update/:userId/:comicId/:chapterId', updateReadingHistory);

// Route để lấy lịch sử đọc của người dùng
router.get('/:userId', getReadingHistory);

module.exports = router;
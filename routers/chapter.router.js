// routes/chapter.router.js
const express = require('express');
const {
    createChapter,
    updateChapter,
    deleteChapter,
    getChapterDetails,
    getChapters
} = require('../controllers/chapter.controller');
const uploadMultiple = require('../middleware/multer.middleware'); // Nhập middleware

const router = express.Router();
// Route xem ds cahpter
router.get('/:comicId',getChapters);
// Route để thêm chapter
router.post('/add', uploadMultiple, createChapter);

// Route để sửa chapter
router.put('/update/:id', uploadMultiple, updateChapter);

// Route để xóa chapter
router.delete('/delete/:id', deleteChapter);

// Route để xem chi tiết chapter
router.get('/:comicId/read/:chapterId', getChapterDetails);

module.exports = router;
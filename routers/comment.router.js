const express = require('express');
const {
    createComment,
    editComment,
    deleteComment,
    getCommentsByComicId
} = require('../controllers/comment.controller'); // Đảm bảo đường dẫn đúng

const router = express.Router();

router.get('/comic/:comicId',getCommentsByComicId);
router.post('/create', createComment); // POST: Tạo comment
router.put('/:commentId', editComment); // PUT: Chỉnh sửa comment
router.delete('/:commentId', deleteComment); // DELETE: Xóa comment

module.exports = router;
const express = require('express');
const upload = require('../configs/setup.multer'); // Đường dẫn tới file cấu hình multer
const {
    getAllComics,
    getComicById,
    createComic,
    updateComic,
    deleteComic,
} = require('../controllers/comic.controller');

const router = express.Router();

// Khởi động API
router.get('/', (req, res) => {
    res.status(200).send('Comics API');
});

// Các route
router.get('/list', getAllComics); // Lấy tất cả truyện
router.get('/:id', getComicById); // Lấy truyện theo ID
router.post('/add',upload.single('coverImage'), createComic); // Tạo mới truyện
router.put('/update/:id', updateComic); // Cập nhật truyện theo ID
router.delete('/delete/:id', deleteComic); // Xóa truyện theo ID

module.exports = router;
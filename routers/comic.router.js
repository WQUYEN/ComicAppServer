const express = require('express');
const path = require('path'); 
const upload = require('../configs/setup.multer'); // Đường dẫn tới file cấu hình multer
const {
    getAllComics,
    getComicById,
    createComic,
    updateComic,
    deleteComic,
    getComicsSortedByReadCount,
    getComicByIdHtml
} = require('../controllers/comic.controller');

const router = express.Router();

// Khởi động API
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'comic.management.html'));
});
// Route cho trang thêm truyện
router.get('/add', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'comic.add.html')); // Đường dẫn tới tệp thêm truyện
});
// Router cho trang chi tiết truyện
router.get('/detail/html/:id', async (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'comic.detail.html')); // Trả về tệp HTML

});
// Router cho trang sửa tiết truyện
router.get('/edit/html/:id', async (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'comic.edit.html')); // Trả về tệp HTML

});
// Các route
router.get('/list', getAllComics); // Lấy tất cả truyện
router.get('/detail/:id', getComicById); // Lấy truyện theo ID
router.get('/html/detail/:id', getComicByIdHtml); // Lấy truyện theo ID

router.get('/top', getComicsSortedByReadCount);
router.post('/add',upload.single('coverImage'), createComic); // Tạo mới truyện
router.put('/update/:id',upload.single('coverImage'), updateComic); // Cập nhật truyện theo ID
router.delete('/delete/:id', deleteComic); // Xóa truyện theo ID

module.exports = router;
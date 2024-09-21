const express = require('express');
const genreController = require('../controllers/genre.controller');
const router = express.Router();

// Endpoint gốc cho API Genre
router.get('/', (req, res) => {
  res.status(200).send('Genres API');
});

// Thêm thể loại mới
router.post('/add', genreController.createGenre);

// Sửa thể loại theo ID
router.put('/update/:id', genreController.updateGenre);

// Xóa thể loại theo ID
router.delete('/delete/:id', genreController.deleteGenre);

// Lấy danh sách tất cả thể loại
router.get('/list', genreController.getAllGenres);

// Lấy thể loại theo ID
router.get('/:id', genreController.getGenreById);

module.exports = router;
const express = require('express');
const router = express.Router();
const { addFavoriteComic, removeFavoriteComic,getFavoriteComicsByUserId,checkFavoriteStatus } = require('../controllers/favorite.controller');

// Thêm truyện yêu thích
router.post('/add', addFavoriteComic);

// Xóa truyện yêu thích
router.delete('/remove', removeFavoriteComic);

router.get('/:userId',getFavoriteComicsByUserId);

router.post('/check',checkFavoriteStatus);

module.exports = router;
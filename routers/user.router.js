// user.router.js
const express = require('express');
const upload = require('../configs/setup.multer'); // Đường dẫn tới file cấu hình multer
const{userLogin, getAllUsers, getUserById, createUser,uploadAvatar} = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();
router.get('/', (req, res) => {
  res.status(200).send('Users API');
});

router.post('/register',createUser);
router.post('/login', userLogin);
router.get('/list', getAllUsers);
router.get('/:id',authMiddleware, getUserById);
router.post('/upload/avatar',authMiddleware,upload.single('avatar'),uploadAvatar);

module.exports = router;
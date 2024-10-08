// user.router.js
const express = require('express');
const upload = require('../configs/setup.multer'); // Đường dẫn tới file cấu hình multer
const{userLogin, getAllUsers, getUserById, createUser} = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();
router.get('/', (req, res) => {
  res.status(200).send('Users API');
});

router.post('/register',upload.single('avatar'),createUser);
router.post('/login', userLogin);
router.get('/list', getAllUsers);
router.get('/:id',authMiddleware, getUserById);

module.exports = router;
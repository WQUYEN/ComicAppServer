// user.router.js
const express = require('express');
const userController = require('../controllers/user.controller');
const upload = require('../configs/setup.multer'); // Đường dẫn tới file cấu hình multer
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('Users API');
});

router.post('/register',upload.single('avatar'), userController.createUser);
router.post('/login', userController.userLogin);
router.get('/list', userController.getAllUsers);
router.get('/:id', userController.getUserById);

module.exports = router;
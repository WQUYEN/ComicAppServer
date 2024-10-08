// user.controller.js
require('dotenv').config(); 
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2; // Đảm bảo bạn đã cấu hình Cloudinary
const JWT_KEY = process.env.JWT_KEY;

const createUser = async (req, res) => {
  try {
    const {name, email, password,} = req.body;

    // Lấy tệp avatar từ req.file (do dùng upload.single)
    const avatarFile = req.file; // Sử dụng req.file thay vì req.files
    if (!avatarFile) {
      return res.status(400).json({ message: 'Avatar image is required.' });
    }
      // Tải ảnh avatar lên Cloudinary từ buffer
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'user_avatars' }, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        }).end(avatarFile.buffer); // Gọi .end với buffer
    });

    // Tạo người dùng mới
    const user = new User({
      name,
      email,
      password,
      avatar: result.secure_url // Gán đường dẫn avatar vào đối tượng người dùng
    });

    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message }); // Gửi thông báo lỗi
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({ users });
  } catch (error) {
    res.status(400).send({ error });
  }
};
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_KEY, { expiresIn: '1h' });
    
    res.status(200).send({ user, token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(401).send({ error: error.message });
  }
};


const getUserById = async (req, res) => {
  try {
      const userId = req.params.id;
      // Kiểm tra xem userId từ token có khớp với userId từ params không
      if (req.userId.toString() !== userId) {
          console.warn('Access denied: User ID mismatch');
          return res.status(403).json({ error: 'Access denied' });
      }

      // Tìm người dùng trong cơ sở dữ liệu
      const user = await User.findById(userId);

      if (!user) {
          console.warn('User not found:', userId);
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).send(user);
  } catch (error) {
      console.error('Error fetching user:', error.message);
      res.status(400).send({ error: error.message });
  }
};
module.exports = {createUser, userLogin, getAllUsers, getUserById}
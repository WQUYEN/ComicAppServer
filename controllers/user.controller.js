// user.controller.js
const User = require('../models/user.model');

const cloudinary = require('cloudinary').v2; // Đảm bảo bạn đã cấu hình Cloudinary

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

const userLogin = async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await User.findByCredentials(email, password);
      res.status(200).send({ user });
  } catch (error) {
      console.error('Login error:', error.message); // Ghi log lỗi
      res.status(401).send({ error: error.message }); // Trả về mã trạng thái 401
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

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ error: 'User not founds !' });
    }

    res.status(200).send( user );
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
module.exports = {createUser, userLogin, getAllUsers, getUserById}
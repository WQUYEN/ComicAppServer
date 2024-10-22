require('dotenv').config(); 
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2; // Đảm bảo bạn đã cấu hình Cloudinary
const JWT_KEY = process.env.JWT_KEY;

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Tạo người dùng mới (không có avatar)
    const user = new User({
      name,
      email,
      password,
      // avatar: result.secure_url // Không gán avatar
    });

    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message }); // Gửi thông báo lỗi
  }
};

// const uploadAvatar = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const avatarFile = req.file; // Lấy tệp avatar từ req.file

//     if (!avatarFile) {
//       return res.status(400).json({ message: 'Avatar image is required.' });
//     }

//     // Tải ảnh avatar lên Cloudinary và cập nhật thông tin người dùng
//     const result = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         { folder: 'user_avatars' },
//         async (error, result) => {
//           if (error) {
//             return reject(error);
//           }

//           // Cập nhật avatar cho người dùng
//           const user = await User.findByIdAndUpdate(
//             userId,
//             { avatar: result.secure_url },
//             { new: true }
//           );

//           if (!user) {
//             return reject(new Error('User not found.'));
//           }

//           resolve(user); // Trả về thông tin người dùng đã cập nhật
//         }
//       ).end(avatarFile.buffer); // Gọi .end với buffer
//     });

//     res.status(200).send(result); // Gửi thông tin người dùng đã cập nhật
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// };

// const uploadAvatar = async (req, res) => {
//   try {
   

//     // Xác thực token
//     const decoded = jwt.verify(token, JWT_KEY);
//     const userIdFromToken = decoded._id; // Lấy userId từ token

//     const userId = req.params.id;
//     if (userIdFromToken.toString() !== userId) {
//       console.warn('Access denied: User ID mismatch');
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const avatarFile = req.file; // Lấy tệp avatar từ req.file

//     if (!avatarFile) {
      
//       return res.status(400).json({ message: 'Avatar image is required.' });
//     }

//     // Tải ảnh avatar lên Cloudinary và cập nhật thông tin người dùng
//     const result = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         { folder: 'user_avatars' },
//         async (error, result) => {
//           if (error) {
//             return reject(error);
//           }

//           // Cập nhật avatar cho người dùng
//           const user = await User.findByIdAndUpdate(
//             userId,
//             { avatar: result.secure_url },
//             { new: true }
//           );

//           if (!user) {
//             return reject(new Error('User not found.'));
//           }

//           resolve(user); // Trả về thông tin người dùng đã cập nhật
//         }
//       ).end(avatarFile.buffer); // Gọi .end với buffer
//     });

//     res.status(200).send(result); // Gửi thông tin người dùng đã cập nhật
//   } catch (error) {
//       console.error('Error in uploadAvatar:', error); // Ghi log lỗi

//     res.status(400).send({ error: error.message });
//   }
// };
const uploadAvatar = async (req, res) => {
  try {
    // const token = req.headers.authorization?.split(' ')[1];
    // if (!token) {
    //   return res.status(401).json({ message: 'Token is required.' });
    // }

    // Xác thực token
    // const decoded = jwt.verify(token, JWT_KEY);
    // const userIdFromToken = decoded._id; // Lấy userId từ token

    const { userId } = req.body; // Lấy userId từ body
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }
    if (req.userId.toString() !== userId) {
      console.warn('Access denied: User ID mismatch');
      return res.status(403).json({ error: 'Access denied' });
    }

    // // Kiểm tra xem userId từ token có khớp không
    // if (userIdFromToken.toString() !== userId) {
    //   console.warn('Access denied: User ID mismatch');
    //   return res.status(403).json({ message: 'Access denied' });
    // }

    const avatarFile = req.file; // Lấy tệp avatar từ req.file
    if (!avatarFile) {
      return res.status(400).json({ message: 'Avatar image is required.' });
    }

    // // Kiểm tra ID người dùng
    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //   return res.status(400).json({ message: 'Invalid user ID.' });
    // }

    // Tải ảnh avatar lên Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'user_avatars' },
        async (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error); // Ghi log lỗi
            return reject(error);
          }

          // Cập nhật avatar cho người dùng
          const user = await User.findByIdAndUpdate(
            userId,
            { avatar: result.secure_url },
            { new: true }
          );

          if (!user) {
            return reject(new Error('User not found.'));
          }

          resolve(user); // Trả về thông tin người dùng đã cập nhật
        }
      ).end(avatarFile.buffer); // Gọi .end với buffer
    });

    res.status(200).send(result); // Gửi thông tin người dùng đã cập nhật
  } catch (error) {
    console.error('Error in uploadAvatar:', error); // Ghi log lỗi
    res.status(400).send({ error: error.message });
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
    if (req.userId.toString() !== userId) {
      console.warn('Access denied: User ID mismatch');
      return res.status(403).json({ error: 'Access denied' });
    }

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

module.exports = { createUser, userLogin, getAllUsers, getUserById, uploadAvatar }; 
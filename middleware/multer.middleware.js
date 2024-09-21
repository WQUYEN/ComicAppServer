const upload = require('../configs/setup.multer'); // Nhập config multer

// Hàm middleware cho tải lên nhiều file
const uploadMultiple = (req, res, next) => {
    const uploadFields = upload.fields([
        { name: 'images', maxCount: 10 }, // Tên trường cho nhiều tệp
        { name: 'coverImage', maxCount: 1 } // Tên trường cho ảnh bìa
    ]);

    uploadFields(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

// Xuất middleware
module.exports = uploadMultiple;
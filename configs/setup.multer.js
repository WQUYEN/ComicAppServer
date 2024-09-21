const multer = require('multer');

// Thiết lập nơi lưu trữ file trong bộ nhớ
const storage = multer.memoryStorage(); // Sử dụng memoryStorage

// Kiểm tra loại file (cho phép loại file ảnh)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/; // Các loại file được cho phép
    const isValidMimetype = allowedTypes.test(file.mimetype);

    if (isValidMimetype) {
        return cb(null, true); // Cho phép file
    } else {
        cb(new Error('Chỉ cho phép file hình ảnh!')); // Bỏ qua file
    }
};

// Tạo instance multer với cấu hình
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Đặt giới hạn kích thước file (5MB)
    fileFilter: fileFilter // Sử dụng hàm kiểm tra loại file
});

// Xuất config multer
module.exports = upload;
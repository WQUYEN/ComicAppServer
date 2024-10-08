const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Đường dẫn đến mô hình User
require('dotenv').config(); 

const JWT_KEY = process.env.JWT_KEY; // Sử dụng biến môi trường hoặc giá trị mặc định

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const tokenValue = token.split(' ')[1];

    jwt.verify(tokenValue, JWT_KEY, (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err); // Ghi log lỗi xác thực
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userId = decoded._id; // Gán userId vào req
        console.log("middleware userId ",req.userId);
        
        next();
    });
};

module.exports = authMiddleware;
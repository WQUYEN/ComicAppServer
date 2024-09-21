// controllers/comicController.js
const Comic = require('../models/comic.model');
const cloudinary = require('../configs/setup.cloudinary');
const Chapter = require('../models/chapter.model'); // Import model Chapter nếu cần
const multer = require('multer');
const storage = multer.memoryStorage(); // Sử dụng bộ nhớ thay vì folder
const upload = multer({ storage: storage });

// Đọc tất cả truyện
const getAllComics = async (req, res) => {
    try {
        const comics = await Comic.find(); // Thêm populate nếu cần
        return res.status(200).json(comics);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching comics', error });
    }
};
// Đọc truyện theo ID
const getComicById = async (req, res) => {
    const { id } = req.params;
    try {
        const comic = await Comic.findById(id).populate('genres chapters'); // Populate cả genres và chapters

        if (!comic) {
            return res.status(404).json({ message: 'Comic not found' });
        }

        return res.status(200).json(comic);
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Error fetching comic', error });
    }
};
const createComic = async (req, res) => {
    try {
        const { name, author, year, description, genres } = req.body;

        // Lấy tệp ảnh bìa từ req.file (do dùng upload.single)
        const coverImageFile = req.file; // Sử dụng req.file thay vì req.files

        // Kiểm tra xem file có tồn tại không
        if (!coverImageFile) {
            return res.status(400).json({ message: 'Cover image is required.' });
        }

        // Tải ảnh bìa lên Cloudinary từ buffer
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder: 'comic_covers' }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }).end(coverImageFile.buffer); // Gọi .end với buffer
        });

        // Tạo mới comic
        const newComic = new Comic({
            name,
            author,
            year,
            description,
            genres,
            coverImage: result.secure_url, // Lưu link ảnh vào cơ sở dữ liệu
        });

        // Lưu comic vào cơ sở dữ liệu
        await newComic.save();
        return res.status(201).json(newComic);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating comic', error: error.message });
    }
};
// Sửa truyện theo ID
const updateComic = async (req, res) => {
    try {
        const { name, author, year, description, genres, chapters } = req.body;
        const updatedComic = await Comic.findByIdAndUpdate(
            req.params.id,
            { name, author, year, description, genres, chapters },
            { new: true, runValidators: true }
        ).populate('genres chapters');
        if (!updatedComic) return res.status(404).json({ message: 'Comic not found' });
        return res.json(updatedComic);
    } catch (error) {
        return res.status(400).json({ message: 'Error updating comic', error });
    }
};

// Xoá truyện theo ID
const deleteComic = async (req, res) => {
    try {
        const deletedComic = await Comic.findByIdAndDelete(req.params.id);
        if (!deletedComic) return res.status(404).json({ message: 'Comic not found' });
        return res.json({ message: 'Comic deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
// controllers/comicController.js


// Xuất các hàm controller
module.exports = {
    getAllComics,
    getComicById,
    createComic,
    updateComic,
    deleteComic,
};
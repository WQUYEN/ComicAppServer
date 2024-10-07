// controllers/comicController.js
const Comic = require('../models/comic.model');
const cloudinary = require('../configs/setup.cloudinary');
const multer = require('multer');
const storage = multer.memoryStorage(); // Sử dụng bộ nhớ thay vì folder

// Đọc tất cả truyện và sắp xếp theo updatedAt
const getAllComics = async (req, res) => {
    try {
        // Lấy tất cả truyện và populate các thể loại
        const comics = await Comic.find().sort({ updatedAt: -1 }); // Sắp xếp theo updatedAt giảm dần
        return res.status(200).json(comics);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách truyện:', error);
        return res.status(500).json({ message: 'Lỗi khi lấy danh sách truyện.', error });
    }
};
const getComicsSortedByReadCount = async (req, res) => {
    try {
        // Lấy tất cả truyện và sắp xếp theo readCount giảm dần
        const comics = await Comic.find().sort({ readCount: -1 }); // Sử dụng sort để sắp xếp
        
        if (comics.length === 0) {
            return res.status(200).json({
                code: 200,
                message: 'Không có truyện nào được tìm thấy.',
                data: [],
            });
        }

        // Trả về danh sách truyện đã sắp xếp
        return res.status(200).json({
            code: 200,
            message: 'Lấy danh sách truyện theo số lượt đọc thành công!',
            data: comics,
        });
    } catch (error) {
        console.error('Error fetching comics sorted by read count:', error); // In lỗi ra console
        return res.status(500).json({ code: 500, message: 'Error fetching comics', error });
    }
};
const getComicById = async (req, res) => {
    const { id } = req.params;
    try {
        const comic = await Comic.findById(id).populate('genres chapters'); // Populate genres và chapters

        if (!comic) {
            return res.status(404).json({ message: 'Comic not found' });
        }

        // Chỉ giữ lại ID hoặc tên của các genre
        const genreNames = comic.genres.map(genre => genre.name); // Hoặc genre._id nếu bạn muốn ID

        // Chỉ giữ lại ID của các chapter
        const chapterIds = comic.chapters.map(chapter => chapter._id);

        // Tạo một đối tượng phản hồi chỉ chứa các thông tin cần thiết
        const response = {
            _id: comic._id,
            name: comic.name,
            author: comic.author,
            year: comic.year,
            description: comic.description,
            genres: genreNames, // Trả về danh sách tên của genres
            chapters: chapterIds, // Trả về danh sách ID của chapters
            readCount: comic.readCount,
            coverImage: comic.coverImage,
            createdAt: comic.createdAt,
            updatedAt: comic.updatedAt,
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Error fetching comic', error });
    }
};
const getComicByIdHtml = async (req, res) => {
    const { id } = req.params;
    try {
        const comic = await Comic.findById(id).populate('genres chapters'); // Populate genres và chapters

        if (!comic) {
            return res.status(404).json({ message: 'Comic not found' });
        }

        // Chỉ giữ lại ID hoặc tên của các genre
        const genreNames = comic.genres.map(genre => genre.name); // Hoặc genre._id nếu bạn muốn ID

        // Chỉ giữ lại ID của các chapter
        const chapterIds = comic.chapters.map(chapter => chapter._id);

        // Tạo một đối tượng phản hồi chỉ chứa các thông tin cần thiết
        const response = {
            _id: comic._id,
            name: comic.name,
            author: comic.author,
            year: comic.year,
            description: comic.description,
            genres: comic.genres, // Trả về danh sách tên của genres
            chapters: chapterIds, // Trả về danh sách ID của chapters
            readCount: comic.readCount,
            coverImage: comic.coverImage,
            createdAt: comic.createdAt,
            updatedAt: comic.updatedAt,
        };

        return res.status(200).json(response);
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
            return res.status(400).json({ message: 'Ảnh bìa là bắt buộc.' });
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
            genres: JSON.parse(genres), // Chuyển đổi chuỗi genres thành mảng
            coverImage: result.secure_url, // Lưu link ảnh vào cơ sở dữ liệu
        });
            
        // Lưu comic vào cơ sở dữ liệu
        await newComic.save();

        // Trả về phản hồi thành công với thông tin của comic mới
        return res.json({
            message: 'Truyện đã được thêm thành công!',
            comic: newComic
        });
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi khi tạo truyện', error: error.message });
    }
};
// Sửa truyện theo ID
// const updateComic = async (req, res) => {
//     try {
//         const { name, author, year, description, genres, chapters } = req.body;
//         const coverImageFile = req.file; // Lấy tệp ảnh bìa nếu có

//         // Tạo đối tượng cập nhật
//         const updateData = {
//             name,
//             author,
//             year,
//             description,
//             genres: JSON.parse(genres), // Chuyển đổi chuỗi genres thành mảng
//             chapters
//         };

//         // Nếu có tệp ảnh bìa, tải lên Cloudinary và cập nhật link
//         if (coverImageFile) {
//             const result = await new Promise((resolve, reject) => {
//                 cloudinary.uploader.upload_stream({ folder: 'comic_covers' }, (error, result) => {
//                     if (error) {
//                         return reject(error);
//                     }
//                     resolve(result);
//                 }).end(coverImageFile.buffer);
//             });
//             updateData.coverImage = result.secure_url; // Cập nhật link ảnh bìa
//         }

//         // Cập nhật truyện trong cơ sở dữ liệu
//         const updatedComic = await Comic.findByIdAndUpdate(
//             req.params.id,
//             updateData,
//             { new: true, runValidators: true }
//         ).populate('genres chapters');

//         if (!updatedComic) {
//             return res.status(404).json({ message: 'Comic not found' });
//         }

//         return res.json(updatedComic);
//     } catch (error) {
//         return res.status(400).json({ message: 'Error updating comic', error: error.message });
//     }
// };
const updateComic = async (req, res) => {
    try {
        const { name, author, year, description, genres, chapters } = req.body;
        const coverImageFile = req.file; // Lấy tệp ảnh bìa nếu có

        console.log(req.body); // Ghi lại nội dung req.body để kiểm tra

        // Tạo đối tượng cập nhật
        const updateData = {
            name,
            author,
            year,
            description,
            chapters
        };

        // Kiểm tra và chuyển đổi genres nếu có
        if (genres) {
            try {
                updateData.genres = JSON.parse(genres); // Chuyển đổi chuỗi genres thành mảng
            } catch (error) {
                console.error('Lỗi khi phân tích genres:', error);
                return res.status(400).json({ message: 'Genres không hợp lệ.' });
            }
        } else {
            updateData.genres = []; // Giá trị mặc định nếu không có genres
        }

        // Nếu có tệp ảnh bìa, tải lên Cloudinary và cập nhật link
        if (coverImageFile) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ folder: 'comic_covers' }, (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                }).end(coverImageFile.buffer);
            });
            updateData.coverImage = result.secure_url; // Cập nhật link ảnh bìa
        }

        // Cập nhật truyện trong cơ sở dữ liệu
        const updatedComic = await Comic.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('genres chapters');

        if (!updatedComic) {
            return res.status(404).json({ message: 'Comic not found' });
        }

        return res.json(updatedComic);
    } catch (error) {
        console.error('Error updating comic:', error); // Log chi tiết lỗi
        return res.status(400).json({ message: 'Error updating comic', error: error.message });
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
    getComicsSortedByReadCount,
    getComicByIdHtml
};
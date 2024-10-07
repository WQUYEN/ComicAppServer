const Chapter = require('../models/chapter.model');
const cloudinary = require('../configs/setup.cloudinary');
const Comic = require('../models/comic.model');

const createChapter = async (req, res) => {
    try {
        const { title, chapterNumber, content, comicId } = req.body;

        // Kiểm tra xem req.files.images có phải là mảng không
        if (!Array.isArray(req.files.images) || req.files.images.length === 0) {
            return res.status(400).json({ message: 'No images uploaded or invalid file format' });
        }

        // Tải ảnh lên Cloudinary
        const imageUploadPromises = req.files.images.map(file => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result.secure_url);
                }).end(file.buffer);
            });
        });

        const images = await Promise.all(imageUploadPromises);

        // Tạo mới chapter
        const newChapter = new Chapter({
            title,
            chapterNumber,
            content,
            images, // Lưu mảng URL ảnh
            comic: comicId,
        });

        // Lưu chapter vào cơ sở dữ liệu
        const savedChapter = await newChapter.save();

        // Cập nhật comic để thêm chapter vào mảng chapters
        await Comic.findByIdAndUpdate(comicId, { 
            $push: { chapters: savedChapter._id },
            updatedAt: Date.now() // Cập nhật updatedAt
        });

        res.status(201).json(savedChapter);
    } catch (error) {
        console.error('Error creating chapter:', error);
        res.status(500).json({
            message: 'Lỗi khi tạo chapter',
            error: error.message,
        });
    }
};
// Hàm sửa chapter
const updateChapter = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Lấy danh sách ảnh mới nếu có
        const images = req.files ? req.files.map(file => file.secure_url) : [];

        // Cập nhật chapter
        const updatedChapter = await Chapter.findByIdAndUpdate(
            id,
            { ...updatedData, $set: { images } }, // Cập nhật mảng ảnh
            { new: true } // Trả về chapter đã cập nhật
        );

        if (!updatedChapter) {
            return res.status(404).json({ message: 'Chapter không tìm thấy' });
        }

        res.status(200).json(updatedChapter);
    } catch (error) {
        console.error('Error updating chapter:', error);
        res.status(500).json({
            message: 'Lỗi khi sửa chapter',
            error: error.message,
        });
    }
};

// Hàm xóa chapter
const deleteChapter = async (req, res) => {
    try {
        const { id } = req.params;

        // Xóa chapter
        const deletedChapter = await Chapter.findByIdAndDelete(id);

        if (!deletedChapter) {
            return res.status(404).json({ message: 'Chapter không tìm thấy' });
        }

        res.status(200).json({ message: 'Chapter đã bị xóa thành công' });
    } catch (error) {
        console.error('Error deleting chapter:', error);
        res.status(500).json({
            message: 'Lỗi khi xóa chapter',
            error: error.message,
        });
    }
};
const getChapterDetails = async (req, res) => {
    try {
        const chapterId = req.params.chapterId;
        const comicId = req.params.comicId;

        // Tìm comic và populate các chapter
        const comic = await Comic.findById(comicId).populate('chapters');
        if (!comic) return res.status(404).json({ message: 'Comic not found' });

        // Tìm chapter theo ID
        const chapter = comic.chapters.find(chap => chap._id.toString() === chapterId);
        if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

        // Tăng readCount lên 1 chỉ nếu chapter được đọc lần đầu
        if (!req.session || !req.session.readChapters) {
            req.session.readChapters = new Set(); // Khởi tạo tập hợp các chapter đã đọc
        }

        if (!req.session.readChapters.has(chapterId)) {
            comic.readCount += 1;
            await comic.save();
            req.session.readChapters.add(chapterId); // Đánh dấu chapter là đã đọc
            console.log("Đã tăng readCount lên 1");
        }

        console.log("Gọi getChapter 1 lần");
        // Trả về thông tin chi tiết chapter
        return res.json(chapter);
    } catch (error) {
        console.error('Error fetching chapter details:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
// Hàm lấy danh sách chapter của một truyện

const getChapters = async (req, res) => {
    try {
        const chapterId = req.params.chapterId;
        const comicId = req.params.comicId;

        // Tìm comic và populate các chapter
        const comic = await Comic.findById(comicId).populate('chapters');
        if (!comic) return res.status(404).json({ message: 'Comic not found' });


        // Trả về thông tin chi tiết chapter
        return res.json(comic.chapters);
    } catch (error) {
        console.error('Error fetching chapters:', error);
        return res.status(500).json({ message: 'Lỗi khi lấy danh sách chapter', error: error.message });
    }
};

// Xuất các hàm
module.exports = {
    createChapter,
    updateChapter,
    deleteChapter,
    getChapterDetails,
    getChapters
};
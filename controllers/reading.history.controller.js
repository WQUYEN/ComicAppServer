const ReadingHistory = require('../models/reading.history.model');

const updateReadingHistory = () => async (req, res) => {
    const { userId, comicId, chapterId } = req.body;

    try {
        const now = new Date();
        const existingHistory = await ReadingHistory.findOne({ user: userId, comic: comicId });

        if (existingHistory) {
            existingHistory.chapter = chapterId;
            existingHistory.lastReadAt = now;
            await existingHistory.save();
            console.log("Thêm 1 vào lịch sử đọc");
            return res.json(existingHistory);
        } else {
            const newHistory = new ReadingHistory({
                user: userId,
                comic: comicId,
                chapter: chapterId,
                lastReadAt: now
            });
            console.log('New History Object:', newHistory);
            await newHistory.save();
            return res.json(newHistory);
            
        }
    } catch (error) {
        console.error('Error updating reading history:', error.message);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
const getReadingHistory = () => async (req, res) => {
    const userId = req.params.userId; // Giả sử userId được truyền qua params

    try {
        const history = await ReadingHistory.find({ user: userId })
            .populate('comic') // Lấy thông tin comic
            .populate('chapter') // Lấy thông tin chapter
            .sort({ lastReadAt: -1 }); // Sắp xếp theo thời gian đọc gần nhất

        return res.json(history);
    } catch (error) {
        console.error('Error fetching reading history:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Xuất hàm updateReadingHistory và getReadingHistory
module.exports = {
    updateReadingHistory,
    getReadingHistory,
};
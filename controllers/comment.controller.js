const Comment = require('../models/comment.model'); // Đảm bảo đường dẫn đúng


// Lấy Comment theo Comic ID
const getCommentsByComicId = async (req, res) => {
    const { comicId } = req.params; // Lấy comicId từ tham số URL

    try {
        const comments = await Comment.find({ comic: comicId })
            .populate('user', 'name email') // Nếu bạn muốn lấy thông tin người dùng, có thể điều chỉnh các trường cần thiết
            .sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo giảm dần

        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching comments', error });
    }
};
// Tạo Comment
const createComment = async (req, res) => {
    const { content, comicId, userId } = req.body; // Lấy userId từ body request

    try {
        const comment = new Comment({
            content,
            comic: comicId,
            user: userId,
        });

        await comment.save();
        return res.status(201).json(comment);
    } catch (error) {
        return res.status(400).json({ message: 'Error creating comment', error });
    }
};

// Chỉnh sửa Comment
const editComment = async (req, res) => {
    const { commentId } = req.params;
    const { content, userId } = req.body; // Lấy userId từ body request

    try {
        const comment = await Comment.findById(commentId);

        // Kiểm tra nếu comment tồn tại và userId có giống nhau không
        if (!comment || comment.user.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to edit this comment' });
        }

        comment.content = content; // Cập nhật nội dung
        await comment.save();

        return res.status(200).json(comment);
    } catch (error) {
        return res.status(400).json({ message: 'Error updating comment', error });
    }
};

// Xóa Comment
const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const { userId } = req.body; // Lấy userId từ body request

    try {
        const comment = await Comment.findById(commentId);

        // Kiểm tra nếu comment tồn tại và userId có giống nhau không
        if (!comment || comment.user.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this comment' });
        }

        await Comment.findByIdAndDelete(commentId);
        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error); // Log lỗi ra console
        return res.status(500).json({ message: 'Error deleting comment', error });
    }
};

module.exports = {
    createComment,
    editComment,
    deleteComment,
    getCommentsByComicId
};
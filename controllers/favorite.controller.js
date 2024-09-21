const FavoriteComic = require('../models/favorite.model');
const mongoose = require('mongoose');
const Comic = require('../models/comic.model');

const addFavoriteComic = async (req, res) => {
    const userId = req.body.userId;  // Lấy userId từ body
    const comicId = req.body.comicId; // Lấy comicId từ body

    if (!userId || !comicId) {
        return res.status(400).json({ error: 'User ID and Comic ID are required.' });
    }

    try {
        // Kiểm tra xem truyện đã có trong danh sách yêu thích chưa
        const existingFavorite = await FavoriteComic.findOne({ user: userId, comic: comicId });
        if (existingFavorite) {
            return res.status(400).json({ error: 'Comic is already in favorites.' });
        }

        const favoriteComic = new FavoriteComic({ user: userId, comic: comicId });
        await favoriteComic.save();
         // Tìm thông tin chi tiết về comic vừa thêm vào
         const comic = await Comic.findById(comicId);
         if (!comic) {
             return res.status(404).json({ error: 'Comic not found.' });
         }
 
         // Trả về thông tin comic vừa thêm vào cùng với favoriteComic
         return res.status(201).json({
             user: favoriteComic.user,
             comic: {
                 _id: comic._id,
                 title: comic.title, // Các trường khác của comic
                 // ... thêm các trường bạn muốn trả về
             },
             favoriteComicId: favoriteComic._id,
             createdAt: favoriteComic.createdAt,
             updatedAt: favoriteComic.updatedAt,
             __v: favoriteComic.__v
         });
    } catch (error) {
        console.error('Error adding favorite comic:', error);
        return res.status(500).json({ error: 'Adding comic failed: ' + error.message });
    }
};

const removeFavoriteComic = async (req, res) => {
    const userId = req.query.userId;  // Lấy userId từ query
    const comicId = req.query.comicId; // Lấy comicId từ query

    if (!userId || !comicId) {
        return res.status(400).json({ error: 'User ID and Comic ID are required.' });
    }

    try {
        const deletedComic = await FavoriteComic.findOneAndDelete({ user: userId, comic: comicId });
        
        if (!deletedComic) {
            return res.status(404).json({ error: 'Comic not found' });
        }
        
        return res.status(200).json({ message: 'Comic removed successfully', comic: deletedComic });
    } catch (error) {
        return res.status(500).json({ error: 'Deleted comic failed: ' + error.message });
    }
};
//Kiểm tra truyện đã được theo dõi chưa ?
const checkFavoriteStatus = async (req, res) => {
    const userId = req.body.userId;  // Lấy userId từ body
    const comicId = req.body.comicId; // Lấy comicId từ body
    // console.log('Request Body:', req.body);
    
    if (!userId || !comicId) {
        return res.status(400).json({ error: 'User ID and Comic ID are required.' });
    }

    try {
        // Kiểm tra xem truyện có trong danh sách yêu thích không
        const existingFavorite = await FavoriteComic.findOne({ user: userId, comic: comicId });
        const isFavorite = existingFavorite !== null; // Kiểm tra xem truyện đã có trong danh sách yêu thích

        return res.status(200).json(isFavorite); // Trả về trạng thái yêu thích
    } catch (error) {
        console.error('Error checking favorite status:', error);
        return res.status(500).json({ error: 'Check favorite status failed: ' + error.message });
    }
};
// Lấy tất cả truyện yêu thích của một user
const getFavoriteComicsByUserId = async (req, res) => {
    const userId = req.params.userId; // Lấy userId từ params

    if (!userId) {
        return res.status(400).send({ error: 'User ID is required.' }); // Sử dụng send thay vì json
    }

    try {
        // Tìm tất cả truyện yêu thích của user và populate comic
        const favorites = await FavoriteComic.find({ user: userId }).populate('comic');

        // Chỉ giữ lại thông tin comic
        const comics = favorites.map(favorite => favorite.comic);

        return res.status(200).send(favorites); // Sử dụng send thay vì json
    } catch (error) {
        return res.status(500).send({ error: 'Không thể lấy danh sách truyện yêu thích: ' + error.message }); // Sử dụng send thay vì json
    }
};
// const getFavoriteComicsByUserId = async (req, res) => {
//     const userId = req.params.userId; // Lấy userId từ params

//     if (!userId) {
//         return res.status(400).send({ error: 'User ID is required.' });
//     }

//     try {
//         // Tìm tất cả truyện yêu thích của user và populate comic
//         const favorites = await FavoriteComic.find({ user: userId }).populate('comic');

//         // Lấy danh sách comic
//         const comics = favorites.map(favorite => favorite.comic);

//         // Sắp xếp comic theo thời gian cập nhật mới nhất của chapter
//         const comicsWithLatestChapter = await Promise.all(comics.map(async comic => {
//             const latestChapter = await Chapter.findOne({ comic: comic._id }).sort({ updatedAt: -1 });
//             return {
//                 ...comic.toObject(),
//                 latestUpdatedAt: latestChapter ? latestChapter.updatedAt : null, // Thêm thông tin thời gian cập nhật mới nhất nếu có
//             };
//         }));

//         // Sắp xếp theo thời gian cập nhật mới nhất
//         comicsWithLatestChapter.sort((a, b) => {
//             return (b.latestUpdatedAt || 0) - (a.latestUpdatedAt || 0); // Sắp xếp theo thời gian cập nhật
//         });

//         return res.status(200).send(comicsWithLatestChapter);
//     } catch (error) {
//         return res.status(500).send({ error: 'Không thể lấy danh sách truyện yêu thích: ' + error.message });
//     }
// };
module.exports = {
    addFavoriteComic,
    removeFavoriteComic,
    getFavoriteComicsByUserId,
    checkFavoriteStatus
};
// controllers/genreController.js
const Genre = require('../models/genre.model');

// Thêm thể loại mới
const createGenre = async (req, res) => {
  try {
    const genre = new Genre(req.body);
    await genre.save();
    res.status(201).send({ genre });
  } catch (error) {
    res.status(400).send({ error });
  }
};

// Sửa thể loại
const updateGenre = async (req, res) => {
  const { id } = req.params;
  
  try {
    const genre = await Genre.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!genre) {
      return res.status(404).send({ error: "Thể loại không tồn tại" });
    }
    res.send({ genre });
  } catch (error) {
    res.status(400).send({ error });
  }
};

// Xóa thể loại
const deleteGenre = async (req, res) => {
  const { id } = req.params;

  try {
    const genre = await Genre.findByIdAndDelete(id);
    if (!genre) {
      return res.status(404).send({ error: "Thể loại không tồn tại" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).send({ error });
  }
};

// Lấy danh sách tất cả thể loại
const getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    return res.json( genres );
  } catch (error) {
    res.status(500).send({ error });
  }
};

// Lấy thể loại theo ID
const getGenreById = async (req, res) => {
  const { id } = req.params;

  try {
    const genre = await Genre.findById(id);
    if (!genre) {
      return res.status(404).send("Genre not found");
    }
    res.send(genre); // Gửi đối tượng genre trực tiếp thay vì bọc nó trong một đối tượng
  } catch (error) {
    res.status(500).send("Error");
  }
};

// Xuất các hàm controller
module.exports = {
  createGenre,
  updateGenre,
  deleteGenre,
  getAllGenres,
  getGenreById,
};
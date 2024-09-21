const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: props => `${props.value} không phải là một địa chỉ email hợp lệ`
      }
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      trim: true
    },
    avatar:{
      type: String, // Lưu đường dẫn avatar
    },
    tokens: [{
      token: {
        type: String,
        required: true
      }
    }],
    isActice:{ 
      type: Boolean,
      default: true     
    },
    isPremium:{
      type: Boolean,
      default:false
    },
    
  });

userSchema.pre('save',async function (next) {
    //hashing the password
    const user = this 
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
})
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  // Kiểm tra nếu không tìm thấy người dùng
  if (!user) {
      throw new Error("User not found!"); // Lỗi không tìm thấy người dùng
  }
  
  // So sánh mật khẩu
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
      throw new Error("Invalid email or password."); // Lỗi mật khẩu không khớp
  }

  return {
    id: user._id, // Thêm ID vào phản hồi
    name: user.name,
    email: user.email}; // Trả về người dùng nếu thông tin đăng nhập hợp lệ
};

const User = mongoose.model('User',userSchema);

module.exports = User;
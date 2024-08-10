// Trong MongoDB, Schema (lược đồ) là một cấu 
// trúc dữ liệu xác định cách các tài liệu trong 
// một collection sẽ được tổ chức
// sử dụng schemas để định nghĩa cấu trúc 
// của các tài liệu trong một collection
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// tạo 1 schema vs kiểu dữ liệu string 
// required: true: Xác định rằng các trường 
// này là bắt buộc; nghĩa là, khi bạn tạo một 
// tài liệu mới trong collection, các trường 
// này phải có giá trị, nếu không, Mongoose sẽ 
// trả về lỗi.
const employeeSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },

  lastname: {
    type: String,
    required: true,
  },
});

{/*
Khi bạn định nghĩa một model trong Mongoose, 
bạn chỉ cần cung cấp tên model ở dạng số ít (nên viết
hoa chữ cái đầu) và Mongoose sẽ tự động tìm 
hoặc tạo ra một collection
trong MongoDB với tên tương ứng ở dạng số nhiều 
và viết thường. Điều này giúp việc quản lý các 
model và collection trở nên dễ dàng và nhất quán hơn. 
*/} 

module.exports = mongoose.model('Employee', employeeSchema)
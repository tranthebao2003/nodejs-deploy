const express = require('express')
const router = express.Router()
const path = require('path')

// define route xử lí cá request GET đến đường 
// dẫn '/' (trang chủ). Hàm callback sẽ được gọi
// mỗi khi có request đến dường dẫn này
// phần (.html)? đã giải thích ở dưới
// ^: đế bắt đầu chuỗi, $ kết thúc chuỗi, / là đại
// diện cho dấu gách chép trong url
// ^/$: nghĩa là nó phải kết thúc bằng dấu gách chéo
// | toán tử or trong regex nghĩa là nó cho khớp
// vs 1 trong 2 pattern
// ghi chú
router.get('^/$|/index(.html)?', (req, res) => {
    // cách 1: res.sendFile('./views/index.html', {root: __dirname})
    // cách 2:
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

// /new-page là phần tính còn 
// (.html)? là 1 regex: phần (.html) là 1 capturing group
// chứa hmtl. phần ? làm cho phần trước đó là optional.
// nghĩa là khi kết hợp lại (.html)? thì phần html có
// thể có hoặc không
router.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname,  '..', 'views', 'new-page.html'))
})

router.get('/old-page(.html)?',(req, res) => {
    // 302 by default
    // but i want 301 because 301 is permanently
    res.redirect(301, '/new-page(.html)?') 
})

module.exports = router
const {logEvents} = require('./logEvents')

const errorHandler = function (err, req, res, nest) {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt')
    // err.stack là thuộc tính của đối tượng lỗi, 
    // chứa chuỗi thể hiện stack trace của lỗi.
    // Chuỗi này bao gồm tên lỗi, thông điệp lỗi, 
    // với vị trí trong mã nguồn.
    console.error(err.stack)
    res.status(500).send(err.message)
}

module.exports = errorHandler
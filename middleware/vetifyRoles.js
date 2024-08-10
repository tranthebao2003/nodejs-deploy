const { sendStatus } = require("express/lib/response")

// ...params là có thể nhận bao
// nhiêu tham số cũng được
// 5150,1984
const vertifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req.roles) return sendStatus(401)
        // lấy all params bỏ vào mảng
        const rolesArray = [...allowedRoles]
        console.log(rolesArray)
        console.log(req.roles)
        
        // req.roles.map: dòng for thui nó sẽ chạy qua
        // từng phần tử trong mảng. Nhận 1 callback
        // có params là từng phần tử
        // role => rolesArray.includes(role): xem
        // role mà require gửi lên có nằm trong
        // mảng được cho phép hay không
        // sau đó trả về mảng index thỏa điều kiện
        // nếu ko tìm thấy nó trả về undefinded
        const result = req.roles.map(role => rolesArray.includes(role)).find(value => value === true)
        if(!result) return res.sendStatus(401)
        next()
    }
}

module.exports = vertifyRoles
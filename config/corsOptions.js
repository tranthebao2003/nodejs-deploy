// third party middleware
// khi truy cập từ những domain, live sever, localhost thì được phép
// truy cập vào tài nguyên
// liên quan đến bảo mật, tạm thời bỏ qua
const {allowedOrigin} = require('./allowedOrigin')

const corsOptions = {
    origin: (origin, callback) => {
        // những danh sách nào ko có trong danh
        // hoặc !origin có thể truy cập resourse
        // vì !origin nghĩa là false undefine
        // mik đang trong giai đoạn phát triển
        // thì header mình là undefined
        if(allowedOrigin.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        } else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionSuccessStatus: 200
}

module.exports = {corsOptions}
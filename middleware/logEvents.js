const {format} = require('date-fns')
// lấy hàm v4 từ thư viện uuid gán vào biến uuid
const {v4: uuid} = require('uuid')

const fs = require('node:fs')
const fsPromises = require('node:fs/promises')
const path = require('node:path')

const logEvents = async(message, logName) => {
    const dataTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dataTime}\t${uuid()}\t${message}\n`
    // console.log(logItem)

    try{
        // '..' nghĩa là ra ngoài cha của nó 
        // __dirname: đường dẫn absolute đến file hiện tại
        // path.join() sẽ join __dirname , .. (thì như vậy sẽ
        // dẫn tới là ra ngoài 1 thư mục đối với file hiện tại)
        // tương tự những .. khác cũng thế đều sẽ ra ngoài 1
        // thư mục rồi sau đó mới tạo folder, hay append file...
        if(!fs.existsSync(path.join(__dirname, '..' ,'logs'))){
            await fsPromises.mkdir(path.join(__dirname,'..', 'logs'))
        }
        // path join tạo đường dẫn tuyệt đối từ file hiện tại đến thư mục logs/eventLog.txt
        // appendFile thêm dữ liệu vào cuối file (nếu file chưa có nó sẽ tự tạo, nhớ kĩ nó
        // chỉ tự tạo file thôi còn folder thì nó ko tự tạo đâu)
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem)
    }catch(err){
        console.error(err)
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.header.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
}

module.exports = {logger, logEvents}
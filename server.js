const http = require('node:http')
const path = require('node:path')
const fs = require('node:fs')
const fsPromises = require('node:fs/promises')

const logEvents = require('./middleware/logEvents')

const EventEmitter = require('node:events')

class Emitter extends EventEmitter{}

// initialize object
const myEmitter = new Emitter()
myEmitter.on("log", (msg, fileName) => logEvents(msg, fileName));

const serveFile = async(filePath, contentType, response) => {
  try {
    const rawData = await fsPromises.readFile(
      filePath,
      !contentType.includes("image") ? "utf-8" : ""
    );
    // JSON.parse: để chuyển đối json thành object trong java
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;

    response.writeHead(filePath.includes("404.html") ? 404 : 200, {
      "Content-Type": contentType,
    });
    // để kết thức phải hồi và gửi dữ liệu về client, vì vậy
    // tham số chính là dữ liệu gửi về client
    response.end(
      contentType === "application/json" ? JSON.stringify(data) : data
    );
  } catch (err) {
    //   console.log(err);
    myEmitter.emit("log", `${err.name}: ${err.message}`, "errLog.txt");
    response.statusCode = 500;
    response.end();
  }
}

// process.env là một đối tượng trong Node.js 
// chứa các biến môi trường của quy trình hiện tại
// nếu process.env.PORT ko đc thiết lập nó sẽ sử
// dụng giá trị mặc định là 3500
const PORT = process.env.PORT || 3500

const server = http.createServer((req, res) => {
    // console.log(req.url, req.method)
    // mỗi khi sever đc req thì emit này sẽ phát
    // và myEmitter.on phía trên sẽ ghi lại log
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt')

    const extension = path.extname(req.url)

    let contentType

    switch(extension){
        case '.css':
            contentType = 'text/css'
            break
        case '.js':
            contentType = 'text/javascript'
            break
        case '.json':
            contentType = 'application/json'
            break
        case '.jpg':
            contentType = 'image/jpeg'
            break
        case '.png':
            contentType = 'image/png'
            break
        case '.txt':
            contentType = 'image/plain'
            break
        default:
            contentType = 'text/html'
    }

    let filePath
    if(contentType === 'text/html' && req.url ==='/'){
        filePath = path.join(__dirname, 'views', 'index.html')
    } else if(contentType === 'text/html' && req.url.slice(-1) === '/'){
        // req.url.slice(-1) nó cắt ra phần tử ở vị trí cuối cùng
        filePath = path.join(__dirname, 'views', req.url, 'index.html')
    } else if(contentType == 'text/html'){
        filePath = path.join(__dirname, 'views', req.url)
    } else{
        filePath = path.join(__dirname, req.url)
    }

    // trường hợp này ko có ext và phần tử cuối khác dấu /
    // tức là ko phải trang chủ 
    if(!extension && req.url.slice(-1) !== '/'){
        // console.log('req.url.slice(-1)',req.url.slice(-1))
        filePath += '.html'
    }

    // kiểm tra xem đường dẫn file có tồn tại hay không
    const fileExists = fs.existsSync(filePath)
    if(fileExists){
        // serve the file
        serveFile(filePath, contentType, res)
    } else{
        // 404
        // 301 redirect
        // Phương thức path.parse trả về một đối tượng 
        // chứa các thành phần của đường dẫn như 
        // thư mục gốc, thư mục, tên tệp, và phần 
        // mở rộng. Trong đó base sẽ là tên gồm
        // cả ext của tệp
        switch(path.parse(filePath).base){
            case 'old-page.html':
                // Đây là cách thông báo cho máy khách 
                // (thường là trình duyệt web) rằng tài nguyên 
                // mà nó yêu cầu đã được di chuyển đến một vị trí
                // mới

                // 301 là mã trạng thái HTTP cho "Moved Permanently" (đã chuyển vĩnh viễn).
                // Điều này có nghĩa là tài nguyên được yêu cầu đã được di chuyển vĩnh viễn đến một URL mới.
                // Khi trình duyệt nhận được mã trạng thái này, nó sẽ tự động điều hướng đến URL mới được chỉ định trong tiêu đề Location.
                res.writeHead(301, {"Location" : "/new-page.html"}, )
                res.end()
                break
            case 'www-page.html':
                res.writeHead(301, {"Location" : "/"})
                res.end()
                break
            default:
                //serve a 404 response
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res)
        }
    }
})


server.listen(PORT, () => console.log(`Server running on port ${PORT}`))



// phục vụ cho bài 4
// // add listener for the log event
// myEmitter.on('log', (message) => {
//     logEvents(message)
// })

// setTimeout(() => {
//     // Emit Event
//     myEmitter.emit('log', 'Log event emitted!')
// }, 2000)

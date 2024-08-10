// DÙNG FILE JSON
// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };


// DÙNG MONGODB
const User = require('../model/User')

const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  // req.cookie: đây chính là cookie-parser lưu
  // cookie sau khi đã phân tích cú pháp
  const cookies = req.cookies;
  console.log(cookies)

  // OBTIONAL CHAINING
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  // lấy ra jwt trong cookies mình đã tạo
  // và gửi đi cùng lúc trong authController
  // console.log(cookies.jwt)
  
  const refreshToken = cookies.jwt;
  // Câu lệnh này tìm kiếm một tài liệu trong collection 
  // users có trường refreshToken với giá trị khớp với 
  // refreshToken mà bạn cung cấp. Nếu tài liệu đó tồn tại, 
  // nó sẽ được trả về; nếu không, kết quả sẽ là null.
  // vì tên khóa và tên biến giống nhau nên mình có
  // thể viết refreshToken là ES6 nó sẽ mở refreshToken: refreshToken
  const foundUser = await User.findOne({refreshToken}).exec()

  if (!foundUser) {
    // forbidden
    console.log('Không tìm thấy user có refreshToken')
    return res.sendStatus(403);
  }

  // evaluate jwt
  // trong trường hợp match trả về true, false
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
    if (err || foundUser.username !== decode.username) {
      return res.sendStatus(403);
    }
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      { UserInfo: 
        { 
          username: decode.username, 
          roles: roles 
        } 
      },
      process.env.ACCESS_TOKEN_SECRET,
      // với product thì nên để 5m đến 10m
      { expiresIn: "5m" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };

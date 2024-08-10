// USE FILE JSON
// const usersDB = {
//     users: require("../model/users.json"),
//     setUsers: function (data) {
//       this.users = data;
//     },
// };
// const fsPromises = require('fs/promises')
// const path = require('path');

// USE MONGODB
const User = require('../model/User')
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')


const handleLogin = async (req, res) => {
  // MỤC ĐÍCH LÀ XÁC THỰC NGƯỜI DÙNG (AUTHENTICATION)
  const { user, password } = req.body;
  if (!user || !password) {
    return res
      .status(400)
      .json({ "message": "Username and password are requied" });
  }

  const foundUser = await User.findOne({username: user}).exec()
  if(!foundUser){
    // unauthenticated
    return res.status(401).json({"message":"Không được xác thực"})
  }

  // evaluate password
  // trong trường hợp match trả về true, false
  console.log('password', password)
  console.log('foundUser.password', foundUser)
  const match = await bcrypt.compare(password, foundUser.password)

  // MỤC ĐÍCH CỦA JWT LÀ ĐỂ CẤP QUYỀN (AUTHORIZATION)
  if(match){
    // trả về 1 mảng chứa all giá trị của all key trong
    // object roles của foundUser
    const roles = Object.values(foundUser.roles)
    // create JWTs
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": foundUser.username,
          "roles": roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      // trong sp nên để expiresIn này khoảng 10m
      {expiresIn: '5m'}
    )

    const refreshToken = jwt.sign(
      {
        "username": foundUser.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      // trong sp nên để expiresIn này khoảng 10p
      {expiresIn: '1d'}
    )

    // Saving refeshToken with current user in FILE JSON
    // const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username)
    // // dùng toàn tử spread để thêm key mới cho object
    // const currentUser = {...foundUser, refreshToken}
    // // console.log('currentUser from authController', currentUser)
    // usersDB.setUsers([...otherUsers, currentUser])
    // await fsPromises.writeFile(
    //   path.join(__dirname, '..', 'model', 'users.json'),
    //   JSON.stringify(usersDB.users)
    // )

    // Saving refeshToken with current user in MONGODB
    foundUser.refreshToken = refreshToken
    const result = await foundUser.save()
    console.log('result', result)

    // Tên cookie: 'jwt'
    // Giá trị cookie: refreshToken
    // httpOnly: true: Thiết lập cookie chỉ có thể 
    // truy cập được bởi máy chủ (HTTP only), không 
    // thể truy cập từ JavaScript trên trình duyệt, 
    // giúp bảo vệ khỏi các tấn công XSS
    // maxAge: 24 * 60 * 60 * 1000: Thiết lập thời gian sống của cookie 
    // maxAge đơn vị là milisecond nên 24 * 60 * 60 * 1000 chỉ
    // là phép nhân đơn thuần để ra đc số milisecond cần thiết 
    // bằng với 1 ngày thôi
    // là 24 giờ (24 giờ * 60 phút * 60 giây * 1000 mili giây)
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({accessToken})
  } else{
    res.sendStatus(401)
  }
}

module.exports = {handleLogin}
  
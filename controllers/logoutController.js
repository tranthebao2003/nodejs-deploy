// DÙNG FILE JSON
// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };
// const fsPromises = require("node:fs/promises");
// const path = require("node:path");

// DÙNG MONGODB
const User = require('../model/User')

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken
  const cookies = req.cookies;

  // OBTIONAL CHAINING
  if (!cookies?.jwt) {
    // mục đích thông báo req thành công
    // nhưng ko có cookies nào cả
    return res.sendStatus(204); //no content
  }

  const refreshToken = cookies.jwt;

  // Is refreshToken in db?

  const foundUser = await User.findOne({refreshToken}).exec()

  // tuy ko tìm thấy user nào có refreshToken phù hợp
  // thì vẫn sẽ xóa đi refreshToken đó
  if (!foundUser) {
    // xóa cookie
    res.clearCookie("jwt", { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
    return res.sendStatus(204);
  }

  // DELETE REFRESH TOKEN IN JSON
  // filter những người có refresh token khác với
  // refresh token của người được tìm thấy 
  // const otherUsers = usersDB.users.filter(
  //   (person) => person.refreshToken !== foundUser.refreshToken
  // )
  // const currentUser = {...foundUser, refreshToken: ''}
  // usersDB.setUsers([...otherUsers, currentUser])
  // await fsPromises.writeFile(
  //   path.join(__dirname, "..", "model", "users.json"),
  //   JSON.stringify(usersDB.users)
  // );

  // DELETE REFRESH TOKEN IN MONGODB
  console.log('foundUser: ', foundUser)
  foundUser.refreshToken = ''
  // lưu lại những thay đổi trong users collection
  // và trả về tài liệu phiên bản mới nhất
  const result = await foundUser.save()

  console.log('result: ', result)

  res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000})
  res.sendStatus(204)
};

module.exports = { handleLogout };

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

// là một thư viện phổ biến trong Node.js được
// sử dụng để băm (hash) mật khẩu, giúp tăng cường
// bảo mật cho các ứng dụng web
const bcrypt = require("bcrypt");

// sử dụng await trong async :
// khi gặp await (chờ) thì hàm async sẽ chờ
// đến khi nào promise trả về kết quả
// ngoài ra await còn ném ra lỗi nếu promise bị lỗi
// việc sử dụng await là cần thiết đối với những
// promise khi promise đó bắt buộc phải đc thực thi
// trước rồi mới tới những dòng tiếp theo. Ví dụ
// việc băm mật khẩu bắt buộc phải diễm ra trước
// trước khi ta ghi nó vào file json vì thế dùng
// await trước promise băm mật khẩu
const handleNewUser = async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password) {
    return res
      .status(400)
      .json({ message: "Username and password and required" });
  }

  // check for duclicate usernames in FILE JSON
  // const duplicate = usersDB.users.find((person) => person.username === user);

  {/*   
  // check for duclicate usernames in mongoDB
  // User.findOne({username: user}): Tìm một tài 
  // liệu trong collection users (liên kết với model 
  // User) mà có trường username bằng với giá trị của 
  // biến user.
  // .exec(): Thực thi truy vấn và trả về một 
  // Promise. Điều này cho phép bạn sử dụng await 
  // để xử lý kết quả của truy vấn. Nó trả về
  // null nếu ko tìm thấy và trả về tài liệu đầu
  // tiên nó tìm thấy
  */}
  const duplicate = await User.findOne({username: user}).exec()

  // 409 conflict responses are errors sent to the
  // client so that a user might be able to resolve
  // a conflict and resubmit the request
  if (duplicate) {
    return res.status(409).json({"message": "Tên tài khoản bị trùng"}); //Conflict
  }
  try {
    // encrypt the password with salt 10
    // salt chỉ số lần hash(băm) của mk
    // nếu salt càng lớn thì càng bảo mật
    // nhưng đánh đổi là tg thực hiện càng lâu
    // mỗi lần tăng salt lên 1 thì tg thực hiện
    // tăng gấp đôi
    const hashedPwd = await bcrypt.hash(password, 10);
    
    // CREATE AND STORE NEW USER IN FILE JSON
    // const newUser = {
    //   username: user,
    //   roles: { User: 2001 },
    //   password: hashedPwd,
    // };
    // usersDB.setUsers([...usersDB.users, newUser]);

    // {/*   
    // cái này là ghi đè lên file còn muốn nối
    // thì dùng {flag: 'a'} a là append thì nó sẽ
    // nối. Nhưng ở đây mình ko cần dùng
    // bởi vì mik thêm user mới bằng cánh trải
    // cái user cũ ra sau đó thêm vào. Thành ra
    // file sẽ được ghi lại từ đầu đến cuối 
    // */}
    // await fsPromises.writeFile(
    //   path.join(__dirname, "..", "model", "users.json"),
    //   JSON.stringify(usersDB.users)
    // );


    // CREATE AND STORE NEW USER IN MONGODB
    // ở đây ta không cần thêm roles, như
    // ở file json vì ta đã set value default
    // ở Schema rồi, id cũng tự được tạo
    const result = await User.create({
      "username": user,
      "password": hashedPwd
    })

    console.log(result)
    
    res.status(201).json({"success": `New user ${user} created!`})
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {handleNewUser}

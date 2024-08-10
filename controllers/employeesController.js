
// USE FILE JSON
// method để update danh sách này
// const data = {
//     // Thuộc tính employees của đối tượng data 
//     // được gán dữ liệu từ tệp JSON 
//     employees:require('../model/employees.json'),

//     // ở đây bắt buộc phải dùng function thay vì arrow function
//     // bởi vì trong TH này mình cần this tham chiếu đến object data
//     // nếu dùng arrow func thì this nó sẽ ko tham chiếu đến data
//     setEmployees: function(data) {
//         {this.employees = data}
//     }
// }
// const fsPromises = require("node:fs/promises")
// const path = require("node:path")

// const getAllEmployees = (req, res) => {
//     // response 1 json data
//     return res.status(200).json(data.employees)
// }

// const createNewEmployee = (req, res) => {
//     const newEmployee = {
//       // Sử dụng obtional chaining: nếu data.employees là undefined or null
//       // nó sẽ trả về undefined thì mình gán id là 1 overwise thì
//       // lấy ra id của phần tử cuối tăng lên 1
//       id: data.employees?.length
//         ? data.employees[data.employees.length - 1].id + 1
//         : 1,
//       firstname: req.body.firstname,
//       lastname: req.body.lastname,
//     };

//         // nếu firstname hoặc lastname trống thì
//         // sẽ báo lỗi 400
//     if(!newEmployee.firstname || !newEmployee.lastname){
//         // 400 Bad Request là một mã trạng thái HTTP 
//         // chỉ ra rằng máy chủ không thể xử lý yêu cầu 
//         // do lỗi từ phía máy khách. Do cú pháp sai,
//         // dữ liệu không hợp lệ, và ở trường hợp này
//         // là thiếu thông tin thì server sẽ báo lỗi 400
//         return res.status(400).json({'message': 'First and last names are required'})
//     }

//     // ...data.employees: toán tử spread nó sẽ trải phần tử trong mảng ra
//     // sau đó thêm phần tử mới newEmployee vào. Hiểu đơn giản là nó bỏ
//     // dấu [] của mảng rồi thêm phấn tử mới vào rồi đóng lại thành mảng mới
//     // ổ đây bằng buộc phải dùng toán tử spread ko đc dùng push. Bởi vì
//     // push là thêm phần tử vào mảng cũ (thay đổi mảng cũ) mà ở đây
//     // mình dùng const cho data sẽ bị lỗi. Còn spread thì nó sẽ trải phần
//     // tử cũ ra thêm phần tử mới vào và đóng lại thành mảng mởi sẽ ko lỗi
//     data.setEmployees([...data.employees, newEmployee])

//     // ghi vào file
//     fsPromises.writeFile(
//       path.join(__dirname, "..", "model", "employees.json"),
//       JSON.stringify(data.employees)
//     );

//     // phản hồi lại client ds nhân viên
//     // status 201 res success led to 
//     // tạo 1 tài nguyên
//     res.status(201).json(data.employees)
// }

// const updateEmployee = (req, res) => {
//     // find nhận callback trả về giá trị
//     // giá trị này chính là object employee
//     // thoả điều kiện, nếu ko tìm thấy
//     // thì trả về undefined
//     const employee = data.employees.find(
//       (emp) => emp.id === parseInt(req.body.id)
//     );

//     if (!employee) {
//       return res
//         .status(400)
//         .json({ message: `Employee ID ${req.body.id} not found` });
//     }

//     // kiểm tra xem firstname có rỗng
//     // hay không nếu rỗng thì ko gán
//     if(req.body.firstname) {
//         employee.firstname = req.body.firstname
//     }
//     if(req.body.lastname){
//         employee.lastname = req.body.lastname
//     }

//     // trả về 1 mảng thoải điều kiện
//     // ở đây là mình lọc ra những 
//     // phần tử khác id mà req gửi lên
//     const fillterdArray = data.employees.filter(
//       (emp) => emp.id !== parseInt(req.body.id)
//     );

//     // thêm phần tử mới update vào lại mảng
//     const unsortedArray = [...fillterdArray, employee]

//     // hàm sort này mik hiểu là nếu mà a.id nó lớn hơn trả 
//     // về 1 (mà 1 sắp xếp sau),
//     // còn ngược lại thì nó trả về -1 (mà -1 sắp xếp trước)
//     // link test jvs: https://playcode.io/1959824
//     const sortedAscendingArray = unsortedArray.sort((a,b) => a.id > b.id ? 1 : -1)

//     data.setEmployees(sortedAscendingArray)

//     fsPromises.writeFile(
//       path.join(__dirname, "..", "model", "employees.json"),
//       JSON.stringify(data.employees)
//     );

//     res.json(data.employees)

// }

// const deleteEmployee = (req, res) => {
// // tương tự như update
// // b1: tìm employee qua id bằng find
// // b2: check employee có tồn tại không
// // b3: lọc trả về mảng gồm những employee có id
// // khác với id tìm thấy (chính là xóa employee khỏi mảng)
// // b4: dùng toán tử spread tạo mảng mới ko có
// // employee bị xóa gán nó cho data.emplyees
// // b5: hiển thị data đó cho user
//   const employee = data.employees.find(
//     (emp) => emp.id === parseInt(req.body.id)
//   );

//   if(!employee){
//     return res.status(400).json({"message": `Employee ID ${req.body.id} not found`})
//   }

//   // lọc cái mảng không có không nhân đó
//   const fillterdArray = data.employees.filter(
//     (emp) => emp.id !== parseInt(req.body.id)
//   );

//   data.setEmployees([...fillterdArray])
//   fsPromises.writeFile(
//     path.join(__dirname, "..", "model", "employees.json"),
//     JSON.stringify(data.employees)
//   );
//   res.json(data.employees)
// };

// const getEmployee = (req, res) => {
//   const employee = data.employees.find(
//     (emp) => emp.id === parseInt(req.params.id)
//   );

//   if (!employee) {
//     return res
//       .status(400)
//       .json({ message: `Employee ID ${req.params.id} not found` });
//   }

//   res.json(employee)
// }




// USE MONGODB
const Employee = require('../model/Employee')

const getAllEmployees = async (req, res) => {
    // find() là một phương thức được sử dụng để 
    // truy vấn tất cả các tài liệu trong collection 
    // mà khớp với điều kiện tìm kiếm. Nếu không cung
    // cấp điều kiện gì, find() sẽ trả về mảng 
    // tất cả các tài liệu trong collection. Nếu có đk
    // trả về mảng khớp đk tìm kiếm
    const employees = await Employee.find()

    // nếu ko có employees trả về status 204: no content và message
    if(!employees) return res.status(204).json({"message": "No employees found"})

    // nếu tìm thấy thì trả về json list employees
    res.json(employees)
}

const createNewEmployee = async(req, res) => {
  // dấu ? là obtional chaining
  if(!req?.body?.firstname || !req?.body?.lastname){
    return res.status(400).json({"message": "First and last names are required"})
  }

  try{
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname
    })

    res.status(201).json(result)
  } catch(err){
    console.error(err)
    res.status(400).json({"error": `${err}`})
  }
} 


const updateEmployee = async(req, res) => {
  if(!req?.body?.id){
    return res.status(400).json({"message":"ID parameter is required"})
  }

  // _id: do mongoDB tự tạo ra
  // Khi bạn sử dụng findOne({ _id: someId }) trong Mongoose, 
  // bạn đang truy vấn dựa trên giá trị của trường _id, giúp bạn 
  // tìm kiếm nhanh chóng và hiệu quả trong cơ sở dữ liệu MongoDB
  const employee = await Employee.findOne({_id: req.body.id}).exec()

  if(!employee){
    return res.status(204).json({"message": `No employee matchers ID ${req.body.id}.`})
  }

  if(req.body?.firstname) employee.firstname = req.body.firstname
  if(req.body?.lastname) employee.lastname = req.body.lastname

  // employee.save() trả về tài liệu phiên bản mới nhất
  const result = await employee.save()
  res.json(result)
}

const deleteEmployee = async(req, res) => {
  if(!req?.body.id) return res.status(400).json({"message": "Employee ID required"})
  const employee = await Employee.findOne({_id: req.body.id}).exec()

  if(!employee){
    return res.status(400).json({"message": `Employee ID ${req.body.id} not found`})
  }

  // delele tài liệu có id phù hợp
  const result = await employee.deleteOne({_id: req.body.id})
  res.json(result)
}

const getEmployee = async(req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Employee ID required" });

  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.params.id} not found` });
  }

  res.json(employee)
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}
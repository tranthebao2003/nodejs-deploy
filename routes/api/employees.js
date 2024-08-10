const express = require('express')
const router = express.Router()
const ROLES_LIST = require('../../config/roles_list')
const vertifyRoles = require('../../middleware/vetifyRoles')

const {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
} = require("../../controllers/employeesController");


// Đoạn mã này sử dụng express.Router() để định 
// nghĩa các tuyến đường xử lý các yêu cầu HTTP 
// (GET, POST, PUT, DELETE) cho cùng một URL, cụ thể 
// là URL /
router
  .route("/")
  // trước khi getAllEmployees thì phải
  // qua bước verifyJWT (có next để qua
  // hàm tiếp)
  .get(getAllEmployees)
  // nghĩa là với vai trò admin hoặc edit thì đều có thể
  // dùng method http này
  .post(vertifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), createNewEmployee)
  .put(vertifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),updateEmployee)
  .delete(vertifyRoles(ROLES_LIST.Admin),deleteEmployee);


// /:id2 là một tuyến đường động trong Express. 
// Dấu hai chấm (:) trước id chỉ ra rằng id là một 
// tham số động trong URL.

// Bất kỳ giá trị nào nằm ở vị trí của :id 
// trong URL sẽ được lưu trữ trong req.params.id
router.route('/:id')
    .get(getEmployee)

module.exports = router
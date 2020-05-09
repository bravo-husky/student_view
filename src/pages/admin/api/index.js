import { get, post } from "@utils/request";

function loginApi(user) {
  //登录
  return get("/user/login", user);
}

function studentInfoList(user) {
  //获取学生信息列表
  return post("/user/student/page", user);
}
//
function studentDormitoryList(params) {
  //获取宿舍列表
  return get("dormitory/list", params);
}

function leavePage(params) {
  //获取学生请假列表
  return post("/leave/page", params);
}

function roundsPageApi(params) {
  //获取查夜信息
  return post("/rounds/page", params);
}

function saveRounds(params) {
  //发布查夜信息
  return post("/rounds/save", params);
}

function askLeaveApi(params) {
  //学生发起请假
  return post("/leave/leave", params);
}

function userListApi(params) {
  //用户列表
  return post("/user/user/page", params);
}

function delUser(params) {
  //删除用户
  return get("/user/remove", params);
}

function saveUser(params) {
  //保存用户
  return post("/user/save", params);
}

function agreeAsk(params) {
  //同意学生请假
  return get("/leave/pass", params);
}

function rejectAsk(params) {
  //拒绝学生请假
  return get("/leave/reject", params);
}

function internPage(params) {
  //获取毕业信息列表
  return post("/intern/page", params);
}

function modifyIntern(params) {
  //保存及修改毕业信息
  return post("/intern/save", params);
}

function saveStudent(params) {
  //保存及修改毕业信息
  return post("/user/student/save", params);
}

function getClassList(params) {
  //分页获取班级信息
  return post("/class/page", params);
}

function saveClass(params) {
  //保存班级信息
  return post(" /class/save", params);
}

function delClass(params) {
  //删除班级信息
  return get("/class/remove", params);
}

function saveGrade(params) {
  //录入毕业信息
  return post("/intern/save", params);
}

function delDomitory(params) {
  //删除某个宿舍
  return get("/dormitory/remove", params);
}

function saveDomitory(params) {
  //保存宿舍信息
  return post("/dormitory/save", params);
}

function saveParentsInfo(params) {
  //保存父母信息
  return post("/user/parent/save", params);
}

function getTeacher(params) {
  //获取教师列表
  return get("/user/teacher", params);
}

function getPro(params) {
  //课程分页信息
  return post("/course/page", params);
}

function modifyPro(params) {
  //新增修改课程
  return post("/course/save", params);
}

function produceCour(params) {
  //生成新课程列表
  return get("/course/makeRecords", params);
}

function report(params) {
  //绩点
  return post("/report/statistic", params);
}

function reportlist(params) {
  //成绩列表
  return post("/report/page", params);
}

function setScore(params) {
  //打分
  return post("/report/mark", params);
}

function sign(params) {
  //签到
  return get("/signReport/sign", params);
}

function signList(params) {
  //签到列表
  return post("/signReport/page", params);
}

export {
  loginApi,
  studentInfoList,
  studentDormitoryList,
  leavePage,
  roundsPageApi,
  askLeaveApi,
  userListApi,
  agreeAsk,
  rejectAsk,
  internPage,
  modifyIntern,
  saveStudent,
  getClassList,
  saveGrade,
  delDomitory,
  saveClass,
  delClass,
  saveDomitory,
  saveParentsInfo,
  getTeacher,
  saveUser,
  delUser,
  saveRounds,
  getPro,
  modifyPro,
  produceCour,
  report,
  reportlist,
  setScore,
  sign,
  signList,
};

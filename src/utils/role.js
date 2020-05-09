export function classifyRole(role) {
  switch (role) {
    case "0":
      return "学生";
    case "1":
      return "管理员";
    case "2":
      return "班主任";
    case "3":
      return "超级管理员";
    default:
      return "";
  }
}

export function classifyGender(role) {
  switch (role) {
    case 0:
      return "男";
    case 1:
      return "女";
    default:
      return "";
  }
}

export function classifyExami(type) {
  switch (type) {
    case 0:
      return "待审批";
    case 1:
      return "已审批";
    case 2:
      return "已驳回";
    default:
      return "";
  }
}

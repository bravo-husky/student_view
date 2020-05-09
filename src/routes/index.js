import Login from "@pages/Login";
import Dashboard from "@pages/admin/Dashboard/Dashboard";
import PageNotFound from "@pages/PageNotFound";
import Dormitory from "@pages/admin/Dormitory/Dormitory";
import Application from "@pages/admin/Application/Application";
import RoundsPage from "@pages/admin/RoundsPage/RoundsPage";
import AskLeave from "@pages/admin/AskLeave/AskLeave";
import UserList from "@pages/admin/UserList/UserList";
import Internship from "@pages/admin/Internship/Internship";
import ClassList from "@pages/admin/ClassList/ClassList";
import SubmitStudent from "@pages/admin/Dashboard/SubmitStudent/SubmitStudent";
import TeacherList from "@pages/admin/TeacherList/TeacherList";
import ReleaseNight from "@pages/admin/ReleaseNight/ReleaseNight";
import StudyInfo from "@pages/admin/studyInfo/StudyInfo";
import PerformanceWarning from "@pages/admin/PerformanceWarning/PerformanceWarning";
import ReportPage from "@pages/admin/ReportPage/ReportPage";
import SignList from "@pages/admin/SignList/SignList";

export const adminRoutes = [
  {
    path: "/admin/dashboard",
    component: Dashboard,
    isShow: true,
    title: "学生信息管理",
    icon: "user",
    exact: true,
  },
  {
    path: "/admin/userList",
    component: UserList,
    isShow: true,
    title: "用户列表",
    icon: "usergroup-delete",
    exact: true,
  },
  {
    path: "/admin/dormitory",
    component: Dormitory,
    isShow: true,
    title: "宿舍列表",
    icon: "reconciliation",
    exact: true,
  },
  {
    path: "/admin/teacherList",
    component: TeacherList,
    isShow: true,
    title: "教师列表",
    icon: "reconciliation",
    exact: true,
  },
  {
    path: "/admin/SignList",
    component: SignList,
    isShow: true,
    title: "签到列表",
    icon: "reconciliation",
    exact: true,
  },
  {
    path: "/admin/application",
    component: Application,
    isShow: true,
    title: "假条列表",
    icon: "file",
    exact: true,
  },
  {
    path: "/admin/roundsPage",
    component: RoundsPage,
    isShow: false,
    title: "查夜",
    icon: "file",
    exact: true,
  },
  {
    path: "/admin/releaseNight",
    component: ReleaseNight,
    isShow: false,
    title: "查夜",
    icon: "file",
    exact: true,
  },
  {
    path: "/admin/askLeave",
    component: AskLeave,
    isShow: false,
    title: "请假",
    icon: "file",
    exact: true,
  },
  {
    path: "/admin/ClassList",
    component: ClassList,
    isShow: true,
    title: "班级信息",
    icon: "solution",
    exact: true,
  },
  {
    path: "/admin/studyInfo",
    component: StudyInfo,
    isShow: true,
    title: "课程信息",
    icon: "solution",
    exact: true,
  },
  {
    path: "/admin/ReportPage",
    component: ReportPage,
    isShow: true,
    title: "成绩列表",
    icon: "solution",
    exact: true,
  },
  {
    path: "/admin/performanceWarning",
    component: PerformanceWarning,
    isShow: true,
    title: "成绩预警",
    icon: "solution",
    exact: true,
  },
  {
    path: "/admin/Internship",
    component: Internship,
    isShow: true,
    title: "毕业信息",
    icon: "flag",
    exact: true,
  },

  {
    path: "/admin/submit",
    component: SubmitStudent,
  },
  // {
  //   path: "/404",
  //   component: PageNotFound
  // }
];

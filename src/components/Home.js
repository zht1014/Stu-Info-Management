import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  PieChartOutlined,
  DesktopOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Breadcrumb, Avatar, Popover, Button } from "antd";
import { AuthContext } from "../AuthContext";
import ViewExam from "./exam/ViewExam";
import EditExam from "./exam/EditExam";
import ViewCourse from "./course/ViewCourse";
import ManageCourse from "./course/ManageCourse";
import AddCourse from "./course/AddCourse";
import CheckCourse from "./course/CheckCourse";
import CourseReport from "./course/CourseReport";
import TakeAttendance from "./attendance/TakeAttendance";
import ViewAttendance from "./attendance/ViewAttendance";
import EditGrades from "./grade/EditGrades";
import StudentGrades from "./grade/StudentGrades";
import AddExam from "./exam/AddExam";
import MyNotification from "./notification/MyNotification";
import ManageNotification from "./notification/ManageNotification";
const { Header, Content, Footer, Sider } = Layout;

const NavContext = createContext();

const NavProvider = ({ children }) => {
  const [selectedNav, setSelectedNav] = useState("1");
  const { role, userId } = useContext(AuthContext);
  console.log(userId);
  const [items, setItems] = useState([
    {
      key: "1",
      icon: <PieChartOutlined />,
      label: "Option 1",
      component: () => <EditExam />,
    },
    {
      key: "2",
      icon: <DesktopOutlined />,
      label: "Option 2",
      component: () => <ViewExam />,
    },
    {
      key: "course",
      icon: <FileOutlined />,
      label: "Course",
      children: [
        {
          key: "view_course",
          label: "View Course",
          component: () => <ViewCourse />,
        },
        {
          key: "manage_course",
          label: "Manage Course",
          component: () => <ManageCourse />,
        },
        {
          key: "add_course",
          label: "Add Course",
          component: () => <AddCourse />,
        },
      ],
    },
    {
      key: "sub2",
      icon: <TeamOutlined />,
      label: "Team",
      children: [
        { key: "6", label: "Team 1", component: () => <h1>sub2-1</h1> },
        { key: "8", label: "Team 2", component: () => <h1>sub2-2</h1> },
      ],
    },
    {
      key: "9",
      icon: <FileOutlined />,
      label: "Files",
      component: () => <h1>Component 3</h1>,
    },
  ]);

  useEffect(() => {
    if (role == "ADMIN") {
      setItems([
        {
          key: "attendance",
          icon: <DesktopOutlined />,
          label: "Attendance",
          children: [
            {
              key: "view_attendance",
              label: "View Attendacne",
              component: () => <ViewAttendance studentId={1} />,
            },
          ],
          //需要拿到studentid传入这个组件
        },
        {
          key: "course",
          icon: <FileOutlined />,
          label: "Course",
          children: [
            {
              key: "view_course",
              label: "View Course",
              component: () => <ViewCourse />,
            },
            {
              key: "manage_course",
              label: "Manage Course",
              component: () => <ManageCourse />,
            },
            {
              key: "add_course",
              label: "Add Course",
              component: () => <AddCourse />,
            },
            {
              key: "check_course",
              label: "Check Course",
              component: () => <CheckCourse />,
            },
            {
              key: "course_report",
              label: "Course Report",
              component: () => <CourseReport />,
            }
          ],
        },
        {
          key: "sub2",
          icon: <TeamOutlined />,
          label: "exam",
          children: [
            { key: "6", label: "View Exam", component: () => <ViewExam /> },
            { key: "8", label: "Edit Exam", component: () => <EditExam /> },
            { key: "9", label: "Add Exam", component: () => <AddExam /> },
          ],
        },
        {
          key: "10",
          icon: <FileOutlined />,
          label: "Grades",
          children: [
            {
              key: "12",
              label: "View Grade",
              component: () => <StudentGrades />,
            },
            { key: "11", label: "Edit Grade", component: () => <EditGrades /> },
          ],
        },
        {
          key: "notification",
          icon: <FileOutlined />,
          label: "Notification",
          children: [
            {
              key: "my_notification",
              label: "My Notification",
              component: () => <MyNotification />,
            },
            {
              key: "manage_notification",
              label: "Manage Notification",
              component: () => <ManageNotification />,
            },
          ],
        },
      ]);
    }
    if (role == "STUDENT") {
      setItems([
        {
          key: "attendance",
          icon: <DesktopOutlined />,
          label: "Attendance",
          children: [
            {
              key: "take_attendance",
              label: "Take Attendacne",
              component: () => <TakeAttendance studentId={userId} />,
            },
            {
              key: "view_attendance",
              label: "View Attendance",
              component: () => <ViewAttendance studentId={1} />,
            },
          ],
          //需要拿到studentid传入这个组件
        },
        {
          key: "course",
          icon: <FileOutlined />,
          label: "Course",
          children: [
            {
              key: "view_course",
              label: "View Course",
              component: () => <ViewCourse />,
            },
          ],
        },
        {
          key: "sub2",
          icon: <TeamOutlined />,
          label: "exam",
          children: [
            { key: "6", label: "View Exam", component: () => <ViewExam /> },
          ],
        },
        {
          key: "10",
          icon: <FileOutlined />,
          label: "Grades",
          children: [
            {
              key: "12",
              label: "View Grade",
              component: () => <StudentGrades />,
            },
          ],
        },
        {
          key: "notification",
          icon: <FileOutlined />,
          label: "Notification",
          children: [
            {
              key: "my_notification",
              label: "My Notification",
              component: () => <MyNotification />,
            },
          ],
        },
      ]);
    }
    if (role == "TEACHER") {
      setItems([
        {
          key: "attendance",
          icon: <DesktopOutlined />,
          label: "Attendance",
          children: [
            {
              key: "view_attendance",
              label: "View Attendance",
              component: () => <ViewAttendance teacherId={userId} />,
            },
          ],
        },
        {
          key: "course",
          icon: <FileOutlined />,
          label: "Course",
          children: [
            {
              key: "view_course",
              label: "View Course",
              component: () => <ViewCourse />,
            },
            {
              key: "add_course",
              label: "Add Course",
              component: () => <AddCourse />,
            },
            {
              key: "course_report",
              label: "Course Report",
              component: () => <CourseReport />,
            }
          ],
        },
        {
          key: "sub2",
          icon: <TeamOutlined />,
          label: "exam",
          children: [
            { key: "6", label: "View Exam", component: () => <ViewExam /> },
            { key: "8", label: "Edit Exam", component: () => <EditExam /> },
            { key: "9", label: "Add Exam", component: () => <AddExam /> },
          ],
        },
        {
          key: "10",
          icon: <FileOutlined />,
          label: "Grades",
          children: [
            {
              key: "12",
              label: "View Grade",
              component: () => <StudentGrades />,
            },
            { key: "11", label: "Edit Grade", component: () => <EditGrades /> },
          ],
        },
        {
          key: "notification",
          icon: <FileOutlined />,
          label: "Notification",
          children: [
            {
              key: "my_notification",
              label: "My Notification",
              component: () => <MyNotification />,
            }
          ],
        },
      ]);
    }
  }, [role]);

  return (
    <NavContext.Provider
      value={{ selectedNav, setSelectedNav, items, setItems }}
    >
      {children}
    </NavContext.Provider>
  );
};

const findNavItem = (items, key) => {
  for (const item of items) {
    if (item.key === key) {
      return item;
    }
    if (item.children) {
      const found = findNavItem(item.children, key);
      if (found) return found;
    }
  }
  return null;
};

const NavContent = () => {
  const { selectedNav, items } = useContext(NavContext);

  const selectedNavObj = findNavItem(items, selectedNav);

  return selectedNavObj ? selectedNavObj.component() : <div>SSMS</div>;
};

const Home = () => {
  const [open, setOpen] = useState(false);
  const hide = () => setOpen(false);
  const handleOpenChange = (newOpen) => setOpen(newOpen);

  const { role } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <NavProvider>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <div className="demo-logo-vertical" />
          <NavMenu />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 5,
              background: colorBgContainer,
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: 100,
            }}
          >
            <div style={{ padding: 5, paddingRight: 10 }}>
              <Popover
                content={
                  <div style={{ padding: 5, paddingRight: 10 }}>
                    <Button onClick={hide}>Close</Button>
                  </div>
                }
                title="Title"
                trigger="click"
                open={open}
                onOpenChange={handleOpenChange}
                overlayStyle={{ border: "none" }}
              >
                <Avatar style={{ verticalAlign: "middle" }} size="large">
                  {role}
                </Avatar>
              </Popover>
            </div>
          </Header>
          <Content style={{ margin: "0 16px" }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                marginTop: 20,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <NavContent />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </NavProvider>
  );
};

const NavMenu = () => {
  const { selectedNav, setSelectedNav, items } = useContext(NavContext);

  const handleClick = ({ key }) => {
    setSelectedNav(key);
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["1"]}
      onClick={handleClick}
      items={items}
    ></Menu>
  );
};

export default Home;
/* 
setItems([
  {
    key: "attendance",
    icon: <DesktopOutlined />,
    label: "Attendance",
    children: [
      {
        key: "take_attendance",
        label: "Take Attendance",
        component: () => <TakeAttendance studentId={userId}/>,
      },
      {
        key: "view_attendance",
        label: "View Attendacne",
        component: () => <ViewAttendance studentId={1}/>,
      },
    ],
     //需要拿到studentid传入这个组件
  },
  {
    key: "course",
    icon: <FileOutlined />,
    label: "Course",
    children: [
      {
        key: "view_course",
        label: "View Course",
        component: () => <ViewCourse />,
      },
      {
        key: "manage_course",
        label: "Manage Course",
        component: () => <ManageCourse />,
      },
      {
        key: "add_course",
        label: "Add Course",
        component: () => <AddCourse />,
      },
    ],
  },
  {
    key: "sub2",
    icon: <TeamOutlined />,
    label: "exam",
    children: [
      { key: "6", label: "View Exam", component: () => <ViewExam/> },
      { key: "8", label: "Edit Exam", component: () => <EditExam/> },
      { key: "9", label: "Add Exam", component: () => <AddExam/> },
    ],
  },
  {
    key: "10",
    icon: <FileOutlined />,
    label: "Grades",
    children: [
      { key: "12", label: "View Grade", component: () => <StudentGrades/> },
      { key: "11", label: "Edit Grade", component: () => <EditGrades/> },
    ],
  },
]) */

/*   setItems([
    {
      key: "attendance",
      icon: <DesktopOutlined />,
      label: "Attendance",
      children: [
        {
          key: "take_attendance",
          label: "Take Attendacne",
          component: () => <TakeAttendance studentId={userId}/>,
        },
        {
          key: "view_attendance",
          label: "Take Attendance",
          component: () => <ViewAttendance studentId={1}/>,
        },
      ],
       //需要拿到studentid传入这个组件
    },
    {
      key: "course",
      icon: <FileOutlined />,
      label: "Course",
      children: [
        {
          key: "view_course",
          label: "View Course",
          component: () => <ViewCourse />,
        },
      ],
    },
    {
      key: "sub2",
      icon: <TeamOutlined />,
      label: "exam",
      children: [
        { key: "6", label: "View Exam", component: () => <ViewExam/> },
      ],
    },
    {
      key: "10",
      icon: <FileOutlined />,
      label: "Grades",
      children: [
        { key: "12", label: "View Grade", component: () => <StudentGrades/> },
      ],
    },
  ]) */

/* setItems([
      {
        key: "attendance",
        icon: <DesktopOutlined />,
        label: "Attendance",
        children: [
          {
            key: "view_attendance",
            label: "View Attendance",
            component: () => <ViewAttendance studentId={1}/>,
          },
        ],
         //需要拿到studentid传入这个组件
      },
      {
        key: "course",
        icon: <FileOutlined />,
        label: "Course",
        children: [
          {
            key: "view_course",
            label: "View Course",
            component: () => <ViewCourse />,
          },
          {
            key: "manage_course",
            label: "Manage Course",
            component: () => <ManageCourse />,
          },
          {
            key: "add_course",
            label: "Add Course",
            component: () => <AddCourse />,
          },
        ],
      },
      {
        key: "sub2",
        icon: <TeamOutlined />,
        label: "exam",
        children: [
          { key: "6", label: "View Exam", component: () => <ViewExam/> },
          { key: "8", label: "Edit Exam", component: () => <EditExam/> },
          { key: "9", label: "Add Exam", component: () => <AddExam/> },
        ],
      },
      {
        key: "10",
        icon: <FileOutlined />,
        label: "Grades",
        children: [
          { key: "12", label: "View Grade", component: () => <StudentGrades/> },
          { key: "11", label: "Edit Grade", component: () => <EditGrades/> },
        ],
      },
    ]) */

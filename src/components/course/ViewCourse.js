import React, { useState, useContext, useEffect } from "react";
import {
  Table,
  Input,
  DatePicker,
  Select,
  Button,
  Modal,
  notification,
} from "antd";
import { AuthContext } from "../../AuthContext";
import axios from 'axios'
import dayjs from "dayjs";


const { RangePicker } = DatePicker;
const { Option } = Select;

const ViewCourse = () => {
  const { jwt } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(undefined);
  const [selectedTeacher, setSelectedTeacher] = useState(undefined); // 这里修改为选中教师
  const [dates, setDates] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(undefined);
  const [courses, setCourses] = useState([]); // 使用状态来保存课程数据
  
  // 获取唯一的院系和教师列表
  const departments = [...new Set(courses.map((course) => course.department))];
  const teachers = [...new Set(courses.map((course) => course.teacherName))]; // 这里修改为教师名称

  // page load
  useEffect(() => {
    console.log("Component has been loaded");
    getCourseData();
  }, []); // 空数组依赖确保只在页面加载时执行一次

  const getCourseData = async () => {
    try {
      const url = "http://localhost:8080/api/course";
      const { data } = await axios.get(url,{
        headers: {
          authToken: jwt, // 添加 JWT token
        },
        withCredentials: true
      });
      console.log(data)
      setCourses(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 处理选课
  const handleSelectCourse = (course) => {
    Modal.confirm({
      title: "Confirm Selection",
      content: `Are you sure you want to select the course: ${course.courseName}?`,
      onOk: () => {
        // 修改课程选择状态
        setCourses((prevCourses) =>
          prevCourses.map((c) =>
            c.key === course.key ? { ...c, selected: true } : c
          )
        );

        // 通知选课成功
        notification.success({
          message: "Course Selected",
          description: `You have successfully selected the course: ${course.courseName}`,
          placement: "topRight",
        });
      },
    });
  };

  // 定义表格列
  const columns = [
    {
      title: "Course Name",
      dataIndex: "courseName",
      key: "courseName",
    },
    {
      title: "Description",
      dataIndex: "courseDescription",
      key: "courseDescription",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: "Credits", 
      dataIndex: "credits", 
      key: "credits",
    },
    {
      title: "Teacher", 
      dataIndex: "teacherName", 
      key: "teacherName",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
  ];

  // 处理过滤
  const filteredCourses = courses.filter((course) => {
    const isInDepartment = selectedDepartment
      ? course.department === selectedDepartment
      : true;
    const isInTeacher = selectedTeacher
      ? course.teacherName === selectedTeacher // 修改为 teacherName
      : true;
    const isInDateRange =
    dates && dates.length === 2
        ? new Date(course.startDate) >= dates[0] &&
          new Date(course.endDate) <= dates[1]
        : true;
    const isMatched = course.courseName
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const isSelected =
      selectedStatus === "SELECTED"
        ? course.selected
        : selectedStatus === "UNSELECTED"
        ? !course.selected
        : true;

    return (
      isInDepartment && isInTeacher && isInDateRange && isMatched && isSelected // 修改过滤条件
    );
  });

  // 处理分页逻辑
  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: filteredCourses.length,
    showSizeChanger: true,
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
    },
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="Select Course Status"
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value)}
          style={{ width: 200, marginRight: 16 }}
        >
          <Option value={undefined}>All</Option>
          <Option value="SELECTED">Selected Courses</Option>
          <Option value="UNSELECTED">Unselected Courses</Option>
        </Select>
        <Input
          placeholder="Search by Course Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200, marginRight: 16 }}
        />
        <Select
          placeholder="Select Department"
          value={selectedDepartment}
          onChange={(value) =>
            setSelectedDepartment(value === "ALL" ? undefined : value)
          }
          style={{ width: 200, marginRight: 16 }}
        >
          <Option value="ALL">All</Option>
          {departments.map((department) => (
            <Option key={department} value={department}>
              {department}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Select Teacher" // 修改为 Select Teacher
          value={selectedTeacher} // 修改为 selectedTeacher
          onChange={(value) =>
            setSelectedTeacher(value === "ALL" ? undefined : value) // 修改为 selectedTeacher
          }
          style={{ width: 200, marginRight: 16 }}
        >
          <Option value="ALL">All</Option>
          {teachers.map((teacher) => (
            <Option key={teacher} value={teacher}>
              {teacher}
            </Option>
          ))}
        </Select>
        <RangePicker
          value={dates}
          onChange={(dates) => setDates(dates)}
          style={{ marginRight: 16 }}
        />
        <Button
          style={{ width: 50, marginRight: 16 }}
          onClick={() => {
            setSearchText("");
            setSelectedDepartment(undefined); // 重置为占位符
            setSelectedTeacher(undefined); // 重置为占位符
            setDates([]); // 重置日期为默认状态
            setSelectedStatus(undefined); // 重置选课状态为占位符
          }}
        >
          Reset
        </Button>
      </div>
      <Table
        columns={[
          ...columns,
          {
            title: "Action",
            key: "action",
            render: (_, course) => (
              <Button
                type="primary"
                danger={course.selected} // 如果课程已经被选中，按钮变为危险样式
                onClick={() => handleSelectCourse(course)}
                disabled={course.selected}
                style={{
                  backgroundColor: course.selected ? "#f5222d" : "#1890ff", // 按钮颜色
                  borderColor: course.selected ? "#f5222d" : "#1890ff",
                  color: "#fff",
                }}
              >
                {course.selected ? "Selected" : "Select"}
              </Button>
            ),
          },
        ]}
        dataSource={filteredCourses}
        pagination={paginationConfig}
      />
    </div>
  );
};

export default ViewCourse;

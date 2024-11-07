import React, { useState } from "react";
import { Table, Input, DatePicker, Select, Button, Modal, notification } from "antd";
import coursesData from "../../data/courseData"; // 假设这是你的模拟数据路径

const { RangePicker } = DatePicker;
const { Option } = Select;

const ViewCourse = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(undefined);
  const [selectedFaculty, setSelectedFaculty] = useState(undefined);
  const [dates, setDates] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(undefined);
  const [courses, setCourses] = useState(coursesData); // 使用状态来保存课程数据

  // 获取唯一的院系和教师列表
  const departments = [...new Set(courses.map((course) => course.department))];
  const faculties = [...new Set(courses.map((course) => course.faculty))];

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
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Faculty",
      dataIndex: "faculty",
      key: "faculty",
    },
    {
      title: "Credits",
      dataIndex: "credits",
      key: "credits",
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
    const isInFaculty = selectedFaculty
      ? course.faculty === selectedFaculty
      : true;
    const isInDateRange =
      dates.length === 2
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
      isInDepartment && isInFaculty && isInDateRange && isMatched && isSelected
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
          placeholder="Select Faculty"
          value={selectedFaculty}
          onChange={(value) =>
            setSelectedFaculty(value === "ALL" ? undefined : value)
          }
          style={{ width: 200, marginRight: 16 }}
        >
          <Option value="ALL">All</Option>
          {faculties.map((faculty) => (
            <Option key={faculty} value={faculty}>
              {faculty}
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
            setSelectedFaculty(undefined); // 重置为占位符
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

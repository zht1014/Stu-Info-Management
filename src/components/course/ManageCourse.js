import React, { useState } from "react";
import dayjs from 'dayjs';
import { Table, Input, DatePicker, Select, Button, Modal, notification } from "antd";
import coursesData from "../../data/courseData"; // 假设这是你的模拟数据路径

const { RangePicker } = DatePicker;
const { Option } = Select;

const ManageCourse = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(undefined);
  const [selectedFaculty, setSelectedFaculty] = useState(undefined);
  const [dates, setDates] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null); // 当前正在编辑的课程
  const [courses, setCourses] = useState(coursesData); // 使用状态来保存课程数据

  // 获取唯一的院系和教师列表
  const departments = [...new Set(courses.map((course) => course.department))];
  const faculties = [...new Set(courses.map((course) => course.faculty))];

  // 处理删除课程
  const handleDeleteCourse = (course) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: `Are you sure you want to delete the course: ${course.courseName}?`,
      onOk: () => {
        setCourses((prevCourses) => prevCourses.filter((c) => c.key !== course.key));
        notification.success({
          message: "Course Deleted",
          description: `You have successfully deleted the course: ${course.courseName}`,
          placement: "topRight",
        });
      },
    });
  };

  // 处理更新课程
  const handleUpdateCourse = (course) => {
    if (editingCourse?.key === course.key) {
      // 确认更新
      setCourses((prevCourses) =>
        prevCourses.map((c) => (c.key === course.key ? editingCourse : c))
      );
      setEditingCourse(null); // 重置编辑状态
      notification.success({
        message: "Course Updated",
        description: `You have successfully updated the course: ${course.courseName}`,
        placement: "topRight",
      });
    } else {
      // 进入编辑状态
      setEditingCourse(course);
    }
  };

  // 定义表格列
  const columns = [
    {
      title: "Course Name",
      dataIndex: "courseName",
      key: "courseName",
      render: (text, course) =>
        editingCourse?.key === course.key ? (
          <Input
            value={editingCourse.courseName}
            onChange={(e) => setEditingCourse({ ...editingCourse, courseName: e.target.value })}
          />
        ) : (
          text
        ),
    },
    {
      title: "Description",
      dataIndex: "courseDescription",
      key: "courseDescription",
      render: (text, course) =>
        editingCourse?.key === course.key ? (
          <Input
            value={editingCourse.courseDescription}
            onChange={(e) => setEditingCourse({ ...editingCourse, courseDescription: e.target.value })}
          />
        ) : (
          text
        ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text, course) =>
        editingCourse?.key === course.key ? (
          <DatePicker
            value={editingCourse.startDate ? dayjs(editingCourse.startDate) : null}
            onChange={(date) => setEditingCourse({ ...editingCourse, startDate: date ? date.toISOString() : null })}
          />
        ) : (
          new Date(text).toLocaleDateString() // 将日期格式化为可读字符串
        ),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text, course) =>
        editingCourse?.key === course.key ? (
          <DatePicker
            value={editingCourse.endDate ? dayjs(editingCourse.endDate) : null}
            onChange={(date) => setEditingCourse({ ...editingCourse, endDate: date ? date.toISOString() : null })}
          />
        ) : (
          new Date(text).toLocaleDateString() // 将日期格式化为可读字符串
        ),
    },
    {
      title: "Faculty",
      dataIndex: "faculty",
      key: "faculty",
      render: (text, course) =>
        editingCourse?.key === course.key ? (
          <Select
            value={editingCourse.faculty}
            onChange={(value) => setEditingCourse({ ...editingCourse, faculty: value })}
          >
            {faculties.map((faculty) => (
              <Option key={faculty} value={faculty}>
                {faculty}
              </Option>
            ))}
          </Select>
        ) : (
          text
        ),
    },
    {
      title: "Credits",
      dataIndex: "credits",
      key: "credits",
      render: (text, course) =>
        editingCourse?.key === course.key ? (
          <Input
            type="number"
            value={editingCourse.credits}
            onChange={(e) => setEditingCourse({ ...editingCourse, credits: e.target.value })}
          />
        ) : (
          text
        ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (text, course) =>
        editingCourse?.key === course.key ? (
          <Select
            value={editingCourse.department}
            onChange={(value) => setEditingCourse({ ...editingCourse, department: value })}
          >
            {departments.map((department) => (
              <Option key={department} value={department}>
                {department}
              </Option>
            ))}
          </Select>
        ) : (
          text
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, course) => (
        <div>
          <Button
            type="primary"
            onClick={() => handleUpdateCourse(course)}
            style={{ marginRight: 8 }}
          >
            {editingCourse?.key === course.key ? "Confirm" : "Update"}
          </Button>
          <Button
            type="danger"
            onClick={() => handleDeleteCourse(course)}
          >
            Delete
          </Button>
        </div>
      ),
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
        ? new Date(course.startDate) >= dates[0] && new Date(course.endDate) <= dates[1]
        : true;
    const isMatched = course.courseName
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return isInDepartment && isInFaculty && isInDateRange && isMatched;
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
            setDates([]); // 重置为占位符
          }}
        >
          Reset
        </Button>
      </div>
      <Table
        dataSource={filteredCourses}
        columns={columns}
        pagination={paginationConfig}
        rowKey="key"
      />
    </div>
  );
};

export default ManageCourse;

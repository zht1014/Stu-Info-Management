import React, { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import {
  Table,
  Input,
  DatePicker,
  Button,
  Modal,
  notification,
  Popconfirm,
} from "antd";
import { AuthContext } from "../../AuthContext";
import axios from "axios";

const { RangePicker } = DatePicker;

const ManageCourse = () => {
  const { jwt } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingValues, setEditingValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchCourseData();
  }, []);

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/course", {
        headers: { authToken: jwt },
        withCredentials: true,
      });
      setCourses(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 进入编辑模式
  const handleEditCourse = (course) => {
    setEditingCourseId(course.courseId); // 使用 courseId 作为编辑标识
    setEditingValues({
      ...course,
      startDate: dayjs(course.startDate),
      endDate: dayjs(course.endDate),
    });
  };

  // 保存更新
  const handleSaveCourse = async () => {
    try {
      console.log("Editing values:", editingValues);
      await axios.put(
        `http://localhost:8080/api/course/${editingCourseId}`,
        {
          ...editingValues,
          startDate: editingValues.startDate.format("YYYY-MM-DD") + "T00:00:00",
          endDate: editingValues.endDate.format("YYYY-MM-DD") + "T00:00:00",
        },
        { headers: { authToken: jwt } }
      );
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.courseId === editingCourseId ? { ...editingValues } : course
        )
      );
      notification.success({
        message: "Course Updated",
        description: "The course has been successfully updated.",
        placement: "topRight",
      });
      setEditingCourseId(null);
    } catch (error) {
      console.error("Error updating course:", error);
      notification.error({
        message: "Update Failed",
        description: "Failed to update the course.",
        placement: "topRight",
      });
    }
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingCourseId(null);
    setEditingValues({});
  };

  // 删除课程
  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://localhost:8080/api/course/${courseId}`, {
        headers: { authToken: jwt },
      });
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.courseId !== courseId)
      );
      notification.success({
        message: "Course Deleted",
        description: "The course has been successfully deleted.",
        placement: "topRight",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      notification.error({
        message: "Delete Failed",
        description: "Failed to delete the course.",
        placement: "topRight",
      });
    }
  };

  // 更新编辑的值
  const handleValueChange = (key, value) => {
    setEditingValues((prevValues) => ({ ...prevValues, [key]: value }));
  };

  const columns = [
    {
      title: "Course Name",
      dataIndex: "courseName",
      key: "courseName",
      render: (text, course) =>
        editingCourseId === course.courseId ? (
          <Input
            value={editingValues.courseName}
            onChange={(e) => handleValueChange("courseName", e.target.value)}
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
        editingCourseId === course.courseId ? (
          <Input
            value={editingValues.courseDescription}
            onChange={(e) =>
              handleValueChange("courseDescription", e.target.value)
            }
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
        editingCourseId === course.courseId ? (
          <DatePicker
            value={editingValues.startDate}
            onChange={(date) => handleValueChange("startDate", date)}
          />
        ) : (
          dayjs(text).format("YYYY-MM-DD")
        ),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text, course) =>
        editingCourseId === course.courseId ? (
          <DatePicker
            value={editingValues.endDate}
            onChange={(date) => handleValueChange("endDate", date)}
          />
        ) : (
          dayjs(text).format("YYYY-MM-DD")
        ),
    },
    {
      title: "Credits", 
      dataIndex: "credits", 
      key: "credits",
      render: (text, course) =>
        editingCourseId === course.courseId ? (
          <Input
            value={editingValues.credits}
            onChange={(e) => handleValueChange("credits", e.target.value)}
          />
        ) : (
          text
        ),
    },
    {
      title: "Teacher",
      dataIndex: "teacherName",
      key: "teacherName",
      render: (text, course) =>
        editingCourseId === course.courseId ? (
          <Input
            value={editingValues.teacherName}
            onChange={(e) => handleValueChange("teacherName", e.target.value)}
          />
        ) : (
          text
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, course) =>
        editingCourseId === course.courseId ? (
          <div>
            <Button type="link" onClick={handleSaveCourse}>
              Save
            </Button>
            <Button type="link" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </div>
        ) : (
          <div>
            <Button type="link" onClick={() => handleEditCourse(course)}>
              Edit
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this course?"
              onConfirm={() => handleDeleteCourse(course.courseId)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>
                Delete
              </Button>
            </Popconfirm>
          </div>
        ),
    },
  ];

  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: courses.length,
    showSizeChanger: true,
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
    },
  };

  return (
    <Table
      columns={columns}
      dataSource={courses.map((course) => ({ ...course, key: course.courseId }))}
      pagination={paginationConfig}
    />
  );
};

export default ManageCourse;

import React, { useState, useEffect, useContext } from "react";
import { Table, Button, notification, Modal } from "antd";
import { AuthContext } from "../../AuthContext";
import axios from "axios";
import dayjs from "dayjs";

const CheckCourse = () => {
  const { jwt } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchPendingCourses();
  }, [fetchPendingCourses]);

  // 获取待审核课程（状态为 INACTIVE）
  const fetchPendingCourses = async () => {
    try {
      const { data } = await axios.get("http://159.203.52.224/api/course", {
        headers: { authToken: jwt },
        withCredentials: false,
      });
      // 筛选出 status 为 "INACTIVE" 的课程
      const inactiveCourses = data.data.filter(course => course.status === "INACTIVE");
      setCourses(inactiveCourses);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 审核通过课程
  const handleApproveCourse = async (course) => {
    try {
      const updatedCourse = {
        ...course,
        status: "ACTIVE",
        updateDatetime: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
      };

      await axios.put(
        `http://159.203.52.224/api/course/${course.courseId}`,
        updatedCourse,
        { headers: { authToken: jwt } }
      );

      // 更新课程列表，仅保留尚未审核通过的课程
      setCourses((prevCourses) =>
        prevCourses.filter((c) => c.courseId !== course.courseId)
      );
      notification.success({
        message: "Course Approved",
        description: "The course has been successfully approved.",
        placement: "topRight",
      });
    } catch (error) {
      console.error("Error approving course:", error);
      notification.error({
        message: "Approval Failed",
        description: "Failed to approve the course.",
        placement: "topRight",
      });
    }
  };

  // 确认对话框
  const showApproveConfirm = (course) => {
    Modal.confirm({
      title: "Approve Course",
      content: `Are you sure you want to approve the course "${course.courseName}"?`,
      okText: "Yes",
      cancelText: "No",
      onOk: () => handleApproveCourse(course),
    });
  };

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
      title: "Actions",
      key: "actions",
      render: (_, course) => (
        <Button
          type="primary"
          onClick={() => showApproveConfirm(course)}
        >
          Approve
        </Button>
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

export default CheckCourse;

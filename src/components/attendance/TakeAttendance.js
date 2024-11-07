// src/AttendanceForm.js
import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import axios from "axios";

const TakeAttendance = ({ studentId  }) => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  // 加载课程列表
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/v1/courses'); // 假设获取课程的API端点
        setCourses(response.data); // 假设返回的课程数据是数组
      } catch (error) {
        message.error("Failed to load courses.");
      }
    };

    fetchCourses();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const url = `/api/v1/attendance/add/${studentId}/${values.courseId}`;
      await axios.post(url, values);
      message.success("Attendance record saved successfully");
    } catch (error) {
      message.error("Failed to save attendance record.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="courseId"
        label="Course"
        rules={[{ required: true, message: "Please select a course" }]}
      >
        <Select placeholder="Select a course">
          {courses.map((course) => (
            <Select.Option key={course.id} value={course.id}>
              {course.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="attendanceDate"
        label="Date"
        rules={[{ required: true, message: "Please select a date" }]}
      >
        <DatePicker />
      </Form.Item>
      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: "Please select a status" }]}
      >
        <Select>
          <Select.Option value="Present">Present</Select.Option>
          <Select.Option value="Absent">Absent</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="remarks" label="Remarks">
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Take Attendance
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TakeAttendance;

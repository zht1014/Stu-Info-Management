// src/AttendanceForm.js
import React, { useState, useEffect, useContext } from "react";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import axios from "axios";
import { AuthContext } from "../../AuthContext";

const TakeAttendance = ({ studentId }) => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const { jwt, userId } = useContext(AuthContext)
  console.log(studentId)

 
  // 加载课程列表
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const url = "http://localhost:8080/api/course"
        const response = await axios.get(url, {
          headers: {
            authToken: jwt, // 添加 JWT token
          },
          withCredentials: true
        }); // 假设获取课程的API端点
        const data = response.data.data || [];
        setCourses(data);
      } catch (error) {
        message.error("Failed to load courses.");
      }
    };

    fetchCourses();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const course = values.courseId
      const url = `http://localhost:8080/api/v1/attendance/add/${studentId}/${course}`;
      console.log(values)
      const requestBody = {
        "studentId": studentId,        
        "courseId": course,            
        "status": values.status,        
        "remarks": values.remarks,      
        "createUser": "teacher1",       
        "teacherId": 1                  
      };
      console.log(requestBody)
      await axios.post(url, requestBody, {
        headers: {
          authToken: jwt, // 添加 JWT token
        },
        withCredentials: true
      });
      message.success("Attendance record saved successfully");
    } catch (error) {
      message.error("Attendance Taken");
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
            <Select.Option key={course.courseId} value={course.courseId}>
              {course.courseName}
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
          <Select.Option value="PRESENT">Present</Select.Option>
          <Select.Option value="ABSENT">Absent</Select.Option>
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

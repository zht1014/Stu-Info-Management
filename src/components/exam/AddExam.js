// src/AddExam.js
import React, { useState, useContext } from "react";
import { Form, Input, Button, DatePicker, InputNumber, Select, message } from "antd";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
//import moment from "moment";

const { Option } = Select;

const AddExam = () => {
  const { jwt } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const requestBody = {
        courseId: values.courseId,
        examName: values.examName,
        examDate: values.examDate.format("YYYY-MM-DD"), 
        examType: values.examType,
        durationMinutes: values.durationMinutes,
        location: values.location,
        status: values.status,
        createUser: "currentUser", 
        updateUser: "currentUser", 
        createDatetime: new Date().toISOString(),
        updateDatetime: new Date().toISOString(),
      };

      console.log(requestBody)

      await axios.post("http://localhost:8080/api/exam", requestBody, {
        headers: {
          authToken: jwt, // 添加 JWT token
        },
        withCredentials: true,
      });

      message.success("Exam added successfully");
    } catch (error) {
      message.error("Failed to add exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Course ID"
        name="courseId"
        rules={[{ required: true, message: "Please input the Course ID!" }]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
      
      <Form.Item
        label="Exam Name"
        name="examName"
        rules={[{ required: true, message: "Please input the Exam Name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Exam Date"
        name="examDate"
        rules={[{ required: true, message: "Please select the Exam Date!" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Exam Type"
        name="examType"
        rules={[{ required: true, message: "Please select the Exam Type!" }]}
      >
        <Select placeholder="Select exam type">
          <Option value="Midterm">Midterm</Option>
          <Option value="Final">Final</Option>
          <Option value="Quiz">Quiz</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Duration (minutes)"
        name="durationMinutes"
        rules={[{ required: true, message: "Please input the Duration!" }]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Location"
        name="location"
        rules={[{ required: true, message: "Please input the Location!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true, message: "Please select the Status!" }]}
      >
        <Select placeholder="Select status">
          <Option value="Scheduled">Scheduled</Option>
          <Option value="Completed">Completed</Option>
          <Option value="Cancelled">Cancelled</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Add Exam
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddExam;

import React, { useState, useContext } from "react";
import { Form, Input, DatePicker, InputNumber, Button, notification } from "antd";
import { AuthContext } from "../../AuthContext";
import axios from "axios";
import dayjs from "dayjs";

const { TextArea } = Input;

const AddCourse = () => {
  const { jwt } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    const currentDatetime = dayjs().format("YYYY-MM-DDTHH:mm:ss");
    const payload = {
      ...values,
      status: "INACTIVE", // INACTIVE (become ACTIVE after that admin checks and approves it)
      createDatetime: currentDatetime,
      updateDatetime: currentDatetime,
      startDate: values.startDate.format("YYYY-MM-DD") + "T00:00:00",
      endDate: values.endDate.format("YYYY-MM-DD") + "T00:00:00",
    };

    try {
      await axios.post("http://128.199.224.162:8080/api/course", payload, {
        headers: {
          authToken: jwt,
        },
        withCredentials: false,
      });
      notification.success({
        message: "Course Added",
        description: `The course ${values.courseName} has been added successfully.`,
      });
      form.resetFields();
    } catch (error) {
      console.error("Error adding course:", error);
      notification.error({
        message: "Error",
        description: "There was an error adding the course.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Add New Course</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Course Name"
          name="courseName"
          rules={[{ required: true, message: "Please enter the course name" }]}
        >
          <Input placeholder="Enter course name" />
        </Form.Item>

        <Form.Item
          label="Course Description"
          name="courseDescription"
          rules={[{ required: true, message: "Please enter the course description" }]}
        >
          <TextArea placeholder="Enter course description" rows={4} />
        </Form.Item>

        <Form.Item
          label="Teacher Name"
          name="teacherName"
          rules={[{ required: true, message: "Please enter the teacher's name" }]}
        >
          <Input placeholder="Enter teacher's name" />
        </Form.Item>

        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: "Please select the start date" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true, message: "Please select the end date" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Credits"
          name="credits"
          rules={[
            { required: true, message: "Please enter the credits" },
            { type: "number", min: 1, max: 10, message: "Credits should be between 1 and 10" },
          ]}
        >
          <InputNumber placeholder="Enter credits" min={1} max={10} />
        </Form.Item>

        <Form.Item
          label="Department"
          name="department"
          rules={[{ required: true, message: "Please enter the department" }]}
        >
          <Input placeholder="Enter department" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: "100%" }}>
            Add Course
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddCourse;

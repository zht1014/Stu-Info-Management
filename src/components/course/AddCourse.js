import React, { useState } from "react";
import { Form, Input, Select, DatePicker, Button, notification } from "antd";
import coursesData from "../../data/courseData"; // 假设这是你的模拟数据路径

const { Option } = Select;

const AddCourse = () => {
  const [form] = Form.useForm();
  const [courses, setCourses] = useState(coursesData); // 使用状态管理课程数据

  // 从已有课程数据集中获取教师和部门信息
  const faculties = [...new Set(coursesData.map((course) => course.faculty))];
  const departments = [...new Set(coursesData.map((course) => course.department))];

  const handleAddCourse = (values) => {
    console.log("Submitted values:", values); // 调试信息，查看提交的值
    const {
      courseName,
      courseDescription,
      startDate,
      endDate,
      faculty,
      credits,
      department,
    } = values;

    const newCourse = {
      key: courses.length, // 生成一个新的 key
      courseName,
      courseDescription,
      startDate,
      endDate,
      faculty,
      credits,
      department,
      selected: false,
    };

    // 将新的课程添加到课程数据集中
    setCourses((prevCourses) => [...prevCourses, newCourse]);

    // 通知新增成功
    notification.success({
      message: "Course Added",
      description: `You have successfully added the course: ${courseName}`,
      placement: "topRight",
    });

    form.resetFields(); // 重置表单
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Add New Course</h2>
      <Form
        form={form}
        onFinish={handleAddCourse}
        layout="vertical"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Form.Item
          label="Course Name"
          name="courseName"
          rules={[{ required: true, message: "Please input the course name!" }]}
        >
          <Input style={{ width: 300 }} /> {/* 设置输入框宽度 */}
        </Form.Item>

        <Form.Item
          label="Description"
          name="courseDescription"
          rules={[{ required: true, message: "Please input the course description!" }]}
        >
          <Input.TextArea rows={4} style={{ width: 300 }} /> {/* 设置输入框宽度 */}
        </Form.Item>

        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: "Please select the start date!" }]}
        >
          <DatePicker style={{ width: 300 }} /> {/* 设置输入框宽度 */}
        </Form.Item>

        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true, message: "Please select the end date!" }]}
        >
          <DatePicker style={{ width: 300 }} /> {/* 设置输入框宽度 */}
        </Form.Item>

        <Form.Item
          label="Faculty"
          name="faculty"
          rules={[{ required: true, message: "Please select a faculty!" }]}
        >
          <Select placeholder="Select Faculty" style={{ width: 300 }}>
            {faculties.map((faculty) => (
              <Option key={faculty} value={faculty}>
                {faculty}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Credits"
          name="credits"
          rules={[{ required: true, message: "Please input the number of credits!" }]}
        >
          <Input
            type="number"
            min={1}
            max={5}
            step={0.1}
            style={{ width: 300 }}
          /> {/* 设置输入框宽度 */}
        </Form.Item>

        <Form.Item
          label="Department"
          name="department"
          rules={[{ required: true, message: "Please select a department!" }]}
        >
          <Select placeholder="Select Department" style={{ width: 300 }}>
            {departments.map((department) => (
              <Option key={department} value={department}>
                {department}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ display: "block", margin: "0 auto" }}
          >
            Add Course
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddCourse;

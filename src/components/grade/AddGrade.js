import React, { useState, useContext, useEffect } from "react";
import { Form, Input, Button, DatePicker, InputNumber, message, Select } from "antd";
import axios from "axios";
import { AuthContext } from "../../AuthContext"; // 假设 AuthContext 提供 JWT token

const AddGradeForm = () => {
    const [loading, setLoading] = useState(false);
    const { jwt } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);

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
            const gradeData = {
                studentId: values.studentId,
                courseId: values.courseId,
                grade: values.grade,
                gradingDate: new Date().toISOString(),
                feedback: values.feedback,
                createDatetime: new Date().toISOString(),
                updateDatetime: new Date().toISOString(),
                createUser: "string", // 可以根据实际需求修改
                updateUser: "string", // 可以根据实际需求修改
            };

            console.log(gradeData)


            const response = await axios.post("http://localhost:8080/api/grade", gradeData, {
                headers: {
                    authToken: jwt,
                },
                withCredentials: true,
            });

            if (response.data.success) {
                message.success("Grade added successfully!");
            } else {
                message.error("Failed to add grade.");
            }
        } catch (error) {
            message.error("An error occurred while adding the grade.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "24px", maxWidth: "600px", margin: "auto" }}>
            <h2>Add Grade</h2>
            <Form
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    gradeId: "",
                    studentId: "",
                    courseId: "",
                    grade: "",
                    feedback: "",
                }}
            >

                <Form.Item
                    name="studentId"
                    label="Student ID"
                    rules={[{ required: true, message: "Please enter the Student ID" }]}
                >
                    <InputNumber style={{ width: "100%" }} />
                </Form.Item>

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
                    name="grade"
                    label="Grade"
                    rules={[{ required: true, message: "Please enter the grade" }]}
                >
                    <InputNumber style={{ width: "100%" }} min={0} max={100} />
                </Form.Item>

                <Form.Item
                    name="feedback"
                    label="Feedback"
                    rules={[{ required: true, message: "Please enter feedback" }]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Add Grade
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddGradeForm;

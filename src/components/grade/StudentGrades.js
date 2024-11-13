// src/StudentGrades.js
import React, { useState, useEffect, useContext } from "react";
import { Table, message, Input, Button } from "antd";
import axios from "axios";
import { AuthContext } from "../../AuthContext";

const StudentGrades = () => {
  const [grades, setGrades] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const { jwt, userId, role } = useContext(AuthContext);

  const fetchGrades = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://159.203.52.224/api/grade/student/${id}`,
        {
          headers: {
            authToken: jwt, // 添加 JWT token
          },
          withCredentials: true,
        }
      );
      // const data = response.data.data ? [response.data.data] : [];
      // console.log(data)
      setGrades(response.data.data);
    } catch (error) {
      message.error("Failed to load grades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "STUDENT") {
      fetchGrades(userId);
    }
  }, [role,userId]);

  const onSearch = () => {
    if (studentId) {
      fetchGrades(studentId);
    } else {
      message.error("Please enter a student ID.");
    }
  };

  const columns = [
    { title: "Grade ID", dataIndex: "gradeId", key: "gradeId" },
    { title: "Course ID", dataIndex: "courseId", key: "courseId" },
    { title: "Grade", dataIndex: "grade", key: "grade" },
    { title: "Grading Date", dataIndex: "gradingDate", key: "gradingDate" },
    { title: "Feedback", dataIndex: "feedback", key: "feedback" },
  ];

  return (
    <div>
      <h2>Student Grades</h2>
      <Input
        placeholder="Enter Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        style={{ width: 200, marginRight: 8 }}
      />
      <Button type="primary" onClick={onSearch} loading={loading}>
        Search
      </Button>
      <Table
        columns={columns}
        dataSource={grades}
        rowKey="gradeId"
        loading={loading}
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

export default StudentGrades;

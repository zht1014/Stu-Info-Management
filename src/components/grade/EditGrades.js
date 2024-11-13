// src/EditGrades.js
import React, { useState, useContext, useEffect } from "react";
import { Table, message, Button, InputNumber, Popconfirm } from "antd";
import axios from "axios";
import { AuthContext } from "../../AuthContext";

const EditGrades = () => {
  const [grades, setGrades] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingGradeId, setEditingGradeId] = useState(null);
  const {jwt} = useContext(AuthContext)

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://128.199.224.162:8080/api/grade`,{
        headers: {
          authToken: jwt, 
        },
        withCredentials: true
      });
      /* const data = response.data.data ? [response.data.data] : [];
      console.log(data) */
      setGrades(response.data.data);
    } catch (error) {
      message.error("Failed to load grades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []); 

  /* const onSearch = () => {
    if (courseId) {
      fetchGrades(courseId);
    } else {
      message.error("Please enter a course ID.");
    }
  }; */

  const saveGrade = async (record) => {
    try {
      await axios.put(`http://128.199.224.162:8080/api/grade/${record.gradeId}`, record,{
        headers: {
          authToken: jwt, // 添加 JWT token
        },
        withCredentials: true
      });
      message.success("Grade updated successfully.");
      fetchGrades(courseId);
    } catch (error) {
      message.error("Failed to update grade.");
    }
  };

  const deleteGrade = async (gradeId) => {
    try {
      await axios.delete(`http://128.199.224.162:8080/api/grade/${gradeId}`,{
        headers: {
          authToken: jwt, // 添加 JWT token
        },
        withCredentials: true
      });
      message.success("Grade deleted successfully.");
      setGrades((prevGrades) => prevGrades.filter((grade) => grade.gradeId !== gradeId));
    } catch (error) {
      message.error("Failed to delete grade.");
    }
  };

  const columns = [
    { title: "Grade ID", dataIndex: "gradeId", key: "gradeId" },
    { title: "Student ID", dataIndex: "studentId", key: "studentId" },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      render: (text, record) =>
        editingGradeId === record.gradeId ? (
          <InputNumber
            defaultValue={record.grade}
            onChange={(value) => {
              record.grade = value;
            }}
          />
        ) : (
          text
        ),
    },
    { title: "Grading Date", dataIndex: "gradingDate", key: "gradingDate" },
    { title: "Feedback", dataIndex: "feedback", key: "feedback" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        editingGradeId === record.gradeId ? (
          <span>
            <Button
              type="link"
              onClick={() => {
                saveGrade(record);
                setEditingGradeId(null);
              }}
            >
              Save
            </Button>
            <Button type="link" onClick={() => setEditingGradeId(null)}>
              Cancel
            </Button>
          </span>
        ) : (
          <>
            <Button type="link" onClick={() => setEditingGradeId(record.gradeId)}>
              Edit
            </Button>
            <Popconfirm
              title="Are you sure to delete this grade?"
              onConfirm={() => deleteGrade(record.gradeId)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>
                Delete
              </Button>
            </Popconfirm>
          </>
        ),
    },
  ];

  return (
    <div>
      <h2>Edit Grades</h2>
      {/* <Input
        placeholder="Enter Course ID"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        style={{ width: 200, marginRight: 8 }}
      />
      <Button type="primary" onClick={onSearch} loading={loading}>
        Search
      </Button> */}
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

export default EditGrades;

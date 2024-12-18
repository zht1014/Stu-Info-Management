// src/AttendanceTable.js
import React, { useContext, useEffect, useState } from "react";
import { Table, Button, message, Popconfirm } from "antd";
import axios from "axios";
import { AuthContext } from "../../AuthContext";

const ViewAttendance = ({ teacherId, studentId }) => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const {jwt, role} = useContext(AuthContext)

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const url = teacherId 
        ? `http://128.199.224.162:8080/api/v1/attendance/teacher/${teacherId}` 
        : `http://128.199.224.162:8080/api/v1/attendance/student/${studentId}`;
      const { data } = await axios.get(url,{
        headers: {
          authToken: jwt, // 添加 JWT token
        },
        //withCredentials: true
      });
      const dataWithUsername = await Promise.all(
        data.map(async (attendance) => {
          // Use the `userId` from grade data to fetch the username
          const userResponse = await axios.get(`http://128.199.224.162:8080/api/user/${attendance.studentId}`, {
            headers: {
              authToken: jwt, // Add JWT token
            },
          });

          return {
            ...attendance,
            username: userResponse.data.data.username || "Unknown",
          };
        })
      );
      setAttendances(dataWithUsername);
    } catch (error) {
      message.error("Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchAttendance();
  }, [teacherId, studentId]);

  const deleteAttendance = async (record) => {
    try {
      await axios.delete(`http://128.199.224.162:8080/api/v1/attendance/delete/${record.studentId}/${record.courseId}`,{
        headers: {
          authToken: jwt, // 添加 JWT token
        },
        //withCredentials: true
      });
      message.success("Attendance record deleted successfully");
      fetchAttendance();
    } catch (error) {
      message.error("Failed to delete attendance record.");
    }
  };

  const columns = [
    { 
      title: "Username", 
      dataIndex: "username", 
      key: "username" 
    },
    {
      title: "Student ID",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
      title: "Course ID",
      dataIndex: "courseId",
      key: "courseId",
    },
    {
      title: "Date",
      dataIndex: "attendanceDate",
      key: "attendanceDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },
    ...(role !== "STUDENT"
      ? [
          {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
              <Popconfirm
                title="Are you sure you want to delete this record?"
                onConfirm={() => deleteAttendance(record)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            ),
          },
        ]
      : []),
  ];

  return (
    <Table
      columns={columns}
      dataSource={attendances}
      rowKey="attendanceId"
      loading={loading}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default ViewAttendance;

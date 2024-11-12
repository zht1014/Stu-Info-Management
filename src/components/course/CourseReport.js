import React, { useState, useContext, useEffect } from "react";
import { Table, Button, notification, Card } from "antd";
import { AuthContext } from "../../AuthContext";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CourseReport = () => {
  const { userId } = useContext(AuthContext);
  const { role, jwt } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [username, setUsername] = useState("");
  const [courseReportInfo, setCourseReportInfo] = useState(null); // 更改为courseReportInfo
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("course reporting...");

    const fetchData = async () => {
      try {
        const [userResponse, courseResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/user/${userId}`, {
            headers: { authToken: jwt },
            withCredentials: true,
          }),
          axios.get("http://localhost:8080/api/course", {
            headers: { authToken: jwt },
            withCredentials: true,
          }),
        ]);

        const userData = userResponse.data;
        const courseData = courseResponse.data;

        setUsername(userData.data.username);
        const filteredCourses =
          role === "TEACHER"
            ? courseData.data.filter(
                (course) => course.teacherName === userData.data.username
              )
            : courseData.data;

        setCourses(filteredCourses);
      } catch (error) {
        console.error("Error fetching data:", error);
        notification.error({
          message: "Data Fetch Error",
          description: "Unable to load courses.",
        });
      }
    };

    fetchData();
  }, [role, userId, jwt]);

  const handleViewReport = async (courseId) => {
    setLoading(true);
    try {
      const reportUrl = `http://localhost:8080/api/course/report/${courseId}`;
      const { data: reportData } = await axios.get(reportUrl, {
        headers: { authToken: jwt },
        withCredentials: true,
      });
      setCourseReportInfo(reportData); // 更新为 courseReportInfo
    } catch (error) {
      console.error("Error fetching report:", error);
      notification.error({
        message: "Report Fetch Error",
        description: "Unable to load report.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setCourseReportInfo(null); // 清空选中的课程信息
  };

  // 图表的成绩分布
  const scoreDistributionData = courseReportInfo
    ? courseReportInfo.scoreDistribution.map((score, index) => ({
        name: `${index * 10}-${(index + 1) * 10}`,
        count: score,
      }))
    : [];

  // 学生成绩与出勤率
  const studentGradesData = courseReportInfo
    ? courseReportInfo.studentGrades.map((student) => ({
        name: student.studentName,
        grade: student.grade,
        attendanceRate: student.attendanceRate.toFixed(2) + '%', // 添加百分号
      }))
    : [];

  // 按出勤率区间分组（0%-30%, 30%-80%, 80%-100%）
  const attendanceRateGroups = courseReportInfo
    ? courseReportInfo.studentGrades.reduce(
        (acc, student) => {
          const rate = student.attendanceRate;
          if (rate <= 30) {
            acc[0].count += 1;
          } else if (rate <= 80) {
            acc[1].count += 1;
          } else {
            acc[2].count += 1;
          }
          return acc;
        },
        [
          { name: "0-30%", count: 0 },
          { name: "30%-80%", count: 0 },
          { name: "80%-100%", count: 0 },
        ]
      )
    : [];

  const columns = [
    { title: "Course Name", dataIndex: "courseName", key: "courseName" },
    {
      title: "Description",
      dataIndex: "courseDescription",
      key: "courseDescription",
    },
    { title: "Teacher", dataIndex: "teacherName", key: "teacherName" },
    {
      title: "Action",
      key: "action",
      render: (_, course) => (
        <Button
          type="primary"
          onClick={() => handleViewReport(course.courseId)}
        >
          View Report Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      {courseReportInfo ? (
        <div>
          <Button onClick={handleBack} style={{ marginBottom: 16 }}>
            Back to Course List
          </Button>

          {/* 显示报告的统计信息 */}
          <Card
            title={`Report for ${courseReportInfo.courseName}`}
            style={{ marginTop: 16 }}
          >
            <p>
              <strong>Average Grade:</strong> {courseReportInfo.averageGrade}
            </p>
            <p>
              <strong>Total Enrolled Students:</strong>{" "}
              {courseReportInfo.totalEnrolledStudents}
            </p>
            <p>
              <strong>Distribution of Students' Grade:</strong>
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>

            <p>
              <strong>Attendance Rate Distribution:</strong>
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceRateGroups}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>

            <p>
              <strong>Table:</strong>
            </p>
            <Table
              dataSource={studentGradesData}
              columns={[
                { title: "Student Name", dataIndex: "name", key: "name" },
                { title: "Grade", dataIndex: "grade", key: "grade" },
                {
                  title: "Attendance Rate",
                  dataIndex: "attendanceRate",
                  key: "attendanceRate",
                },
              ]}
              rowKey="name"
              pagination={{
                pageSize: 10, // 每页显示10条数据
                defaultCurrent: 1, // 默认显示第一页
              }}
              style={{ marginTop: 16 }}
            />
          </Card>
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="courseId"
          pagination={{ pageSize: 10, defaultCurrent: 1 }} // 每页显示10条数据
        />
      )}
    </div>
  );
};

export default CourseReport;

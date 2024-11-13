import React, { useState, useContext, useEffect } from "react";
import {
  Table,
  Input,
  DatePicker,
  Select,
  Button,
  Modal,
  notification,
} from "antd";
import { AuthContext } from "../../AuthContext";
import axios from "axios";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

const ViewCourse = () => {
  const { userId, role, jwt } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(undefined);
  const [selectedTeacher, setSelectedTeacher] = useState(undefined);
  const [dates, setDates] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(undefined);
  const [courses, setCourses] = useState([]);
  const [username, setUsername] = useState(""); // Added username state

  const departments = [...new Set(courses.map((course) => course.department))];
  const teachers = [...new Set(courses.map((course) => course.teacherName))];

  // Fetch courses and user information
  useEffect(() => {
    console.log("login role is:", role);
    console.log("Fetching course data...");

    const fetchData = async () => {
      try {
        // Fetch user details (username)
        const userUrl = `http://159.203.52.224/api/user/${userId}`;
        const { data: userData } = await axios.get(userUrl, {
          headers: { authToken: jwt },
          withCredentials: false,
        });
        setUsername(userData.data.username); // Set username from response

        // Fetch courses data
        const courseUrl = "http://159.203.52.224/api/course";
        const { data: courseData } = await axios.get(courseUrl, {
          headers: { authToken: jwt },
          withCredentials: false,
        });

        // Fetch enrollment data for the user
        const enrollmentUrl = `http://159.203.52.224/api/enrollment/user/${userId}`;
        const { data: enrollmentData } = await axios.get(enrollmentUrl, {
          headers: { authToken: jwt },
          withCredentials: false,
        });

        setCourses(
          courseData.data.map((course) => {
            const enrollment = enrollmentData.data.find(
              (enrollment) => enrollment.courseId === course.courseId
            );
            const isSelected = enrollment ? true : false;

            return {
              ...course,
              selected: isSelected,
              enrollmentId: enrollment ? enrollment.enrollmentId : null,
            };
          })
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [role, userId, jwt]); // Added userId and jwt as dependencies

  const handleSelectCourse = async (course) => {
    Modal.confirm({
      title: course.selected ? "Confirm Unselect" : "Confirm Select",
      content: `Are you sure you want to ${
        course.selected ? "unselect" : "select"
      } the course: ${course.courseName}?`,
      onOk: async () => {
        try {
          if (course.selected) {
            await axios.delete(
              `http://159.203.52.224/api/enrollment/${course.enrollmentId}`,
              {
                headers: { authToken: jwt },
                withCredentials: false,
              }
            );
            setCourses((prevCourses) =>
              prevCourses.map((c) =>
                c.courseId === course.courseId ? { ...c, selected: false } : c
              )
            );
            notification.success({
              message: "Course Unselected",
              description: `You have successfully unselected the course: ${course.courseName}`,
              placement: "topRight",
            });
          } else {
            const { data: enrollmentData } = await axios.post(
              `http://159.203.52.224/api/enrollment`,
              {
                studentId: userId,
                courseId: course.courseId,
                enrollmentDate: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
                status: "ENROLLED",
                createDatetime: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
                updateDatetime: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
                createUser: username,
                updateUser: username,
                studentName: username,
              },
              {
                headers: { authToken: jwt },
                withCredentials: false,
              }
            );
            setCourses((prevCourses) =>
              prevCourses.map((c) =>
                c.courseId === course.courseId
                  ? {
                      ...c,
                      selected: true,
                      enrollmentId: enrollmentData.data.enrollmentId,
                    }
                  : c
              )
            );
            notification.success({
              message: "Course Selected",
              description: `You have successfully selected the course: ${course.courseName}`,
              placement: "topRight",
            });
          }
        } catch (error) {
          notification.error({
            message: course.selected ? "Unselect Failed" : "Selection Failed",
            description: `Failed to ${
              course.selected ? "unselect" : "select"
            } the course. Please try again.`,
            placement: "topRight",
          });
        }
      },
    });
  };

  const columns = [
    { title: "Course Name", dataIndex: "courseName", key: "courseName" },
    {
      title: "Description",
      dataIndex: "courseDescription",
      key: "courseDescription",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => dayjs(text).format("YYYY-MM-DD"),
    },
    { title: "Credits", dataIndex: "credits", key: "credits" },
    { title: "Teacher", dataIndex: "teacherName", key: "teacherName" },
    { title: "Department", dataIndex: "department", key: "department" },
    // Conditionally render Action column only if role is STUDENT
    ...(role === "STUDENT"
      ? [
          {
            title: "Action",
            key: "action",
            render: (_, course) => (
              <Button
                type="primary"
                danger={course.selected}
                onClick={() => handleSelectCourse(course)}
                style={{
                  backgroundColor: course.selected ? "#f5222d" : "#1890ff",
                  borderColor: course.selected ? "#f5222d" : "#1890ff",
                  color: "#fff",
                }}
              >
                {course.selected ? "Unselect" : "Select"}
              </Button>
            ),
          },
        ]
      : []),
  ];

  const filteredCourses = courses.filter((course) => {
    const isActive = course.status === "ACTIVE";
    const isInDepartment = selectedDepartment
      ? course.department === selectedDepartment
      : true;
    const isInTeacher = selectedTeacher
      ? course.teacherName === selectedTeacher
      : true;
    const isInDateRange =
      dates && dates.length === 2
        ? new Date(course.startDate) >= dates[0] &&
          new Date(course.endDate) <= dates[1]
        : true;
    const isMatched = course.courseName
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const isSelected =
      selectedStatus === "SELECTED"
        ? course.selected
        : selectedStatus === "UNSELECTED"
        ? !course.selected
        : true;

    return (
      isActive &&
      isInDepartment &&
      isInTeacher &&
      isInDateRange &&
      isMatched &&
      isSelected
    );
  });

  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: filteredCourses.length,
    showSizeChanger: true,
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
    },
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="Select Course Status"
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value)}
          style={{ width: 200, marginRight: 16 }}
        >
          <Option value={undefined}>All</Option>
          <Option value="SELECTED">Selected Courses</Option>
          <Option value="UNSELECTED">Unselected Courses</Option>
        </Select>
        <Input
          placeholder="Search by Course Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200, marginRight: 16 }}
        />
        <Select
          placeholder="Select Department"
          value={selectedDepartment}
          onChange={(value) =>
            setSelectedDepartment(value === "ALL" ? undefined : value)
          }
          style={{ width: 200, marginRight: 16 }}
        >
          <Option value="ALL">All</Option>
          {departments.map((department) => (
            <Option key={department} value={department}>
              {department}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Select Teacher"
          value={selectedTeacher}
          onChange={(value) =>
            setSelectedTeacher(value === "ALL" ? undefined : value)
          }
          style={{ width: 200, marginRight: 16 }}
        >
          <Option value="ALL">All</Option>
          {teachers.map((teacher) => (
            <Option key={teacher} value={teacher}>
              {teacher}
            </Option>
          ))}
        </Select>
        <RangePicker
          value={dates}
          onChange={(value) => setDates(value)}
          style={{ marginRight: 16 }}
        />
        <Button
          onClick={() => {
            setSelectedDepartment(undefined);
            setSelectedTeacher(undefined);
            setDates([]);
            setSelectedStatus(undefined);
            setSearchText("");
          }}
        >
          Reset Filters
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredCourses}
        rowKey="courseId"
        pagination={paginationConfig}
      />
    </div>
  );
};

export default ViewCourse;

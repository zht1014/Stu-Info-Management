import React, { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import {
  Table,
  Input,
  DatePicker,
  Button,
  Select,
  notification,
  Popconfirm,
} from "antd";
import { AuthContext } from "../../AuthContext";
import axios from "axios";

const { RangePicker } = DatePicker;
const { Option } = Select;

const ManageCourse = () => {
  const { jwt } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingValues, setEditingValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(undefined);
  const [selectedTeacher, setSelectedTeacher] = useState(undefined);
  const [dates, setDates] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(undefined);

  useEffect(() => {
    fetchCourseData();
  }, []);

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get("http://128.199.224.162:8080/api/course", {
        headers: { authToken: jwt },
        withCredentials: false,
      });
      const activeCourses = data.data.filter(
        (course) => course.status === "ACTIVE"
      );
      setCourses(activeCourses);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const departments = [...new Set(courses.map((course) => course.department))];
  const teachers = [...new Set(courses.map((course) => course.teacherName))];

  const handleEditCourse = (course) => {
    setEditingCourseId(course.courseId);
    setEditingValues({
      ...course,
      startDate: dayjs(course.startDate),
      endDate: dayjs(course.endDate),
    });
  };

  const handleSaveCourse = async () => {
    try {
      await axios.put(
        `http://128.199.224.162:8080/api/course/${editingCourseId}`,
        {
          ...editingValues,
          startDate: editingValues.startDate.format("YYYY-MM-DD") + "T00:00:00",
          endDate: editingValues.endDate.format("YYYY-MM-DD") + "T00:00:00",
          updateDatetime: new Date().toISOString(),
        },
        { headers: { authToken: jwt } }
      );
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.courseId === editingCourseId ? { ...editingValues } : course
        )
      );
      notification.success({
        message: "Course Updated",
        description: "The course has been successfully updated.",
        placement: "topRight",
      });
      setEditingCourseId(null);
    } catch (error) {
      console.error("Error updating course:", error);
      notification.error({
        message: "Update Failed",
        description: "Failed to update the course.",
        placement: "topRight",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingCourseId(null);
    setEditingValues({});
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://128.199.224.162:8080/api/course/${courseId}`, {
        headers: { authToken: jwt },
      });
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.courseId !== courseId)
      );
      notification.success({
        message: "Course Deleted",
        description: "The course has been successfully deleted.",
        placement: "topRight",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      notification.error({
        message: "Delete Failed",
        description: "Failed to delete the course.",
        placement: "topRight",
      });
    }
  };

  const handleDisapproveCourse = async (course) => {
    try {
      await axios.put(
        `http://128.199.224.162:8080/api/course/${course.courseId}`,
        {
          ...course,
          status: "INACTIVE",
          updateDatetime: new Date(
            new Date().getTime() + 8 * 60 * 60 * 1000
          ).toISOString(),
        },
        { headers: { authToken: jwt } }
      );
      setCourses((prevCourses) =>
        prevCourses.filter((c) => c.courseId !== course.courseId)
      );
      notification.success({
        message: "Course Disapproved",
        description: "The course has been successfully disapproved.",
        placement: "topRight",
      });
    } catch (error) {
      console.error("Error disapproving course:", error);
      notification.error({
        message: "Disapproval Failed",
        description: "Failed to disapprove the course.",
        placement: "topRight",
      });
    }
  };

  const handleValueChange = (key, value) => {
    setEditingValues((prevValues) => ({ ...prevValues, [key]: value }));
  };

  const filteredCourses = courses.filter((course) => {
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
      isInDepartment && isInTeacher && isInDateRange && isMatched && isSelected
    );
  });

  const columns = [
    {
      title: "Course Name",
      dataIndex: "courseName",
      key: "courseName",
      render: (text, course) =>
        editingCourseId === course.courseId ? (
          <Input
            value={editingValues.courseName}
            onChange={(e) => handleValueChange("courseName", e.target.value)}
          />
        ) : (
          text
        ),
    },
    {
      title: "Description",
      dataIndex: "courseDescription",
      key: "courseDescription",
      render: (text, course) =>
        editingCourseId === course.courseId ? (
          <Input
            value={editingValues.courseDescription}
            onChange={(e) =>
              handleValueChange("courseDescription", e.target.value)
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text, course) =>
        editingCourseId === course.courseId ? (
          <DatePicker
            value={editingValues.startDate}
            onChange={(date) => handleValueChange("startDate", date)}
          />
        ) : (
          dayjs(text).format("YYYY-MM-DD")
        ),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text, course) =>
        editingCourseId === course.courseId ? (
          <DatePicker
            value={editingValues.endDate}
            onChange={(date) => handleValueChange("endDate", date)}
          />
        ) : (
          dayjs(text).format("YYYY-MM-DD")
        ),
    },
    {
      title: "Teacher",
      dataIndex: "teacherName",
      key: "teacherName",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, course) =>
        editingCourseId === course.courseId ? (
          <div>
            <Button type="link" onClick={handleSaveCourse}>
              Save
            </Button>
            <Button type="link" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </div>
        ) : (
          <div>
            <Button type="link" onClick={() => handleEditCourse(course)}>
              Edit
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this course?"
              onConfirm={() => handleDeleteCourse(course.courseId)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>
                Delete
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Are you sure you want to disapprove this course?"
              onConfirm={() => handleDisapproveCourse(course)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>
                Disapprove
              </Button>
            </Popconfirm>
          </div>
        ),
    },
  ];

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
          onChange={(value) => setSelectedTeacher(value)}
          style={{ width: 200, marginRight: 16 }}
        >
          <Option value={undefined}>All</Option>
          {teachers.map((teacher) => (
            <Option key={teacher} value={teacher}>
              {teacher}
            </Option>
          ))}
        </Select>
        <RangePicker
          value={dates}
          onChange={(dates) => setDates(dates)}
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
        dataSource={filteredCourses}
        columns={columns}
        pagination={paginationConfig}
        rowKey="courseId"
      />
    </div>
  );
};

export default ManageCourse;

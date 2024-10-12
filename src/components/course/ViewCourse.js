import React, { useState } from 'react';
import { Table } from 'antd';
import courses from '../../data/courseData';


const ViewCourse = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 定义表格列的格式
  const columns = [
    {
      title: "Course Name",
      dataIndex: "courseName",
      key: "courseName",
    },
    {
      title: "Description",
      dataIndex: "courseDescription",
      key: "courseDescription",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Faculty",
      dataIndex: "faculty",
      key: "faculty",
    },
    {
      title: "Credits",
      dataIndex: "credits",
      key: "credits",
    },
  ];

  // 处理分页逻辑
  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: courses.length,
    showSizeChanger: true,
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
    },
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={courses}
        pagination={paginationConfig}
      />
    </div>
  );
};

export default ViewCourse;

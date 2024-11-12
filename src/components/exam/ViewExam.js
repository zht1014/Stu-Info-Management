import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';
import { Table, Form, Switch } from 'antd';
import { render } from '@testing-library/react';
import { Color } from 'antd/es/color-picker';

/* staff可以看到所有考试，student只能看到要参加的考试 */

const ViewExam = () => {
    const [examList, setExamList] = useState([])
    const { jwt, userId } = useContext(AuthContext)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const enrollmentUrl = `http://localhost:8080/api/enrollment/user/${userId}`;
                const { data: enrollmentData } = await axios.get(enrollmentUrl, {
                    headers: {
                        authToken: jwt,
                    },
                    withCredentials: true,
                });

                const response = await axios.get("http://localhost:8080/api/exam", {
                    headers: {
                        authToken: jwt,
                    },
                    withCredentials: true,
                });

                const enrolledCourses = Array.isArray(enrollmentData.data) ? enrollmentData.data : [];
                const exams = Array.isArray(response.data.data) ? response.data.data : [];

                const filteredExamList = exams.filter((exam) =>
                    enrolledCourses.some((enrollment) => enrollment.courseId === exam.courseId)
                );

                setExamList(filteredExamList);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    

    const userRole = useContext(AuthContext)

    const columns = [
        {
            title: 'Exam Name',
            dataIndex: 'examName',
            key: 'exam_name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Course Id',
            dataIndex: 'courseId',
            key: 'course_id',
        },
        {
            title: 'Date',
            dataIndex: 'examDate',
            key: 'exam_date',
            render: (text) => {
                if (text) return text
                else return <a style={{ color: 'red' }}>UNSCHEDULED</a>
            }
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            render: (text) => {
                if (text) return text
                else return <a style={{ color: 'red' }}>UNSCHEDULED</a>
            }
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Duration Minutes',
            dataIndex: 'durationMinutes',
            key: 'duration_minutes',
            render: (text) => {
                if (text) return text
                else return <a style={{ color: 'red' }}>UNSCHEDULED</a>
            }
        }
    ];

    return (
        <div>
            <Table columns={columns} dataSource={examList} />
        </div>
    );
};

export default ViewExam;

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';
import { Table, Form, Switch } from 'antd';
import { render } from '@testing-library/react';
import { Color } from 'antd/es/color-picker';

/* staff可以看到所有考试，student只能看到要参加的考试 */

const ViewExam = () => {
    const [examList, setExamList] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/exam/list")
                console.log(response.data)
                setExamList(response.data.list)
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    const userRole = useContext(AuthContext)

    const columns = [
        {
            title: 'Course Name',
            dataIndex: 'course_name',
            key: 'course_name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Id',
            dataIndex: 'course_id',
            key: 'course_id',
        },
        {
            title: 'Date',
            dataIndex: 'exam_date',
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
            dataIndex: 'duration_minutes',
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

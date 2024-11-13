import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Select, DatePicker, Popconfirm, Table, Typography } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { AuthContext } from '../../AuthContext';

const { Option } = Select;

const EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
    children,
    onChange,
    ...restProps
}) => {
    let inputNode;

    switch (dataIndex) {
        case 'location':
            inputNode = (
                <Select
                    defaultValue={record.location}
                    style={{ width: '100%' }}
                    onChange={(value) => onChange(dataIndex, value)}
                >
                    <Option value="Classroom">Classroom</Option>
                    <Option value="Lab">Lab</Option>
                    <Option value="Online">Online</Option>
                    <Option value="">NULL</Option>
                </Select>
            );
            break;
        case 'examDate':
            inputNode = (
                <DatePicker
                    value={record.examDate ? dayjs(record.examDate) : null}
                    style={{ width: '100%' }}
                    onChange={(date) => {
                        onChange(dataIndex, date);
                    }}
                />
            );
            break;
        case 'durationMinutes':
            inputNode = (
                <Input
                    type="number"
                    defaultValue={record.durationMinutes}
                    onChange={(e) => onChange(dataIndex, e.target.value)}
                />
            );
            break;
        default:
            inputNode = <Input />;
    }

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: `Please Input ${title}!` }]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const EditExam = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const { jwt } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://159.203.52.224/api/exam", {
                    headers: {
                        authToken: jwt, // 添加 JWT token
                    },
                    withCredentials: false,
                });
                const dataWithKeys = response.data.data.map((item, index) => ({
                    ...item,
                    key: item.id || index,
                    examDate: item.examDate ? dayjs(item.examDate) : null,
                }));
                setData(dataWithKeys);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [jwt]);

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            course_name: record.course_name,
            course_id: record.course_id,
            examDate: record.examDate,
            location: record.location,
            type: record.type,
            durationMinutes: record.durationMinutes,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            console.log(row)
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                const updatedItem = {
                    examId: item.examId,
                    courseId: item.courseId,
                    examName: item.examName,
                    examDate: row.examDate.format('YYYY-MM-DD'),
                    examType: item.examType,
                    durationMinutes: row.durationMinutes,
                    location: row.location,
                    status: item.status,
                    createDatetime: item.createDatetime,
                    updateDatetime: new Date().toISOString(),
                    createUser: item.createUser,
                    updateUser: "currentUser"
                };
                console.log(updatedItem)

                await axios.put(`http://159.203.52.224/api/exam/${item.examId}`, updatedItem, {
                    headers: {
                        authToken: jwt,
                    },
                    withCredentials: false,
                });

                newData.splice(index, 1, updatedItem);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const deleteExam = async (examId) => {
        try {
            await axios.delete(`http://159.203.52.224/api/exam/${examId}`, {
                headers: {
                    authToken: jwt,
                },
                withCredentials: false,
            });
            setData(data.filter((item) => item.examId !== examId));
        } catch (error) {
            console.log('Delete Failed:', error);
        }
    };

    const handleChange = (dataIndex, value) => {
        const updatedData = data.map((item) => {
            if (item.key === editingKey) {
                return { ...item, [dataIndex]: value };
            }
            return item;
        });
        setData(updatedData);
    };

    const columns = [
        {
            title: 'Course Name',
            dataIndex: 'examName',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Id',
            dataIndex: 'courseId',
        },
        {
            title: 'Date',
            dataIndex: 'examDate',
            editable: true,
            render: (text) => {
                const date = dayjs.isDayjs(text) ? text : dayjs(text);
                return date.isValid() ? date.format('YYYY-MM-DD') : <a style={{ color: 'red' }}>UNSCHEDULED</a>;
            },
        },
        {
            title: 'Location',
            dataIndex: 'location',
            editable: true,
            render: (text) => {
                if (text) return text;
                return <a style={{ color: 'red' }}>UNSCHEDULED</a>;
            },
        },
        {
            title: 'Type',
            dataIndex: 'examType',
        },
        {
            title: 'Duration Minutes',
            dataIndex: 'durationMinutes',
            editable: true,
            render: (text) => {
                if (text) return text;
                return <a style={{ color: 'red' }}>UNSCHEDULED</a>;
            },
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.key)} style={{ marginInlineEnd: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <span>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        <Popconfirm title="Are you sure to delete?" onConfirm={() => deleteExam(record.examId)}>
                            <a style={{ color: 'red', marginLeft: 8 }}>Delete</a>
                        </Popconfirm>
                    </span>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                onChange: handleChange,
            }),
        };
    });

    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: { cell: EditableCell },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{ onChange: cancel }}
            />
        </Form>
    );
};

export default EditExam;

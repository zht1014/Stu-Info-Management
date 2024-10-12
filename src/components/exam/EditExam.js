import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Popconfirm, Table, Typography } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

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
        case 'exam_date':
            inputNode = (
                <DatePicker
                    defaultValue={record.exam_date } 
                    style={{ width: '100%' }}
                    onChange={(date) => {
                        onChange(dataIndex, date);
                    }}
                />
            );
            break;
        case 'duration_minutes':
            inputNode = (
                <Input
                    type="number"
                    defaultValue={record.duration_minutes}
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/exam/list');
                
                const dataWithKeys = response.data.list.map((item, index) => ({
                    ...item,
                    key: item.id || index,
                    exam_date: item.exam_date ? dayjs(item.exam_date) : null,
                }));
                console.log(dataWithKeys)
                setData(dataWithKeys);
            } catch (error) {
                console.log(error);
            }
        };
    
        fetchData();
    }, []);
    

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            course_name: record.course_name,
            course_id: record.course_id,
            exam_date: record.exam_date,
            location: record.location,
            type: record.type,
            duration_minutes: record.duration_minutes,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();

            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
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
            dataIndex: 'course_name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Id',
            dataIndex: 'course_id',
        },
        {
            title: 'Date',
            dataIndex: 'exam_date',
            editable: true,
            render: (text) => {
                if (text) return text.format('YYYY-MM-DD');
                return <a style={{ color: 'red' }}>UNSCHEDULED</a>;
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
            dataIndex: 'type',
        },
        {
            title: 'Duration Minutes',
            dataIndex: 'duration_minutes',
            editable: true,
            render: (text) => {
                if (text) return text;
                return <a style={{ color: 'red' }}>UNSCHEDULED</a>;
            },
        },
        {
            title: 'operation',
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
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
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
        }
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

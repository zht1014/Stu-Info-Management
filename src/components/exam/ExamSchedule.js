import "@/mockjs/index";
import { Form, Switch } from "antd";
import { useState } from "react";

/* 编辑考试，可以修改考试地点，时间，时长，可以根据status进行筛选，不允许添加删除，只允许编辑 */

const ExamSchedule = () => {
    const [examList, setExamList] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/exam/list");
                console.log(response.data);
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
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            render: (text) => {
                if (text) return text
                else return <a style={{ color: 'red' }}>UNSCHEDULED</a>    /* 放一个dropdownList */
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
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a /* onClick={(record)=>{}} */>Invite {record.name}</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Form layout="inline" className="table-demo-control-bar" style={{ marginBottom: 16 }}>
                <Form.Item label="Date">
                    <Switch  onChange={(checked)=>{if(checked){
                        /* 目前逻辑可以是，一个变为true时将其他的全部变为false */
                    }}}/>
                </Form.Item>
                <Form.Item label="Location">
                    <Switch  onChange={(checked)=>{}}/>
                </Form.Item>
                <Form.Item label="Duration">
                    <Switch  onChange={(checked)=>{}}/>
                </Form.Item>
            </Form>

        </div>
    );
}

export default ExamSchedule;
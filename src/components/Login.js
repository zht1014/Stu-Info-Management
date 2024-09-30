import React from 'react';
import axios from 'axios';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        navigate('/home');
        
    };

    return (
        <div className="login-form-wrapper">
            <Form
                form={form}
                name="login_form"
                className="login-form"
                onFinish={handleLogin}
            >
                <Form.Item
                    name="adminId"
                    rules={[{ required: true, message: 'Please enter your admin ID!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Admin ID" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password!' }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
// src/Login.js
import React, { useContext, createContext, useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const Login = () => {
    const { setRole, setJwt, setUserId } = useContext(AuthContext);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        try {
            const response = await axios.post('http://localhost:8080/login', {
                username: values.adminId, // 用于用户名的字段
                password: values.password,
            });

            if (response.data.success) {

                const token = response.data.data.token;
                console.log(response.data.data)

                setJwt(token)
                //const uerRole = response.data.data.role
                // const userRole = 'teacher';
                setRole(response.data.data.role);

                setUserId(response.data.data.userId)
                console.log(response.data.data.userId)

                message.success('Login successful!');
                navigate('/home'); // 跳转到主页或其他页面
            } else {
                message.error('Login failed. Please check your credentials.');
            }
        } catch (error) {
            message.error('Login failed. Please try again later.');
        }




        /* const userRole = 'staff'
        setRole(userRole) */
        //navigate('/home');
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

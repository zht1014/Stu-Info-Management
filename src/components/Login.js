// src/Login.js
import React, { useContext, createContext, useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const Login = () => {
    const { setRole, setJwt } = useContext(AuthContext);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        try {
            const response = await axios.post('http://localhost:8080/login', {
                username: values.adminId, // 用于用户名的字段
                password: values.password,
            });

            if (response.data.success) {
                // 获取 JWT token
                const token = response.data.data;
                
                // 将 token 存储到 localStorage
                //localStorage.setItem('jwtToken', token);
                setJwt(token)
                // 可选：如果需要角色信息，可以解析 JWT 获取角色信息
                // 这里假设 setRole 是设置角色的函数
                const userRole = 'staff';
                setRole(userRole);

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

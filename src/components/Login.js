import React, { useContext, createContext, useState } from 'react';
import axios from 'axios';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const Login = () => {
    const { setRole } = useContext(AuthContext);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        /* 这里后期加入判断用户角色的逻辑，如果判断出用户不属于任何角色，即为登录失败 */
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
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Admin ID" onChange={(e)=>{/* 这里set的也应该不是输入的名字，而是登录后返回的userRole */setRole(e.target.value)}}/>
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
// src/components/UserManagement.js

import React, { useEffect, useState, useContext } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import axios from 'axios';
import { AuthContext } from "../../AuthContext";

const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const { jwt, userId } = useContext(AuthContext)

  const apiUrl = 'http://128.199.224.162:8080/api/user';

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(apiUrl,{headers: {
        authToken: jwt,
    }});
      setUsers(data.data);
    } catch (error) {
      message.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add or edit user
  const handleSaveUser = async (values) => {
    const requestBody = {
      ...values,
      createDatetime: currentUser ? currentUser.createDatetime : new Date().toISOString(),
      updateDatetime: new Date().toISOString(),
      createUser: currentUser ? currentUser.createUser : 'system',
      updateUser: 'system',
    };
    console.log(requestBody)

    try {
      if (currentUser) {
        // Update user
        await axios.put(`${apiUrl}/${currentUser.userId}`, requestBody,{headers: {
            authToken: jwt,
        }});
        message.success('User updated successfully.');
      } else {
        // Create new user
        await axios.post(apiUrl, requestBody,{headers: {
            authToken: jwt,
        }});
        message.success('User created successfully.');
      }
      fetchUsers();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save user.');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${apiUrl}/${userId}`,{headers: {
        authToken: jwt,
    }});
      message.success('User deleted successfully.');
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user.');
    }
  };

  // Show modal for adding or editing
  const showModal = (user = null) => {
    setCurrentUser(user);
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDeleteUser(record.userId)}>
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>
        Add User
      </Button>
      <Table columns={columns} dataSource={users} rowKey="userId" loading={loading} />

      <Modal
        title={currentUser ? 'Edit User' : 'Add User'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSaveUser} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter a username' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter a password' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please select a role' }]}>
            <Select placeholder="Select a role">
              <Option value="STUDENT">STUDENT</Option>
              <Option value="TEACHER">TEACHER</Option>
              <Option value="ADMIN">ADMIN</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;

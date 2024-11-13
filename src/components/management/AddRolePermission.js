import React, { useEffect, useState, useContext } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';

const { Option } = Select;

const AddRolePermission = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { jwt } = useContext(AuthContext);

  const apiRoleUrl = 'http://159.203.52.224/api/role';
  const apiPermissionUrl = 'http://159.203.52.224/api/permissions';
  const apiUserRoleUrl = 'http://159.203.52.224/api/user-roles';

  const fetchRolesAndPermissions = async () => {
    setLoading(true);
    try {
      const [roleResponse, permissionResponse] = await Promise.all([
        axios.get(apiRoleUrl, { headers: { authToken: jwt } }),
        axios.get(apiPermissionUrl, { headers: { authToken: jwt } }),
      ]);
      setRoles(roleResponse.data.data);
      setPermissions(permissionResponse.data);
    } catch (error) {
      message.error('Failed to load roles and permissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const handleAddRole = async (values) => {
    const requestBody = {
      ...values,
      createUser: 'system',
      createDatetime: new Date().toISOString(),
      updateUser: 'system',
      updateDatetime: new Date().toISOString(),
    };

    try {
      await axios.post(apiRoleUrl, requestBody, { headers: { authToken: jwt } });
      message.success('Role added successfully.');
      fetchRolesAndPermissions();
      setIsRoleModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to add role.');
    }
  };

  const handleAddPermission = async (values) => {
    const requestBody = {
      ...values,
      createUser: 'system',
      createDatetime: new Date().toISOString(),
      updateUser: 'system',
      updateDatetime: new Date().toISOString(),
    };

    try {
      await axios.post(apiPermissionUrl, requestBody, { headers: { authToken: jwt } });
      message.success('Permission added successfully.');
      fetchRolesAndPermissions();
      setIsPermissionModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to add permission.');
    }
  };

  // Delete user role
  const handleDeleteUserRole = async (roleId) => {
    try {
      await axios.delete(apiUserRoleUrl, {
        params: { roleId },
        headers: { authToken: jwt },
      });
      message.success('User role deleted successfully.');
      fetchRolesAndPermissions();
    } catch (error) {
      message.error('Failed to delete user role.');
    }
  };

  // Delete permission
  const handleDeletePermission = async (id) => {
    try {
      await axios.delete(`${apiPermissionUrl}/${id}`, {
        headers: { authToken: jwt },
      });
      message.success('Permission deleted successfully.');
      fetchRolesAndPermissions();
    } catch (error) {
      message.error('Failed to delete permission.');
    }
  };

  const columnsRole = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Role Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this role?"
          onConfirm={() => handleDeleteUserRole(record.id)} 
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  const columnsPermission = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Endpoint', dataIndex: 'endpoint', key: 'endpoint' },
    { title: 'Method', dataIndex: 'method', key: 'method' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this permission?"
          onConfirm={() => handleDeletePermission(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsRoleModalVisible(true)} style={{ marginBottom: 16 }}>
        Add Role
      </Button>
      <Button type="primary" onClick={() => setIsPermissionModalVisible(true)} style={{ marginBottom: 16, marginLeft: 8 }}>
        Add Permission
      </Button>

      <Table columns={columnsRole} dataSource={roles} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      <Table columns={columnsPermission} dataSource={permissions} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />

      <Modal
        title="Add New Role"
        visible={isRoleModalVisible}
        onCancel={() => setIsRoleModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleAddRole} layout="vertical">
          <Form.Item name="name" label="Role Name" rules={[{ required: true, message: 'Please enter a role name' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add New Permission"
        visible={isPermissionModalVisible}
        onCancel={() => setIsPermissionModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleAddPermission} layout="vertical">
          <Form.Item name="endpoint" label="Endpoint" rules={[{ required: true, message: 'Please enter an endpoint' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="method" label="Method" rules={[{ required: true, message: 'Please enter a method' }]}>
            <Select placeholder="Select a method">
              <Option value="GET">GET</Option>
              <Option value="POST">POST</Option>
              <Option value="PUT">PUT</Option>
              <Option value="DELETE">DELETE</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddRolePermission;


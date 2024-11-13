import React, { useEffect, useState, useContext } from 'react';
import { Table, Button, Modal, Form, Select, message, Popconfirm } from 'antd';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';

const { Option } = Select;

const RolePermission = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { jwt } = useContext(AuthContext);

  const apiRoleUrl = 'http://159.203.52.224/api/role';
  const apiPermissionUrl = 'http://159.203.52.224/api/permissions';
  const apiRolePermissionUrl = 'http://159.203.52.224/api/role-permissions';

  const fetchRolesAndPermissions = async () => {
    try {
      const [roleResponse, permissionResponse] = await Promise.all([
        axios.get(apiRoleUrl, { headers: { authToken: jwt } }),
        axios.get(apiPermissionUrl, { headers: { authToken: jwt } }),
      ]);
      console.log(roleResponse)
      console.log(permissionResponse)
      setRoles(roleResponse.data.data);
      setPermissions(permissionResponse.data);
    } catch (error) {
      message.error('Failed to load roles or permissions.');
    }
  };

  const fetchRolePermissions = async (roleId) => {
    try {
      const response = await axios.get(`${apiRolePermissionUrl}/role/${roleId}`, { headers: { authToken: jwt } });
      console.log(response)
      setRolePermissions(response.data);
    } catch (error) {
      message.error('Failed to load role-permission relationships.');
    }
  };

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const handleAddRolePermission = async (values) => {
    try {
      await axios.post(apiRolePermissionUrl, null, {
        params: { roleId: selectedRole, permissionId: values.permissionId },
        headers: { authToken: jwt },
      });
      message.success('Permission added to role successfully.');
      fetchRolePermissions(selectedRole);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to add permission to role.');
    }
  };

  const handleRemoveRolePermission = async (permissionId) => {
    try {
      await axios.delete(apiRolePermissionUrl, {
        params: { roleId: selectedRole, permissionId },
        headers: { authToken: jwt },
      });
      message.success('Permission removed from role successfully.');
      fetchRolePermissions(selectedRole);
    } catch (error) {
      message.error('Failed to remove permission from role.');
    }
  };

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    fetchRolePermissions(roleId);
  };

  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'roleName',
      key: 'roleName',
      render: () => roles.find(role => role.id === selectedRole)?.name || 'N/A',
    },
    {
      title: 'Permission ID',
      dataIndex: 'permissionId',
      key: 'permissionId',
    },
    {
      title: 'Endpoint',
      dataIndex: 'endpoint',
      key: 'endpoint',
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Popconfirm
          title="Are you sure you want to remove this permission from the role?"
          onConfirm={() => handleRemoveRolePermission(record.permissionId)}
        >
          <Button type="link" danger>
            Remove
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const rolePermissionData = rolePermissions.map(rp => ({
    ...rp,
    roleName: roles.find(role => role.id === selectedRole)?.name || 'N/A',
    endpoint: permissions.find(permission => permission.id === rp.permissionId)?.endpoint || 'N/A',
    method: permissions.find(permission => permission.id === rp.permissionId)?.method || 'N/A',
  }));

  return (
    <div>
      <Select
        placeholder="Select a role"
        onChange={handleRoleChange}
        style={{ width: 200, marginBottom: 16 }}
      >
        {roles.map((role) => (
          <Option key={role.id} value={role.id}>
            {role.name}
          </Option>
        ))}
      </Select>
      <Button type="primary" onClick={() => setIsModalVisible(true)} disabled={!selectedRole} style={{ marginLeft: 8 }}>
        Add Permission to Role
      </Button>

      <Table
        columns={columns}
        dataSource={rolePermissionData}
        rowKey="permissionId"
        pagination={{ pageSize: 5 }}
        style={{ marginTop: 16 }}
      />

      <Modal
        title="Add Permission to Role"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleAddRolePermission} layout="vertical">
          <Form.Item name="permissionId" label="Permission" rules={[{ required: true, message: 'Please select a permission' }]}>
            <Select placeholder="Select a permission">
              {permissions.map((permission) => (
                <Option key={permission.id} value={permission.id}>
                  {permission.endpoint} ({permission.method})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RolePermission;

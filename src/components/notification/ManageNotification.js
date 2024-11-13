import React, { useEffect, useState, useContext } from "react";
import { Table, Typography, Button, Input, message, Modal, Space } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { AuthContext } from "../../AuthContext";

const ManageNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { jwt, userId } = useContext(AuthContext);

  // get notifications from API
  const fetchNotifications = async (page = 1, pageSize = 10) => {
    try {
      const response = await axios.get(
        "http://128.199.224.162:8080/api/notifications",
        {
          params: { page, pageSize },
          headers: {
            authToken: jwt,
          },
        }
      );
      const { data } = response;
      setNotifications(data.data);
      setPagination((prev) => ({
        ...prev,
        current: page,
        total: data.total,
      }));
    } catch (error) {
      console.log(error);
      message.error("Failed to get notifications, please try again later.");
    }
  };

  // get notifications when the component is mounted
  useEffect(() => {
    fetchNotifications(pagination.current, pagination.pageSize);
  }, []);

  // add notification
  const addNotification = async () => {
    const currentDatetime = dayjs().format("YYYY-MM-DDTHH:mm:ss");
    if (!newMessage) {
      message.error("Message cannot be empty");
      return;
    }
    try {
      await axios.post(
        "http://128.199.224.162:8080/api/notifications",
        {
          userId: userId,
          message: newMessage,
          isRead: 0,
          createDatetime: currentDatetime,
          updateDatetime: currentDatetime,
        },
        {
          headers: {
            authToken: jwt,
          },
        }
      );
      message.success("Notification added successfully!");
      setNewMessage("");
      fetchNotifications(pagination.current, pagination.pageSize); // 刷新通知列表
    } catch (error) {
      console.log(error);
      message.error("Failed to add notification, please try again later.");
    }
  };

  // delete notification
  const deleteNotification = (notificationId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this notification?",
      onOk: async () => {
        try {
          await axios.delete(
            `http://128.199.224.162:8080/api/notifications/${notificationId}`,
            {
              headers: { authToken: jwt },
            }
          );
          message.success("Notification deleted successfully!");
          fetchNotifications(pagination.current, pagination.pageSize); // 刷新通知列表
        } catch (error) {
          console.log(error);
          message.error(
            "Failed to delete notification, please try again later."
          );
        }
      },
    });
  };

  // update notification
  const editNotification = (notificationId, currentMessage) => {
    const currentDatetime = dayjs().format("YYYY-MM-DDTHH:mm:ss");
    const newMessage = prompt("Edit Notification", currentMessage);
    if (newMessage && newMessage !== currentMessage) {
      axios
        .put(
          `http://128.199.224.162:8080/api/notifications/${notificationId}`,
          {
            userId: userId,
            message: newMessage,
            isRead: 0,
            createDatetime: currentDatetime,
            updateDatetime: currentDatetime,
          },
          { headers: { authToken: jwt } }
        )
        .then(() => {
          message.success("Notification updated successfully!");
          fetchNotifications(pagination.current, pagination.pageSize); // 刷新通知列表
        })
        .catch((error) => {
          console.log(error);
          message.error(
            "Failed to update notification, please try again later."
          );
        });
    }
  };

  // 表格列配置
  const columns = [
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (text) => <Typography.Text>{text}</Typography.Text>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Button
            type="link"
            onClick={() =>
              editNotification(record.notificationId, record.message)
            }
          >
            Edit
          </Button>
          <Button
            type="link"
            onClick={() => deleteNotification(record.notificationId)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // 分页变化时的回调函数
  const handleTableChange = (pagination) => {
    fetchNotifications(pagination.current, pagination.pageSize); // 更新通知列表
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
      <Typography.Title level={3}>Add Notifications</Typography.Title>

      <Space style={{ marginBottom: "16px" }}>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter new notification message"
          style={{ width: "300px" }}
        />
        <Button type="primary" onClick={addNotification}>
          Add Notification
        </Button>
      </Space>

      <Typography.Title level={3}>Notification List</Typography.Title>
      <Table
        columns={columns}
        dataSource={notifications}
        rowKey="notificationId" // 以 notificationId 作为表格行的唯一标识
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }} // 启用分页功能
        onChange={handleTableChange} // 分页变化时的回调函数
      />
    </div>
  );
};

export default ManageNotification;

import React, { useEffect, useState, useContext } from 'react';
import { List, Typography, Button, message, Checkbox, Space, Modal } from 'antd';
import axios from 'axios';
import { AuthContext } from "../../AuthContext";

const MyNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [hoveredNotificationId, setHoveredNotificationId] = useState(null);
  const { role, jwt } = useContext(AuthContext);

  // 从API获取通知数据
  const fetchNotifications = async () => {
    try {
      const notification_url = 'http://localhost:8080/api/notifications';
      const response = await axios.get(notification_url, {
        headers: {
          authToken: jwt,
        },
      });
      const fetchedNotifications = response.data.data;

      // 加载本地缓存的已读通知ID
      const cachedReadNotifications = JSON.parse(localStorage.getItem('readNotifications')) || [];
      const cachedDeletedNotifications = JSON.parse(localStorage.getItem('deletedNotifications')) || [];

      // 将通知列表与本地已读缓存数据进行对比
      const notificationsWithStatus = fetchedNotifications.map(notification => ({
        ...notification,
        is_read: cachedReadNotifications.includes(notification.notificationId),
        is_deleted: cachedDeletedNotifications.includes(notification.notificationId),
      }));

      setNotifications(notificationsWithStatus);
      setReadNotifications(cachedReadNotifications);
    } catch (error) {
      message.error('Failed to get notifications, please try again later.');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // 将通知标记为已读
  const markAsRead = (notificationId) => {
    const updatedReadNotifications = [...readNotifications, notificationId];
    setReadNotifications(updatedReadNotifications);

    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.notificationId === notificationId
          ? { ...notification, is_read: true }
          : notification
      )
    );

    localStorage.setItem('readNotifications', JSON.stringify(updatedReadNotifications));
  };

  // 将通知标记为已删除
  const markAsDeleted = (notificationId) => {
    Modal.confirm({
      title: 'Are you sure you want to mark this notification as deleted?',
      content: 'You can always restore it later.',
      onOk: () => {
        const updatedNotifications = notifications.map(notification =>
          notification.notificationId === notificationId
            ? { ...notification, is_deleted: true }
            : notification
        );
        setNotifications(updatedNotifications);

        const updatedDeletedNotifications = [
          ...new Set([...JSON.parse(localStorage.getItem('deletedNotifications')) || [], notificationId]),
        ];
        localStorage.setItem('deletedNotifications', JSON.stringify(updatedDeletedNotifications));
      },
    });
  };

  // 批量标记已读
  const markSelectedAsRead = () => {
    const updatedReadNotifications = [...new Set([...readNotifications, ...selectedNotifications])];
    setReadNotifications(updatedReadNotifications);

    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        selectedNotifications.includes(notification.notificationId)
          ? { ...notification, is_read: true }
          : notification
      )
    );

    localStorage.setItem('readNotifications', JSON.stringify(updatedReadNotifications));
    setSelectedNotifications([]);
  };

  // 批量删除通知（标记为删除）
  const deleteSelectedNotifications = () => {
    Modal.confirm({
      title: 'Are you sure you want to mark selected notifications as deleted?',
      content: 'You can always restore them later.',
      onOk: () => {
        const updatedNotifications = notifications.map(notification =>
          selectedNotifications.includes(notification.notificationId)
            ? { ...notification, is_deleted: true }
            : notification
        );
        setNotifications(updatedNotifications);

        const updatedDeletedNotifications = [
          ...new Set([
            ...JSON.parse(localStorage.getItem('deletedNotifications')) || [],
            ...selectedNotifications,
          ]),
        ];
        localStorage.setItem('deletedNotifications', JSON.stringify(updatedDeletedNotifications));

        setSelectedNotifications([]);
      },
    });
  };

  // 全部标记已读
  const markAllAsRead = () => {
    const allNotificationIds = notifications.map(notification => notification.notificationId);
    setReadNotifications(allNotificationIds);

    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, is_read: true }))
    );

    localStorage.setItem('readNotifications', JSON.stringify(allNotificationIds));
  };

  // 全部删除（标记为删除）
  const deleteAllNotifications = () => {
    Modal.confirm({
      title: 'Are you sure you want to mark all notifications as deleted?',
      content: 'You can always restore them later.',
      onOk: () => {
        const updatedNotifications = notifications.map(notification => ({
          ...notification,
          is_deleted: true,
        }));
        setNotifications(updatedNotifications);

        const allNotificationIds = notifications.map(notification => notification.notificationId);
        localStorage.setItem('deletedNotifications', JSON.stringify(allNotificationIds));
      },
    });
  };

  // 处理通知选择
  const handleSelectNotification = (notificationId, checked) => {
    setSelectedNotifications(prev =>
      checked ? [...prev, notificationId] : prev.filter(id => id !== notificationId)
    );
  };

  // 处理鼠标悬浮事件
  const handleMouseEnter = (notificationId) => {
    setHoveredNotificationId(notificationId);
  };

  const handleMouseLeave = () => {
    setHoveredNotificationId(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto',marginTop: '20px' }}>
      <Typography.Title level={3}>My Notifications</Typography.Title>
      <Space style={{ marginBottom: '16px' }}>
        <Button onClick={markSelectedAsRead} disabled={!selectedNotifications.length}>Mark chosen as read</Button>
        <Button onClick={deleteSelectedNotifications} disabled={!selectedNotifications.length}>Delete chosen</Button>
        <Button onClick={markAllAsRead}>Mark all as read</Button>
        <Button onClick={deleteAllNotifications}>Delete all</Button>
      </Space>
      <List
        itemLayout="horizontal"
        dataSource={notifications.filter(item => !item.is_deleted)} // 只显示未删除的通知
        renderItem={item => (
          <List.Item
            key={item.notificationId}
            style={{
              backgroundColor: item.is_read ? '#f5f5f5' : '#ffffff',
              padding: '16px',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '2px solid #f0f0f0',
              boxShadow: hoveredNotificationId === item.notificationId ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none', // 添加box-shadow效果
              transition: 'box-shadow 0.3s ease-in-out',
              minHeight: '80px',
              position: 'relative', // 设置相对定位以便控制按钮的位置
            }}
            onMouseEnter={() => handleMouseEnter(item.notificationId)} // 鼠标进入
            onMouseLeave={handleMouseLeave} // 鼠标离开
          >
            <Checkbox
              checked={selectedNotifications.includes(item.notificationId)}
              onChange={e => handleSelectNotification(item.notificationId, e.target.checked)}
              disabled={item.is_read || item.is_deleted} // 禁用已读和已删除通知的多选框
            />
            <Typography.Text style={{ flex: 1, marginLeft: '10px' }}>{item.message}</Typography.Text>
            <div style={{
              color: '#999',
              fontSize: '12px',
              minWidth: '120px',
              visibility: hoveredNotificationId === item.notificationId ? 'hidden' : 'visible', // 时间隐藏
            }}>
              {new Date(item.createDatetime).toLocaleString()}
            </div>
            {/* 操作按钮显示控制 */}
            <div style={{
              display: hoveredNotificationId === item.notificationId && !item.is_read && !item.is_deleted ? 'flex' : 'none', // 如果是已读或已删除，隐藏按钮
              gap: '8px',
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)', // 垂直居中
            }}>
              <Button type="link" onClick={() => markAsRead(item.notificationId)}>Mark as read</Button>
              <Button type="link" onClick={() => markAsDeleted(item.notificationId)}>Delete</Button>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default MyNotification;

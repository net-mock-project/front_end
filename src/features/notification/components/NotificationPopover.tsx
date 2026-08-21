import React, { useState } from 'react';
import {
  Badge,
  Button,
  Popover,
  List,
  Typography,
  Space,
  Empty,
  Spin,
  Modal,
  Tag,
  Popconfirm,
} from 'antd';
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  HeartFilled,
  UserOutlined,
  AlertFilled,
  CarryOutOutlined,
  InfoCircleFilled,
  ArrowRightOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from '../api/notificationApi';
import type { AppNotification } from '../../../types/Notification';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Text, Paragraph } = Typography;

export const NotificationPopover: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // 1. Query danh sách thông báo
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['my-notifications'],
    queryFn: getNotifications,
    refetchInterval: 15000,
  });

  // 2. Mutations
  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-notifications'] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-notifications'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-notifications'] }),
  });

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-notifications'] }),
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationVisuals = (item: AppNotification) => {
    const text = `${item.title} ${item.content || ''}`.toLowerCase();
    const typeStr = String(item.type).toLowerCase();

    if (typeStr.includes('donation') || text.includes('quyên góp') || text.includes('donation')) {
      return {
        icon: <HeartFilled style={{ color: '#E11D48' }} />,
        bgColor: '#FFE4E6',
        tag: 'Quyên góp',
        tagColor: 'magenta',
        defaultRoute: '/donation',
      };
    }
    if (typeStr.includes('volunteer') || text.includes('volunteer') || text.includes('tình nguyện') || text.includes('hồ sơ')) {
      return {
        icon: <UserOutlined style={{ color: '#2563EB' }} />,
        bgColor: '#DBEAFE',
        tag: 'Hồ sơ Volunteer',
        tagColor: 'blue',
        defaultRoute: '/volunteer-profile',
      };
    }
    if (text.includes('khu vực') || text.includes('cứu trợ mới') || text.includes('cảnh báo')) {
      return {
        icon: <AlertFilled style={{ color: '#EA580C' }} />,
        bgColor: '#FFEDD5',
        tag: 'Cứu trợ khu vực',
        tagColor: 'volcano',
        defaultRoute: '/map',
      };
    }
    if (typeStr.includes('task') || text.includes('nhiệm vụ') || text.includes('task')) {
      return {
        icon: <CarryOutOutlined style={{ color: '#16A34A' }} />,
        bgColor: '#DCFCE7',
        tag: 'Nhiệm vụ',
        tagColor: 'green',
        defaultRoute: '/my-tasks',
      };
    }
    if (text.includes('yêu cầu') || text.includes('báo cáo')) {
      return {
        icon: <InfoCircleFilled style={{ color: '#7C3AED' }} />,
        bgColor: '#EDE9FE',
        tag: 'Yêu cầu của tôi',
        tagColor: 'purple',
        defaultRoute: '/me/relief-requests',
      };
    }

    return {
      icon: <InfoCircleFilled style={{ color: '#4B5563' }} />,
      bgColor: '#F3F4F6',
      tag: 'Hệ thống',
      tagColor: 'default',
      defaultRoute: '/',
    };
  };

  const handleItemClick = (item: AppNotification) => {
    if (!item.isRead) {
      markReadMutation.mutate(item.id);
    }
    setSelectedNotification(item);
    setIsPopoverOpen(false);
    setIsModalOpen(true);
  };

  const handleNavigate = () => {
    if (!selectedNotification) return;
    const { defaultRoute } = getNotificationVisuals(selectedNotification);
    setIsModalOpen(false);
    navigate(selectedNotification.urlLink || defaultRoute);
  };

  const content = (
    <div style={{ width: 370, maxHeight: 460, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
      {/* Header Popover */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 10,
          borderBottom: '1px solid #f0f0f0',
          marginBottom: 8,
        }}
      >
        <Text strong style={{ fontSize: 14 }}>
          Thông báo {unreadCount > 0 && `(${unreadCount} chưa đọc)`}
        </Text>

        {notifications.length > 0 && (
          <Space size={4}>
            {unreadCount > 0 && (
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => markAllReadMutation.mutate()}
                loading={markAllReadMutation.isPending}
                style={{ fontSize: 12, padding: '0 4px' }}
              >
                Đọc tất cả
              </Button>
            )}

            <Popconfirm
              title="Xóa toàn bộ thông báo?"
              description="Hành động này không thể hoàn tác."
              onConfirm={() => deleteAllMutation.mutate()}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true, size: 'small' }}
              cancelButtonProps={{ size: 'small' }}
              placement="bottomRight"
            >
              <Button
                type="link"
                size="small"
                danger
                icon={<ClearOutlined />}
                loading={deleteAllMutation.isPending}
                style={{ fontSize: 12, padding: '0 4px' }}
              >
                Xóa tất cả
              </Button>
            </Popconfirm>
          </Space>
        )}
      </div>

      {/* Danh sách thông báo */}
      <div style={{ overflowY: 'auto', flex: 1, paddingRight: 4 }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <Spin size="small" />
          </div>
        ) : notifications.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span style={{ fontSize: 12, color: '#9CA3AF' }}>Không có thông báo nào</span>}
            style={{ margin: '20px 0' }}
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={(item: AppNotification) => {
              const { icon, bgColor } = getNotificationVisuals(item);
              return (
                <List.Item
                  style={{
                    padding: '10px 10px',
                    borderRadius: 12,
                    backgroundColor: item.isRead ? 'transparent' : '#F0FDF4',
                    marginBottom: 6,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: item.isRead ? '1px solid transparent' : '1px solid #DCFCE7',
                  }}
                  onClick={() => handleItemClick(item)}
                  actions={[
                    <Button
                      key="delete"
                      type="text"
                      size="small"
                      icon={<DeleteOutlined style={{ color: '#9CA3AF', fontSize: 12 }} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate(item.id);
                      }}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          backgroundColor: bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                          marginTop: 2,
                        }}
                      >
                        {icon}
                      </div>
                    }
                    title={
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: item.isRead ? 600 : 700,
                          color: '#111827',
                          lineHeight: 1.3,
                        }}
                      >
                        {item.title}
                      </div>
                    }
                    description={
                      <Space direction="vertical" size={2} style={{ width: '100%', marginTop: 2 }}>
                        <Text
                          ellipsis={{ tooltip: item.content }}
                          style={{ fontSize: 12, color: '#4B5563', maxWidth: 220, display: 'block' }}
                        >
                          {item.content}
                        </Text>
                        <Text style={{ fontSize: 11, color: '#9CA3AF' }}>
                          {dayjs(item.createdAt).fromNow()}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      <Popover
        content={content}
        trigger="click"
        placement="bottomRight"
        arrow={false}
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
      >
        <Badge count={unreadCount} overflowCount={99} size="small">
          <Button
            className="app-header__notification"
            shape="circle"
            icon={<BellOutlined />}
            aria-label="Thông báo"
          />
        </Badge>
      </Popover>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Chi tiết thông báo</span>
            {selectedNotification && (
              <Tag color={getNotificationVisuals(selectedNotification).tagColor} style={{ borderRadius: 999 }}>
                {getNotificationVisuals(selectedNotification).tag}
              </Tag>
            )}
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)} style={{ borderRadius: 8 }}>
            Đóng
          </Button>,
          <Button
            key="navigate"
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={handleNavigate}
            style={{
              backgroundColor: '#EF5757',
              borderColor: '#EF5757',
              borderRadius: 8,
            }}
          >
            Xem chi tiết
          </Button>,
        ]}
        width={500}
      >
        {selectedNotification && (
          <div style={{ paddingTop: 10, textAlign: 'left' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
              {selectedNotification.title}
            </div>

            <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>
              Thời gian: {dayjs(selectedNotification.createdAt).format('DD/MM/YYYY HH:mm:ss')} (
              {dayjs(selectedNotification.createdAt).fromNow()})
            </div>

            <div
              style={{
                backgroundColor: '#F9FAFB',
                border: '1px solid #F3F4F6',
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <Paragraph style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {selectedNotification.content}
              </Paragraph>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
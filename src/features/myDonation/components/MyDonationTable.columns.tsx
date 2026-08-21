import React from 'react';
import { Tag, Button, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MyDonationRecord } from '../../../types/donation';

const { Text } = Typography;

interface GetColumnsProps {
  onOpenDetail: (record: MyDonationRecord) => void;
}

export const getMyDonationColumns = ({ onOpenDetail }: GetColumnsProps): ColumnsType<MyDonationRecord> => [
  {
    title: 'Mã đơn',
    dataIndex: 'donationId', // Sửa từ 'code' thành 'donationId'
    key: 'donationId',
    render: (text) => <Text strong className="table-text-dark">{text}</Text>,
  },
  {
    title: 'Kho tiếp nhận',
    dataIndex: 'warehouseName', // Sửa thành chữ thường 'warehouseName'
    key: 'warehouseName',
    render: (text) => <Text className="table-text-dark">{text || 'N/A'}</Text>,
  },
  {
    title: 'Ngày ủng hộ',
    dataIndex: 'donationDate',
    key: 'donationDate',
    render: (text) => <Text className="table-text-dark">{text ? new Date(text).toLocaleDateString('vi-VN') : ''}</Text>,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      // Chuẩn hóa trạng thái về chữ hoa để so khớp chính xác
      const upperStatus = status?.toUpperCase();
      const statusConfig: Record<string, { className: string; label: string }> = {
        PENDING: { className: 'status-tag-pending', label: 'Chờ tiếp nhận' },
        COMPLETED: { className: 'status-tag-completed', label: 'Hoàn thành' },
        REJECTED: { className: 'status-tag-rejected', label: 'Từ chối' },
        CANCELLED: { className: 'status-tag-cancelled', label: 'Đã hủy' },
      };

      const current = statusConfig[upperStatus] || { className: 'status-tag-default', label: status || 'Không xác định' };

      return (
        <Tag className={`status-tag ${current.className}`}>
          <span className="status-dot" />
          {current.label}
        </Tag>
      );
    },
  },
  {
    title: '',
    key: 'action',
    align: 'center',
    render: (_, record) => (
      <Button onClick={() => onOpenDetail(record)} className="detail-btn">
        Chi tiết
      </Button>
    ),
  },
];
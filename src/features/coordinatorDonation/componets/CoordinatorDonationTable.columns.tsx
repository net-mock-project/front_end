import React from 'react';
import { Tag, Button, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MyDonationRecord } from '../../../types/donation';

const { Text } = Typography;

interface GetCoordinatorColumnsProps {
  onOpenDetail: (record: MyDonationRecord) => void;
}

export const getCoordinatorDonationColumns = ({ onOpenDetail }: GetCoordinatorColumnsProps): ColumnsType<MyDonationRecord> => [
  {
    title: 'Mã đơn',
    dataIndex: 'donationId',
    key: 'donationId',
    render: (text) => <Text strong className="table-text-dark">{text}</Text>,
  },
  {
    title: 'Người ủng hộ',
    dataIndex: 'donatorName',
    key: 'donatorName',
    render: (text, record) => (
      <div>
        <Text strong className="table-text-dark">{text || 'Ẩn danh'}</Text>
        <div style={{ fontSize: 12, color: '#667085' }}>{record.donatorPhone}</div>
      </div>
    ),
  },
  {
    title: 'Kho tiếp nhận',
    dataIndex: 'warehouseName',
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
        Xem xét duyệt
      </Button>
    ),
  },
];
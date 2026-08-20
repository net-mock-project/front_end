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
    dataIndex: 'code',
    key: 'code',
    render: (text) => <Text strong className="table-text-dark">{text}</Text>,
  },
  {
    title: 'Kho tiếp nhận',
    dataIndex: 'WarehouseName',
    key: 'WarehouseName',
    render: (text) => <Text className="table-text-dark">{text || 'N/A'}</Text>,
  },
  {
    title: 'Ngày ủng hộ',
    dataIndex: 'donationDate',
    key: 'donationDate',
    render: (text) => <Text className="table-text-dark">{text}</Text>,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: MyDonationRecord['status']) => {
      const statusConfig: Record<string, { className: string; label: string }> = {
        PENDING: { className: 'status-tag-pending', label: 'Chờ tiếp nhận' },
        COMPLETED: { className: 'status-tag-completed', label: 'Hoàn thành' },
        REJECTED: { className: 'status-tag-rejected', label: 'Từ chối' },
        CANCELLED: { className: 'status-tag-cancelled', label: 'Đã hủy' },
      };

      const current = statusConfig[status] || { className: 'status-tag-default', label: 'Không xác định' };

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
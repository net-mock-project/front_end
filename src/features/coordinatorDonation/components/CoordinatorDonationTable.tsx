import React, { useState } from 'react';
import { Table, Button, Typography, Modal, Descriptions, message, Space } from 'antd';
import dayjs from 'dayjs';
import { useMutation } from '@tanstack/react-query';
import type { MyDonationRecord } from '../../../types/donation';
import { acceptCoordinatorDonation, rejectCoordinatorDonation } from '../api/coordinatorDonationApi';
import { getCoordinatorDonationColumns } from './CoordinatorDonationTable.columns';
import './CoordinatorDonationTable.css'; 

const { Title } = Typography;

interface Props {
  data: MyDonationRecord[];
  loading: boolean;
  onRefresh?: () => void;
}

export default function CoordinatorDonationTable({ data, loading, onRefresh }: Props) {
  const dataSource = Array.isArray(data) ? data : [];
  
  const [modalState, setModalState] = useState<{
    visible: boolean;
    record: MyDonationRecord | null;
  }>({ visible: false, record: null });

  const acceptMutation = useMutation({
    mutationFn: acceptCoordinatorDonation,
    onSuccess: () => {
      message.success('Đã chấp nhận đơn quyên góp thành công!');
      setModalState({ visible: false, record: null });
      onRefresh?.();
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Có lỗi xảy ra khi chấp nhận đơn!');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectCoordinatorDonation,
    onSuccess: () => {
      message.success('Đã từ chối đơn quyên góp.');
      setModalState({ visible: false, record: null });
      onRefresh?.();
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Có lỗi xảy ra khi từ chối đơn!');
    },
  });

  const handleOpenDetail = (record: MyDonationRecord) => {
    setModalState({ visible: true, record });
  };

  const handleAccept = (donationId: string | number) => {
    acceptMutation.mutate(donationId);
  };

  const handleReject = (donationId: string | number) => {
    Modal.confirm({
      title: 'Xác nhận từ chối đơn',
      content: 'Bạn có chắc chắn muốn từ chối đơn quyên góp này không?',
      okText: 'Xác nhận từ chối',
      okType: 'danger',
      cancelText: 'Đóng',
      onOk: () => rejectMutation.mutate(donationId),
    });
  };

  const columns = getCoordinatorDonationColumns({ onOpenDetail: handleOpenDetail });
  const { visible, record } = modalState;
  const isPending = record?.status?.toUpperCase() === 'PENDING';

  return (
    <div className="donation-table-wrapper">
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="donationId"
        loading={loading}
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
        scroll={{ x: 800 }} 
        className="ant-table-custom"
      />

      <Modal
        title={
          <div className="modal-header">
            <Title level={4} style={{ margin: 0 }}>
              Phê duyệt đơn ủng hộ
            </Title>
            
            {isPending && (
              <Space size="small">
                <Button 
                  danger 
                  onClick={() => handleReject(record!.donationId)} 
                  loading={rejectMutation.isPending} 
                  className="modal-action-btn"
                >
                  Từ chối
                </Button>
                <Button 
                  type="primary" 
                  style={{ background: '#176B34' }}
                  onClick={() => handleAccept(record!.donationId)} 
                  loading={acceptMutation.isPending} 
                  className="modal-action-btn"
                >
                  Chấp nhận
                </Button>
              </Space>
            )}
          </div>
        }
        open={visible}
        onCancel={() => setModalState({ visible: false, record: null })}
        footer={[
          <Button key="close" type="default" onClick={() => setModalState({ visible: false, record: null })} className="modal-footer-btn">
            Đóng
          </Button>
        ]}
        width={600}
      >
        {record && (
          <Descriptions bordered column={1} size="middle" className="modal-descriptions">
            <Descriptions.Item label="Mã đơn">{record.donationId}</Descriptions.Item>
            <Descriptions.Item label="Kho tiếp nhận">{record.warehouseName}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{record.status}</Descriptions.Item>
            <Descriptions.Item label="Người ủng hộ">{record.donatorName}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{record.donatorPhone}</Descriptions.Item>
            
            <Descriptions.Item label="Ngày ủng hộ">
              {record.donationDate ? dayjs(record.donationDate).format('YYYY-MM-DD HH:mm') : ''}
            </Descriptions.Item>

            <Descriptions.Item label="Danh sách vật tư">
              {Array.isArray(record.items) && record.items.length > 0 ? (
                record.items.map((item, index) => (
                  <div key={index}>
                    - {item.supplyName}: {item.quantity} {item.unit}
                  </div>
                ))
              ) : (
                <div>Không có vật tư</div>
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
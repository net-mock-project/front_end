import React, { useState } from 'react';
import { Table, Button, Typography, Modal, Descriptions, Input, DatePicker, message, Space } from 'antd';
import dayjs from 'dayjs';
import { useMutation } from '@tanstack/react-query';
import type { MyDonationRecord } from '../../../types/donation';
import { updateMyDonation, cancelMyDonation } from '../api/myDonationApi';
import { getMyDonationColumns } from './MyDonationTable.columns';

import './MyDonationTable.css'; 

const { Title } = Typography;

interface Props {
  data: MyDonationRecord[];
  loading: boolean;
  onRefresh?: () => void;
}

export default function MyDonationTable({ data, loading, onRefresh }: Props) {
  const dataSource = Array.isArray(data) ? data : [];
  
  const [modalState, setModalState] = useState<{
    visible: boolean;
    record: MyDonationRecord | null;
    isEditing: boolean;
  }>({ visible: false, record: null, isEditing: false });

  const [editForm, setEditForm] = useState({ items: '', donationDate: '' });

  const updateMutation = useMutation({
    mutationFn: updateMyDonation,
    onSuccess: () => {
      message.success('Cập nhật đơn quyên góp thành công!');
      setModalState(prev => ({ ...prev, isEditing: false, visible: false }));
      onRefresh?.();
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Có lỗi khi cập nhật đơn!');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelMyDonation,
    onSuccess: () => {
      message.success('Đã hủy đơn quyên góp thành công.');
      setModalState({ visible: false, record: null, isEditing: false });
      onRefresh?.();
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Có lỗi khi hủy đơn!');
    },
  });

  const handleOpenDetail = (record: MyDonationRecord) => {
    setModalState({ visible: true, record, isEditing: false });
    setEditForm({ 
      items: typeof record.items === 'string' ? record.items : JSON.stringify(record.items || ''), 
      donationDate: record.donationDate || '' 
    });
  };

  const handleSaveEdit = () => {
    if (!modalState.record?.donationId) {
      return message.error('Không tìm thấy định danh đơn quyên góp!');
    }
    const donationId = modalState.record.donationId;
    
    updateMutation.mutate({ 
      donationId, 
      data: editForm as any 
    });
  };

  const handleCancelDonation = () => {
    if (!modalState.record?.donationId) return;
    const donationId = modalState.record.donationId;
    
    Modal.confirm({
      title: 'Xác nhận hủy đơn',
      content: 'Bạn có chắc chắn muốn hủy đơn quyên góp này không? Thao tác này không thể hoàn tác.',
      okText: 'Xác nhận hủy',
      okType: 'danger',
      cancelText: 'Đóng',
      onOk: () => cancelMutation.mutate(donationId),
    });
  };

  const columns = getMyDonationColumns({ onOpenDetail: handleOpenDetail });
  const { visible, record, isEditing } = modalState;

  return (
    <div className="donation-table-wrapper">
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={(row) => row.donationId }
        loading={loading}
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
        scroll={{ x: 800 }} 
        className="ant-table-custom"
      />

      <Modal
        title={
          <div className="modal-header">
            <Title level={4} style={{ margin: 0 }}>
              {isEditing ? 'Chỉnh sửa đơn ủng hộ' : 'Chi tiết đơn ủng hộ'}
            </Title>
            
            {record?.status?.toUpperCase() === 'PENDING' && !isEditing && (
              <Space size="small">
                <Button danger onClick={handleCancelDonation} loading={cancelMutation.isPending} className="modal-action-btn">
                  Hủy đơn
                </Button>
                <Button type="dashed" onClick={() => setModalState(prev => ({ ...prev, isEditing: true }))} className="modal-action-btn">
                  Chỉnh sửa thông tin
                </Button>
              </Space>
            )}
          </div>
        }
        open={visible}
        onCancel={() => setModalState({ visible: false, record: null, isEditing: false })}
        footer={
          isEditing ? [
            <Button key="cancel" onClick={() => setModalState(prev => ({ ...prev, isEditing: false }))} className="modal-footer-btn">Quay lại</Button>,
            <Button key="save" type="primary" onClick={handleSaveEdit} loading={updateMutation.isPending} className="modal-save-btn">Lưu thay đổi</Button>
          ] : [
            <Button key="close" type="primary" onClick={() => setModalState({ visible: false, record: null, isEditing: false })} className="modal-footer-btn">Đóng</Button>
          ]
        }
        width={600}
      >
        {record && (
          <Descriptions bordered column={1} size="middle" className="modal-descriptions">
            <Descriptions.Item label="Mã đơn">{record.donationId }</Descriptions.Item>
            <Descriptions.Item label="Kho tiếp nhận">{record.warehouseName }</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{record.status}</Descriptions.Item>
            <Descriptions.Item label="Người ủng hộ">{record.donatorName}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{record.donatorPhone}</Descriptions.Item>
            
            <Descriptions.Item label="Ngày ủng hộ">
              {isEditing ? (
                <DatePicker 
                  value={editForm.donationDate ? dayjs(editForm.donationDate) : null}
                  onChange={(_, dateString) => {
                    const val = Array.isArray(dateString) ? dateString[0] : (dateString || '');
                    setEditForm({ ...editForm, donationDate: val });
                  }}
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                />
              ) : (
                record.donationDate ? dayjs(record.donationDate).format('YYYY-MM-DD HH:mm') : ''
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Danh sách vật tư">
              {isEditing ? (
                <Input.TextArea 
                  rows={4}
                  value={editForm.items} 
                  onChange={(e) => setEditForm({ ...editForm, items: e.target.value })} 
                />
              ) : (
                <div style={{ whiteSpace: 'pre-line' }}>
                  {typeof record.items === 'string' ? record.items : JSON.stringify(record.items)}
                </div>
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
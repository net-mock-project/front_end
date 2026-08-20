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
  
  // Gom state modal và form lại cho gọn
  const [modalState, setModalState] = useState<{
    visible: boolean;
    record: MyDonationRecord | null;
    isEditing: boolean;
  }>({ visible: false, record: null, isEditing: false });

  const [editForm, setEditForm] = useState({ items: '', donationDate: '' });

  // Mutations
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
    setEditForm({ items: record.items || '', donationDate: record.donationDate || '' });
  };

  const handleSaveEdit = () => {
    if (!modalState.record?.code) return message.error('Không tìm thấy định danh đơn quyên góp!');
    updateMutation.mutate({ donationId: modalState.record.code, data: editForm });
  };

  const handleCancelDonation = () => {
    if (!modalState.record?.code) return;
    
    Modal.confirm({
      title: 'Xác nhận hủy đơn',
      content: 'Bạn có chắc chắn muốn hủy đơn quyên góp này không? Thao tác này không thể hoàn tác.',
      okText: 'Xác nhận hủy',
      okType: 'danger',
      cancelText: 'Đóng',
      onOk: () => cancelMutation.mutate(modalState.record!.code),
    });
  };

  const columns = getMyDonationColumns({ onOpenDetail: handleOpenDetail });
  const { visible, record, isEditing } = modalState;

  return (
    <div className="donation-table-wrapper">
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="code"
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
            
            {record?.status === 'PENDING' && !isEditing && (
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
            <Descriptions.Item label="Mã đơn">{record.code}</Descriptions.Item>
            <Descriptions.Item label="Kho tiếp nhận">{record.WarehouseName}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{record.status}</Descriptions.Item>
            <Descriptions.Item label="Người ủng hộ">{record.donatorName}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{record.donatorPhone}</Descriptions.Item>
            
            <Descriptions.Item label="Ngày ủng hộ">
              {isEditing ? (
                <DatePicker 
                  value={editForm.donationDate ? dayjs(editForm.donationDate) : null}
                  onChange={(_, dateString) => setModalState(prev => ({ ...prev }))} // update form state
                  // ... (giữ nguyên logic datepicker của bạn)
                  style={{ width: '100%' }}
                />
              ) : record.donationDate}
            </Descriptions.Item>

            <Descriptions.Item label="Danh sách vật tư">
              {isEditing ? (
                <Input.TextArea 
                  rows={4}
                  value={editForm.items} 
                  onChange={(e) => setEditForm({ ...editForm, items: e.target.value })} 
                />
              ) : <div className="text-pre-line">{record.items}</div>}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
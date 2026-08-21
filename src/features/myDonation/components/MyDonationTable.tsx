import React, { useState } from 'react';
import { Table, Button, Typography, Modal, Descriptions, Input, message, Space } from 'antd';
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

  // State chỉ để chỉnh sửa danh sách vật tư
  const [editItemsText, setEditItemsText] = useState('');

  const updateMutation = useMutation({
    mutationFn: updateMyDonation,
    onSuccess: () => {
      message.success('Cập nhật danh sách vật tư thành công!');
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
  };

  // Bắt đầu chỉnh sửa: Gán dữ liệu vật tư cũ vào state
  const handleStartEdit = () => {
    if (!modalState.record) return;
    const currentRecord = modalState.record;

    const itemsString = Array.isArray(currentRecord.items) 
      ? currentRecord.items.map(i => `${i.supplyName}, ${i.quantity}, ${i.unit}`).join('\n')
      : '';

    setEditItemsText(itemsString);
    setModalState(prev => ({ ...prev, isEditing: true }));
  };

  const handleSaveEdit = () => {
    if (!modalState.record?.donationId) return message.error('Không tìm thấy định danh đơn quyên góp!');

    const parsedItems = editItemsText
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        const parts = line.split(',').map(p => p.trim());
        return {
          supplyName: parts[0] || '',
          quantity: Number(parts[1]) || 1,
          unit: parts[2] || ''
        };
      });

    updateMutation.mutate({ 
      donationId: modalState.record.donationId, 
      data: { 
        // Giữ nguyên ngày cũ từ record gốc, chỉ cập nhật items mới
        donationDate: modalState.record.donationDate,
        items: parsedItems 
      } as any 
    });
  };

  const handleCancelDonation = () => {
    if (!modalState.record?.donationId) return;
    
    Modal.confirm({
      title: 'Xác nhận hủy đơn',
      content: 'Bạn có chắc chắn muốn hủy đơn quyên góp này không? Thao tác này không thể hoàn tác.',
      okText: 'Xác nhận hủy',
      okType: 'danger',
      cancelText: 'Đóng',
      onOk: () => cancelMutation.mutate(modalState.record!.donationId),
    });
  };

  const columns = getMyDonationColumns({ onOpenDetail: handleOpenDetail });
  const { visible, record, isEditing } = modalState;

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
              {isEditing ? 'Chỉnh sửa danh sách vật tư' : 'Chi tiết đơn ủng hộ'}
            </Title>
            
            {record?.status?.toUpperCase() === 'PENDING' && !isEditing && (
              <Space size="small">
                <Button danger onClick={handleCancelDonation} loading={cancelMutation.isPending} className="modal-action-btn">
                  Hủy đơn
                </Button>
                <Button type="dashed" onClick={handleStartEdit} className="modal-action-btn">
                  Chỉnh sửa vật tư
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
            <Descriptions.Item label="Mã đơn">{record.donationId}</Descriptions.Item>
            <Descriptions.Item label="Kho tiếp nhận">{record.warehouseName}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{record.status}</Descriptions.Item>
            <Descriptions.Item label="Người ủng hộ">{record.donatorName}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{record.donatorPhone}</Descriptions.Item>
            
            <Descriptions.Item label="Ngày ủng hộ">
              {record.donationDate ? dayjs(record.donationDate).format('YYYY-MM-DD HH:mm') : ''}
            </Descriptions.Item>

            <Descriptions.Item label="Danh sách vật tư">
              {isEditing ? (
                <div>
                  <Input.TextArea 
                    rows={4}
                    value={editItemsText} 
                    onChange={(e) => setEditItemsText(e.target.value)} 
                    placeholder="Tên vật tư, số lượng, đơn vị (mỗi dòng 1 vật tư)"
                  />
                  <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 4 }}>
                    Ví dụ: Gạo, 10, kg (phân tách nhau bằng dấu phẩy)
                  </div>
                </div>
              ) : (
                Array.isArray(record.items) ? (
                  record.items.map((item, index) => (
                    <div key={index}>
                      - {item.supplyName}: {item.quantity} {item.unit}
                    </div>
                  ))
                ) : (
                  <div>Không có vật tư</div>
                )
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
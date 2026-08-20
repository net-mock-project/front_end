import React, { useState } from 'react';
import { Table, Tag, Button, Typography, Modal, Descriptions, Input, DatePicker, message, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { MyDonationRecord } from '../../../types/donation';
import httpClient from '../../../api/httpClient';

const { Text, Title } = Typography;

interface Props {
  data: MyDonationRecord[];
  loading: boolean;
  onRefresh?: () => void;
}

export default function MyDonationTable({ data, loading, onRefresh }: Props) {
  const dataSource = Array.isArray(data) ? data : [];
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MyDonationRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editForm, setEditForm] = useState({
    items: '',
    donationDate: '',
  });

  const handleOpenDetail = (record: MyDonationRecord) => {
    setSelectedRecord(record);
    setEditForm({
      items: record.items || '',
      donationDate: record.donationDate || '',
    });
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const handleCloseDetail = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!selectedRecord) return;
    
    const donationId = selectedRecord.code;
    if (!donationId) {
      message.error('Không tìm thấy định danh đơn quyên góp!');
      return;
    }

    try {
      await httpClient.patch(`/api/me/donations/${donationId}`, {
        ...editForm,
      });

      message.success('Cập nhật đơn quyên góp thành công!');
      setIsEditing(false);
      setIsModalVisible(false);
      if (onRefresh) onRefresh();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Có lỗi khi cập nhật đơn!');
    }
  };

  // Hàm xử lý Hủy đơn quyên góp
  const handleCancelDonation = () => {
    if (!selectedRecord) return;
    const donationId = selectedRecord.code;

    Modal.confirm({
      title: 'Xác nhận hủy đơn',
      content: 'Bạn có chắc chắn muốn hủy đơn quyên góp này không? Thao tác này không thể hoàn tác.',
      okText: 'Xác nhận hủy',
      okType: 'danger',
      cancelText: 'Đóng',
      onOk: async () => {
        try {
          await httpClient.delete(`/api/me/donations/${donationId}`);
          message.success('Đã hủy đơn quyên góp thành công.');
          setIsModalVisible(false);
          setSelectedRecord(null);
          if (onRefresh) onRefresh();
        } catch (error: any) {
          message.error(error?.response?.data?.message || 'Có lỗi khi hủy đơn!');
        }
      },
    });
  };

  const columns: ColumnsType<MyDonationRecord> = [
    {
      title: 'Mã đơn',
      dataIndex: 'code',
      key: 'code',
      render: (text) => <Text strong style={{ color: '#172033' }}>{text}</Text>,
    },
    {
      title: 'Kho tiếp nhận',
      dataIndex: 'WarehouseName',
      key: 'WarehouseName',
      render: (text) => <Text style={{ color: '#172033' }}>{text || 'N/A'}</Text>,
    },
    {
      title: 'Ngày ủng hộ',
      dataIndex: 'donationDate',
      key: 'donationDate',
      render: (text) => <Text style={{ color: '#172033' }}>{text}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: MyDonationRecord['status']) => {
        let color = '';
        let bg = '';
        let label = '';
        let dotColor = '';

        switch (status) {
          case 'PENDING':
            color = '#9A6700'; bg = '#FFF7E8'; label = 'Chờ tiếp nhận'; dotColor = '#9A6700'; break;
          case 'COMPLETED':
            color = '#176B34'; bg = '#ECFDF3'; label = 'Hoàn thành'; dotColor = '#176B34'; break;
          case 'REJECTED':
            color = '#DF1C41'; bg = '#FDF2F2'; label = 'Từ chối'; dotColor = '#DF1C41'; break;
          case 'CANCELLED':
            color = '#667085'; bg = '#F2F4F7'; label = 'Đã hủy'; dotColor = '#667085'; break;
          default:
            color = '#667085'; bg = '#F2F4F7'; label = 'Không xác định'; dotColor = '#667085';
        }

        return (
          <Tag 
            style={{ 
              color, 
              background: bg, 
              border: 'none', 
              borderRadius: 999, 
              padding: '4px 12px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor }} />
            {label}
          </Tag>
        );
      },
    },
    {
      title: '',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button 
          onClick={() => handleOpenDetail(record)}
          style={{ borderRadius: 12, fontWeight: 700, color: '#344054' }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ 
      background: 'white', 
      borderRadius: 18, 
      padding: '4px',
      boxShadow: '0px 10px 28px rgba(31, 41, 55, 0.05)',
      border: '1px solid #E6EAF0'
    }}>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="code"
        loading={loading}
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
        scroll={{ x: 800 }} 
        style={{ borderRadius: 18, overflow: 'hidden' }}
      />

      {/* Modal hiển thị chi tiết và chỉnh sửa */}
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24 }}>
            <Title level={4} style={{ margin: 0 }}>
              {isEditing ? 'Chỉnh sửa đơn ủng hộ' : 'Chi tiết đơn ủng hộ'}
            </Title>
            
            {/* Nút Hủy đơn & Chỉnh sửa thông tin chỉ hiện khi đơn đang PENDING và không ở chế độ edit */}
            {selectedRecord?.status === 'PENDING' && !isEditing && (
              <Space size="small">
                <Button 
                  danger 
                  onClick={handleCancelDonation} 
                  style={{ borderRadius: 8, fontWeight: 600 }}
                >
                  Hủy đơn
                </Button>
                <Button 
                  type="dashed" 
                  onClick={() => setIsEditing(true)} 
                  style={{ borderRadius: 8, fontWeight: 600 }}
                >
                  Chỉnh sửa thông tin
                </Button>
              </Space>
            )}
          </div>
        }
        open={isModalVisible}
        onCancel={handleCloseDetail}
        footer={[
          isEditing ? (
            <React.Fragment key="edit-actions">
              <Button key="cancel" onClick={() => setIsEditing(false)} style={{ borderRadius: 8 }}>
                Quay lại
              </Button>
              <Button key="save" type="primary" onClick={handleSaveEdit} style={{ borderRadius: 8, background: '#E5484D' }}>
                Lưu thay đổi
              </Button>
            </React.Fragment>
          ) : (
            <Button key="close" type="primary" onClick={handleCloseDetail} style={{ borderRadius: 8 }}>
              Đóng
            </Button>
          )
        ]}
        width={600}
      >
        {selectedRecord && (
          <Descriptions bordered column={1} size="middle" style={{ marginTop: 16 }}>
            <Descriptions.Item label="Mã đơn">{selectedRecord.code}</Descriptions.Item>
            <Descriptions.Item label="Kho tiếp nhận">{selectedRecord.WarehouseName}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{selectedRecord.status}</Descriptions.Item>

            <Descriptions.Item label="Người ủng hộ">{selectedRecord.donatorName}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{selectedRecord.donatorPhone}</Descriptions.Item>
            
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
                selectedRecord.donationDate
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
                <div style={{ whiteSpace: 'pre-line' }}>{selectedRecord.items}</div>
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
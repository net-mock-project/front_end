import React from 'react';
import { Button, Card, InputNumber, Select, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import type { DonationItem } from '../../../types/donation';
import { getSupplies } from '../api/createDonationApi';

const { Title, Text } = Typography;

type Props = {
  items: DonationItem[];
  onChange: (items: DonationItem[]) => void;
};

export function DonationItemsCard({ items, onChange }: Props) {
  // Gọi API lấy danh sách tên vật tư động từ backend
  const { data: supplyNames = [], isLoading: isSupplyLoading } = useQuery({
    queryKey: ['supplies-name-list'],
    queryFn: getSupplies,
  });

  // Chuyển đổi mảng string từ API thành format option của Ant Design Select
  const supplyOptions = supplyNames.map((name) => ({
    value: name,
    label: name,
  }));

  const handleItemChange = (index: number, field: keyof DonationItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    const newItem: DonationItem = {
      supplyName: supplyNames[0] || '', 
      quantity: 1,
      unit: 'Thùng',
    };
    onChange([...items, newItem]);
  };

  return (
    <Card 
      bordered={false} 
      style={{ borderRadius: 18, boxShadow: '0px 10px 28px rgba(31, 41, 55, 0.05)' }}
    >
      <Title level={4} style={{ marginBottom: 4, color: '#172033' }}>
        1. Danh sách vật tư quyên góp
      </Title>
      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 20 }}>
        Chọn các loại vật phẩm, số lượng và đơn vị tương ứng.
      </Text>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {items.map((item, index) => (
          <div 
            key={index} 
            style={{ 
              display: 'flex', 
              gap: 12, 
              alignItems: 'center', 
              flexWrap: 'wrap' 
            }}
          >
            <Select
              placeholder="Chọn vật phẩm"
              size="large"
              value={item.supplyName}
              onChange={(val) => handleItemChange(index, 'supplyName', val)}
              style={{ flex: '2 1 200px' }}
              options={supplyOptions}
              loading={isSupplyLoading}
              notFoundContent={isSupplyLoading ? 'Đang tải...' : 'Không có vật tư nào'}
            />
            <InputNumber
              min={1}
              size="large"
              value={item.quantity}
              onChange={(val) => handleItemChange(index, 'quantity', val || 1)}
              style={{ flex: '1 1 90px', width: '100%' }}
            />
            <Select
              size="large"
              value={item.unit}
              onChange={(val) => handleItemChange(index, 'unit', val)}
              style={{ flex: '1 1 100px' }}
              options={[
                { value: 'Thùng', label: 'Thùng' },
                { value: 'Cái', label: 'Cái' },
                { value: 'Kg', label: 'Kg' },
                { value: 'Gói', label: 'Gói' },
              ]}
            />
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleRemove(index)}
              style={{ width: 42, height: 42, borderRadius: 12, border: '1px solid #E6EAF0', flexShrink: 0 }}
            />
          </div>
        ))}
      </div>

      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ borderRadius: 12, background: '#EEF4FF', color: '#2563EB', fontWeight: 600, height: 40 }}
      >
        Thêm vật tư
      </Button>
    </Card>
  );
}
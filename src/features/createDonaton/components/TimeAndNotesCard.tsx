import React from 'react';
import { Card, DatePicker, Typography } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

type Props = {
  donationDate: string;
  onChange: (field: string, value: string) => void;
};

export function TimeAndNotesCard({ donationDate, onChange }: Props) {
  return (
    <Card 
      bordered={false} 
      style={{ borderRadius: 18, boxShadow: '0px 10px 28px rgba(31, 41, 55, 0.05)' }}
    >
      <Title level={4} style={{ marginBottom: 4, color: '#172033' }}>
        2. Ngày giao hàng dự kiến
      </Title>
      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 20 }}>
        Chọn ngày bạn có thể giao vật tư đến trạm.
      </Text>

      <div>
        <Text strong style={{ display: 'block', marginBottom: 8, color: '#344054', fontSize: 13 }}>
          Ngày dự kiến giao
        </Text>
        <DatePicker 
          size="large"
          placeholder="Chọn ngày giao"
          value={donationDate ? dayjs(donationDate) : null}
          onChange={(date, dateString) => {
            const valueToSave = Array.isArray(dateString) ? dateString[0] : (dateString || '');
            onChange('donationDate', valueToSave);
          }}
          style={{ borderRadius: 12, width: '100%' }}
          format="YYYY-MM-DD"
        />
      </div>
    </Card>
  );
}
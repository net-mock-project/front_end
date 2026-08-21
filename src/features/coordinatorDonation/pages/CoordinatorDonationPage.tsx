import React from 'react';
import { Typography, Row, Col } from 'antd';
import { useQuery } from '@tanstack/react-query';

import { getCoordinatorDonations } from '../api/coordinatorDonationApi';
import CoordinatorDonationTable from '../components/CoordinatorDonationTable'; // Kiểm tra lại đường dẫn import này cho đúng

const { Title, Text } = Typography;

export function CoordinatorDonationPage() {
  const { data: donations = [], isLoading, refetch } = useQuery({
    queryKey: ['coordinator/donations'],
    queryFn: () => getCoordinatorDonations(),
  });

  return (
    <div style={{ background: '#F6F8FB', minHeight: 'calc(100vh - 68px)', padding: '24px 5%' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24, gap: 16 }}>
          <Col xs={24} md={16}>
            <Title level={2} style={{ margin: 0, color: '#172033', fontWeight: 700 }}>
              Phê duyệt đơn quyên góp
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Quản lý, tiếp nhận hoặc từ chối các đơn quyên góp gửi về kho của bạn.
            </Text>
          </Col>
        </Row>

        {/* Bảng dữ liệu Coordinator */}
        <CoordinatorDonationTable data={donations} loading={isLoading} onRefresh={refetch} />
        
      </div>
    </div>
  );
}

export default CoordinatorDonationPage;
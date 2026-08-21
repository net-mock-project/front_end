import React, { useState } from 'react';
import { Typography, Input, Space, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';

import { getCoordinatorDonations } from '../api/coordinatorDonationApi';
import CoordinatorDonationTable from '../components/CoordinatorDonationTable'; // Kiểm tra lại đường dẫn import này cho đúng

const { Title, Text } = Typography;

const STATUS_TABS = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PENDING', label: 'Chờ tiếp nhận' },
  { key: 'COMPLETED', label: 'Hoàn thành' },
  { key: 'REJECTED', label: 'Từ chối' },
  { key: 'CANCELLED', label: 'Đã hủy' },
];

export function CoordinatorDonationPage() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchText, setSearchText] = useState('');

  const { data: donations = [], isLoading, refetch } = useQuery({
    queryKey: ['coordinator/donations', activeTab, searchText],
    queryFn: () => getCoordinatorDonations({ 
      status: activeTab === 'ALL' ? undefined : activeTab, 
      search: searchText 
    }),
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

        {/* Filter & Search */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 20, gap: 16 }}>
          <Col xs={24} lg={14}>
            <Space size="small" style={{ flexWrap: 'wrap' }}>
              {STATUS_TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      background: isActive ? '#FFF1F1' : 'transparent',
                      color: isActive ? '#C9383E' : '#667085',
                      fontWeight: 800,
                      borderRadius: 10,
                      border: 'none',
                      padding: '8px 16px',
                      cursor: 'pointer',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </Space>
          </Col>

          <Col xs={24} lg={8}>
            <Input
              size="large"
              placeholder="Tìm theo mã đơn hoặc tên người ủng hộ..."
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ borderRadius: 11 }}
            />
          </Col>
        </Row>

        {/* Bảng dữ liệu Coordinator */}
        <CoordinatorDonationTable data={donations} loading={isLoading} onRefresh={refetch} />
        
      </div>
    </div>
  );
}

export default CoordinatorDonationPage;
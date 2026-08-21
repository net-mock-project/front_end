import React, { useState } from 'react';
import { Breadcrumb, Button, Typography, Input, Space, Row, Col } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getMyDonations } from '../api/myDonationApi';
import MyDonationTable from '../components/MyDonationTable';

const { Title, Text } = Typography;

const STATUS_TABS = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PENDING', label: 'Chờ tiếp nhận' },
  { key: 'COMPLETED', label: 'Hoàn thành' },
  { key: 'REJECTED', label: 'Từ chối' },
  { key: 'CANCELLED', label: 'Đã hủy' },
];

export function MyDonationPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchText, setSearchText] = useState('');

  // Fetch dữ liệu bằng React Query và lấy thêm hàm refetch
  const { data: donations = [], isLoading, refetch } = useQuery({
    queryKey: ['donation', activeTab, searchText],
    queryFn: () => getMyDonations({ 
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
            <Breadcrumb
              items={[
                { title: <Link to="/donation/create">Quyên góp cứu trợ</Link> },
                { title: 'Quyên góp của tôi' },
              ]}
              style={{ marginBottom: 8 }}
            />
            <Title level={2} style={{ margin: 0, color: '#172033', fontWeight: 700 }}>
              Quyên góp của tôi
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Quản lý danh sách vật tư, trạng thái tiếp nhận và lịch sử quyên góp.
            </Text>
          </Col>

          <Col xs={24} md={6} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate('/donation/create')}
              style={{
                background: 'linear-gradient(166deg, #E5484D 0%, #EF5F63 100%)',
                border: 'none',
                borderRadius: 12,
                fontWeight: 800,
                boxShadow: '0px 10px 22px rgba(229, 72, 77, 0.25)',
                width: '100%',
                maxWidth: 200,
              }}
            >
              Tạo quyên góp mới
            </Button>
          </Col>
        </Row>

        {/* Bảng dữ liệu - Truyền hàm onRefresh để cập nhật lại dữ liệu */}
        <MyDonationTable data={donations} loading={isLoading} onRefresh={refetch} />
        
      </div>
    </div>
  );
}

export default MyDonationPage;
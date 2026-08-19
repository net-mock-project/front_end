import React from 'react';
import { Link } from 'react-router-dom';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { Row, Col, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const STATS_DATA = [
  { value: '24/7', label: 'Tiếp nhận yêu cầu' },
  { value: '3 phút', label: 'Hoàn tất đăng ký' },
  { value: 'Miễn phí', label: 'Cho mọi người dùng' },
];

const MARKERS_DATA = [
  { left: '85%', top: '50%', bg: '#16A34A', val: '4' },
  { left: '70%', top: '80%', bg: '#F59E0B', val: '1' },
  { left: '60%', top: '55%', bg: '#DC2626', val: '7' },
  { left: '30%', top: '75%', bg: '#2563EB', val: '5' },
  { left: '15%', top: '65%', bg: '#F59E0B', val: '2' },
  { left: '80%', top: '20%', bg: '#DC2626', val: '3' },
  { left: '35%', top: '25%', bg: '#16A34A', val: '6' },
];

export const AuthBanner: React.FC = () => {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        padding: '48px',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        background: `
          radial-gradient(ellipse 126.44% 104.19% at 22.00% 18.00%, rgba(37, 99, 235, 0.12) 0%, rgba(37, 99, 235, 0) 19%),
          radial-gradient(ellipse 117.13% 96.51% at 78.00% 72.00%, rgba(22, 163, 74, 0.10) 0%, rgba(22, 163, 74, 0) 21%),
          #DFECE3
        `
      }}
    >
      {/* Lớp nền chứa các marker trang trí */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
        {MARKERS_DATA.map((marker, index) => (
          <div 
            key={index}
            style={{
              position: 'absolute',
              display: 'flex',
              height: '32px',
              width: '36px',
              transform: 'rotate(-45deg)',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '17px',
              borderTopLeftRadius: '17px',
              borderTopRightRadius: '17px',
              boxShadow: '0px 8px 20px rgba(31, 41, 55, 0.18)',
              outline: '2px solid white',
              left: marker.left,
              top: marker.top,
              backgroundColor: marker.bg,
            }}
          >
            <span style={{ transform: 'rotate(45deg)', fontSize: '10px', fontWeight: 900, color: '#ffffff' }}>
              {marker.val}
            </span>
          </div>
        ))}
      </div>

      {/* Logo & Brand */}
      <Link 
        to="/" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          width: 'fit-content', 
          textDecoration: 'none',
          zIndex: 2 
        }}
      >
        <div 
          style={{
            display: 'flex',
            height: '42px',
            width: '42px',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '14px',
            background: 'linear-gradient(to bottom right, #EF4444, #FB7185)',
            fontSize: '18px',
            color: '#ffffff',
            boxShadow: '0px 10px 22px rgba(229,72,77,0.28)'
          }}
        >
          <SafetyCertificateOutlined />
        </div>
        <div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 800, color: '#172033' }}>
            RescueHub
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, color: '#667085' }}>
            Cùng nhau tạo nên thay đổi
          </div>
        </div>
      </Link>

      {/* Center Content */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: 'auto 0', zIndex: 2, maxWidth: '512px' }}>
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '9999px',
            border: '1px solid rgba(220, 38, 38, 0.16)',
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            padding: '8px 16px',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            marginBottom: '16px',
            width: 'fit-content'
          }}
        >
          <span style={{ fontSize: '13px', color: '#C9383E' }}>●</span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 'bold', color: '#C9383E' }}>
            Tham gia cộng đồng RescueHub
          </span>
        </div>

        <Title 
          level={1} 
          style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontSize: '44px', 
            fontWeight: 'bold', 
            lineHeight: 1.2, 
            color: '#172033', 
            marginBottom: '16px',
            marginTop: 0
          }}
        >
          Một tài khoản, nhiều cách để giúp đỡ.
        </Title>

        <Paragraph 
          style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontSize: '16px', 
            color: '#475467', 
            lineHeight: 1.5, 
            marginBottom: '32px' 
          }}
        >
          Đăng ký để gửi yêu cầu cứu trợ, quyên góp vật tư hoặc trở thành tình nguyện viên khi cộng đồng cần bạn.
        </Paragraph>

        {/* Stats Cards */}
        <Row gutter={16}>
          {STATS_DATA.map((stat, index) => (
            <Col span={8} key={index}>
              <div 
                style={{
                  borderRadius: '18px',
                  border: '1px solid rgba(148, 163, 184, 0.22)',
                  backgroundColor: 'rgba(255, 255, 255, 0.88)',
                  padding: '16px',
                  boxShadow: '0px 10px 26px rgba(31, 41, 55, 0.06)',
                  backdropFilter: 'blur(4px)',
                  height: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 'bold', color: '#172033' }}>
                  {stat.value}
                </div>
                <div style={{ marginTop: '4px', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#667085' }}>
                  {stat.label}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <div style={{ zIndex: 2, height: '24px' }} />
    </div>
  );
};
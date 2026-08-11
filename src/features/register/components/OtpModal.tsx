import React from 'react';
import { Modal, Input, Button, Typography, Form } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface OtpModalProps {
  isOpen: boolean;
  email: string; // <--- Đổi từ phone thành email
  onVerify: (otpCode: string) => void;
  onClose: () => void;
  loading: boolean;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  email, // <--- Đổi từ phone thành email
  onVerify,
  onClose,
  loading
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: { otpCode: string }) => {
    onVerify(values.otpCode);
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={420}
      styles={{
        body: {
          overflow: 'hidden',
          borderRadius: '20px',
          padding: '24px'
        }
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          paddingBottom: '16px', 
          paddingTop: '8px', 
          textAlign: 'center' 
        }}
      >
        <div 
          style={{
            display: 'flex',
            height: '48px',
            width: '48px',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '9999px',
            backgroundColor: '#FEF2F2',
            color: '#C9383E',
            fontSize: '20px',
            marginBottom: '12px'
          }}
        >
          <LockOutlined />
        </div>
        
        <Title level={4} style={{ marginBottom: '4px', color: '#172033', marginTop: 0 }}>
          Xác thực mã OTP
        </Title>
        <Text type="secondary" style={{ fontSize: '13px' }}>
          Mã xác thực đã được gửi tới email{' '}
          <span style={{ fontWeight: 600, color: '#172033' }}>{email}</span>
        </Text>
      </div>

      <Form form={form} onFinish={handleFinish} layout="vertical">
        <Form.Item
          name="otpCode"
          label={<span style={{ fontSize: '13px', fontWeight: 'bold', color: '#344054' }}>Nhập mã OTP (6 số)</span>}
          rules={[
            { required: true, message: 'Vui lòng nhập mã OTP!' },
            { len: 6, message: 'Mã OTP phải có đúng 6 chữ số!' }
          ]}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Input.OTP 
            length={6} 
            formatter={(str) => str.toUpperCase()}
            style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}
          />
        </Form.Item>

        <Button 
          type="primary" 
          htmlType="submit"
          block
          size="large"
          loading={loading}
          style={{
            height: '44px',
            borderRadius: '12px',
            backgroundColor: '#E5484D',
            fontWeight: 'bold',
            boxShadow: '0px 10px 22px rgba(229,72,77,0.25)',
            border: 'none',
            marginTop: '8px'
          }}
        >
          Xác nhận
        </Button>
      </Form>
    </Modal>
  );
};
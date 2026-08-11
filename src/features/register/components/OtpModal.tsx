import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Typography, Form } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface OtpModalProps {
  isOpen: boolean;
  email: string;
  onVerify: (otpCode: string) => void;
  onResend: () => void; // Thêm hàm gọi API gửi lại
  onClose: () => void;
  loading: boolean;
  resendLoading?: boolean; // Trạng thái loading khi ấn gửi lại
}

export const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  email, 
  onVerify,
  onResend,
  onClose,
  loading,
  resendLoading = false
}) => {
  const [form] = Form.useForm();
  const [timeLeft, setTimeLeft] = useState<number>(60); // Đếm ngược 60 giây
  const [canResend, setCanResend] = useState<boolean>(false);

  // Kích hoạt bộ đếm ngược mỗi khi modal mở lên
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(60);
      setCanResend(false);
      form.resetFields(); // Reset ô nhập OTP mỗi khi mở lại modal

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, form]);

  // Xử lý khi bấm nút gửi lại mã
  const handleResendClick = () => {
    if (!canResend || resendLoading) return;
    onResend(); // Gọi hàm từ component cha

    // Reset lại đồng hồ 60 giây sau khi bấm gửi lại
    setTimeLeft(60);
    setCanResend(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

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

      {/* Phần hiển thị đếm ngược và nút Gửi lại mã */}
      <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px' }}>
        <Text type="secondary">Không nhận được mã? </Text>
        {canResend ? (
          <Button 
            type="link" 
            onClick={handleResendClick} 
            loading={resendLoading}
            style={{ padding: 0, fontWeight: 'bold', color: '#E5484D', height: 'auto' }}
          >
            Gửi lại mã
          </Button>
        ) : (
          <Text type="secondary" style={{ fontWeight: 500 }}>
            Gửi lại sau <span style={{ color: '#E5484D' }}>{timeLeft}s</span>
          </Text>
        )}
      </div>
    </Modal>
  );
};
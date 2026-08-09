import React from 'react';
import { Modal, Input, Button, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface OtpModalProps {
  isOpen: boolean;
  phone: string;
  otpCode: string;
  onChangeOtp: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  phone,
  otpCode,
  onChangeOtp,
  onSubmit,
  onClose
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={420}
      className="rounded-[20px] overflow-hidden"
    >
      <div className="text-center pt-2 pb-4">
        <div className="w-12 h-12 bg-red-50 text-[#C9383E] rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
          <LockOutlined />
        </div>
        
        <Title level={4} style={{ marginBottom: 4, color: '#172033' }}>
          Xác thực mã OTP
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Mã xác thực đã được gửi tới số điện thoại{' '}
          <span className="font-semibold text-[#172033]">{phone}</span>
        </Text>
      </div>

      <form onSubmit={onSubmit}>
        <div className="mb-6">
          <label className="block text-[#344054] text-[13px] font-bold mb-1.5">
            Nhập mã OTP (6 số)
          </label>
          
          <Input 
            size="large"
            maxLength={6}
            value={otpCode}
            onChange={onChangeOtp}
            placeholder="Ví dụ: 123456"
            autoFocus
            style={{
              textAlign: 'center',
              letterSpacing: '0.3em',
              fontWeight: 'bold',
              fontSize: '18px',
              borderRadius: '12px',
              height: '46px'
            }}
          />
        </div>

        <Button 
          type="primary" 
          htmlType="submit"
          block
          size="large"
          style={{
            height: '44px',
            borderRadius: '12px',
            backgroundColor: '#E5484D',
            fontWeight: 'bold',
            boxShadow: '0px 10px 22px rgba(229,72,77,0.25)'
          }}
        >
          Xác nhận
        </Button>
      </form>
    </Modal>
  );
};
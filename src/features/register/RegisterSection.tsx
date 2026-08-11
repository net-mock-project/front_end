import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { RegisterBanner } from './components/RegisterBanner';
import { RegisterForm } from './components/RegisterForm';
import { OtpModal } from './components/OtpModal';
import { sendOtpApi, registerApi } from '../../services/authService';
import type { RegisterPayload } from '../../services/authService';

export const RegisterSection: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingData, setPendingData] = useState<RegisterPayload | null>(null);

  // Gửi OTP khi form đăng ký hợp lệ (Chuyển sang dùng email)
  const handleRegisterSubmit = async (values: RegisterPayload & { agreed: boolean }) => {
    setLoading(true);
    try {
      await sendOtpApi(values.email);
      setPendingData(values);
      setShowOtpModal(true);
      message.success('Mã OTP đã được gửi thành công tới email của bạn!');
    } catch (err: any) {
      message.error(err.message || 'Không thể gửi mã OTP. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Xác thực OTP và hoàn tất đăng ký
  const handleVerifyOtp = async (otpCode: string) => {
    if (!pendingData) return;

    setLoading(true);
    try {
      const payload: RegisterPayload = {
        ...pendingData,
        otpCode
      };

      await registerApi(payload);

      message.success('Đăng ký tài khoản thành công!');
      setShowOtpModal(false);
      navigate('/login');
    } catch (err: any) {
      message.error(err.message || 'Mã OTP không chính xác hoặc đã hết hạn!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh', 
        width: '100vw', 
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        userSelect: 'none',
        boxSizing: 'border-box'
      }}
    >
      {/* Banner bên trái */}
      <div 
        style={{
          flex: 1,
          height: '100%',
          boxSizing: 'border-box',
          display: 'block'
        }}
      >
        <RegisterBanner />
      </div>

      {/* Form bên phải */}
      <div 
        style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}
      >
        <RegisterForm 
          onSubmit={handleRegisterSubmit}
          loading={loading}
        />
      </div>

      <OtpModal 
        isOpen={showOtpModal}
        email={pendingData?.email || ''} 
        onVerify={handleVerifyOtp}
        onClose={() => setShowOtpModal(false)}
        loading={loading}
      />
    </div>
  );
};
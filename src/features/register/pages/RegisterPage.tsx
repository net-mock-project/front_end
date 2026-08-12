import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { RegisterBanner } from '../components/RegisterBanner';
import { RegisterForm } from '../components/RegisterForm';
import { OtpModal } from '../components/OtpModal';
import { sendOtpApi, resendOtpApi, registerApi } from '../api/authApi';
import type { RegisterPayload } from '../../../types/register';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingData, setPendingData] = useState<RegisterPayload | null>(null);

  // Gửi OTP khi form đăng ký hợp lệ
  const handleRegisterSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Format lại dob từ Dayjs/Moment object thành chuỗi 'YYYY-MM-DD' để gửi lên Backend chính xác
      const formattedData: RegisterPayload = {
        ...values,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : '',
      };

      await sendOtpApi(formattedData);
      setPendingData(formattedData); // Lưu lại payload đã format chuẩn vào state chờ nhập OTP
      setShowOtpModal(true);
      message.success('Mã OTP đã được gửi thành công tới email của bạn!');
    } catch (err: any) {
      message.error(err.message || 'Không thể gửi mã OTP. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý gửi lại mã OTP
  const handleResendOtp = async () => {
    if (!pendingData?.email) return;

    setResendLoading(true);
    try {
      await resendOtpApi(pendingData.email);
      message.success('Mã OTP mới đã được gửi lại!');
    } catch (err: any) {
      message.error(err.message || 'Không thể gửi lại mã lúc này.');
    } finally {
      setResendLoading(false);
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
        onResend={handleResendOtp}
        onClose={() => setShowOtpModal(false)}
        loading={loading}
        resendLoading={resendLoading}
      />
    </div>
  );
};
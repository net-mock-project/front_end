import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { AuthBanner } from '../components/AuthBanner';
import { RegisterForm } from '../components/RegisterForm';
import { OtpModal } from '../components/OtpModal';
import { sendOtpApi, resendOtpApi, registerApi } from '../api/authApi';
import type { RegisterPayload } from '../../../types/register';
import './RegisterPage.css';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingData, setPendingData] = useState<RegisterPayload | null>(null);

  // 1. Mutation gửi yêu cầu nhận mã OTP
  const sendOtpMutation = useMutation({
    mutationFn: (formattedData: RegisterPayload) => sendOtpApi(formattedData)
    ,
    onSuccess: (_, formattedData) => {
      setPendingData(formattedData);
      setShowOtpModal(true);
      message.success('Mã OTP đã được gửi thành công tới email của bạn!');
    },

    onError: (err: any) => {
      const messageText = err?.response?.data?.message || err?.message || 'Không thể gửi mã OTP. Vui lòng thử lại sau.';
      message.error(messageText);
    },
  });

  // 2. Mutation gửi lại mã OTP
  const resendOtpMutation = useMutation({
    mutationFn: (email: string) => resendOtpApi(email)
    ,

    onSuccess: () => {
      message.success('Mã OTP mới đã được gửi lại!');
    },

    onError: (err: any) => {
      const messageText = err?.response?.data?.message || err?.message || 'Không thể gửi lại mã lúc này.';
      message.error(messageText);
    },
  });

  // 3. Mutation xác thực OTP và hoàn tất đăng ký tài khoản
  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload)
    ,

    onSuccess: () => {
      message.success('Đăng ký tài khoản thành công!');
      setShowOtpModal(false);
      navigate('/login');
    },

    onError: (err: any) => {
      const messageText = err?.response?.data?.message || err?.message || 'Mã OTP không chính xác hoặc đã hết hạn!';
      message.error(messageText);
    },
  });

  // Gửi OTP khi form đăng ký hợp lệ
  const handleRegisterSubmit = (values: any) => {
    const formattedData: RegisterPayload = {
      ...values,
      dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : '',
    };
    sendOtpMutation.mutate(formattedData);
  };

  // Hàm xử lý gửi lại mã OTP
  const handleResendOtp = () => {
    if (!pendingData?.email) return;
    resendOtpMutation.mutate(pendingData.email);
  };

  // Xác thực OTP và hoàn tất đăng ký
  const handleVerifyOtp = (otpCode: string) => {
    if (!pendingData) return;
    const payload: RegisterPayload = {
      ...pendingData,
      otpCode,
    };
    registerMutation.mutate(payload);
  };

  return (
    <div className="register-page">
      {/* Banner bên trái */}
      <div className="register-page-banner">
        <AuthBanner />
      </div>

      {/* Form bên phải */}
      <div className="register-page-content">
        <RegisterForm 
          onSubmit={handleRegisterSubmit}
          loading={sendOtpMutation.isPending}
        />
      </div>

      <OtpModal 
        isOpen={showOtpModal}
        email={pendingData?.email || ''} 
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onClose={() => {
          setShowOtpModal(false)
          setPendingData(null)
        }}
        loading={registerMutation.isPending}
        resendLoading={resendOtpMutation.isPending}
      />
    </div>
  );
};

export default RegisterPage;

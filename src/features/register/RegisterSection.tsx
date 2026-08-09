import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import { RegisterBanner } from './components/RegisterBanner';
import { RegisterForm } from './components/RegisterForm';
import { OtpModal } from './components/OtpModal';

export const RegisterSection: React.FC = () => {
  const routerNavigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    agreed: false
  });

  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const isFormComplete = 
    formData.fullName.trim() !== '' &&
    formData.dob.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.confirmPassword.trim() !== '' &&
    formData.address.trim() !== '' &&
    formData.agreed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreed) {
      message.warning('Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      message.error('Mật khẩu và Xác nhận mật khẩu không khớp!');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('/api/auth/send-otp', {
        phoneNumber: formData.phone
      });

      setLoading(false);
      setShowOtpModal(true);
      message.success('Mã OTP đã được gửi thành công tới số điện thoại của bạn!');
    } catch (err: any) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Không thể gửi mã OTP. Vui lòng thử lại sau.';
      message.error(errorMessage);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      message.warning('Vui lòng nhập mã OTP.');
      return;
    }

    try {
      const payload = {
        fullName: formData.fullName,
        dob: formData.dob,
        email: formData.email,
        phoneNumber: formData.phone,
        password: formData.password,
        address: formData.address,
        otpCode: otpCode
      };

      await axios.post('/api/auth/register', payload);

      message.success('Đăng ký tài khoản thành công!');
      setShowOtpModal(false);
      routerNavigate('/login');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Mã OTP không chính xác hoặc đã hết hạn!';
      message.error(errorMessage);
    }
  };

  return (
    <div className="w-[1440px] h-[900px] relative bg-white overflow-hidden flex select-none">
      {/* Cột Trái */}
      <RegisterBanner />

      {/* Cột Phải (Đã xóa bỏ onNavigate không cần thiết) */}
      <RegisterForm 
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isFormComplete={isFormComplete}
        loading={loading}
      />

      {/* Modal OTP */}
      <OtpModal 
        isOpen={showOtpModal}
        phone={formData.phone}
        otpCode={otpCode}
        onChangeOtp={(e) => setOtpCode(e.target.value)}
        onSubmit={handleVerifyOtp}
        onClose={() => setShowOtpModal(false)}
      />
    </div>
  );
};
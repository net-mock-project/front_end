import React, { useState } from 'react';
import { RegisterBanner } from './RegisterBanner';
import { RegisterForm } from './RegisterForm';
import { OtpModal } from './OtpModal';

interface RegisterSectionProps {
  onNavigate?: (page: 'login' | 'home' | 'register' | 'forgot') => void;
}

export const RegisterSection: React.FC<RegisterSectionProps> = ({ onNavigate }) => {
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
      alert('Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu và Xác nhận mật khẩu không khớp!');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: formData.phone })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Không thể gửi mã OTP.');
      }

      setLoading(false);
      setShowOtpModal(true);
    } catch (err: any) {
      setLoading(false);
      alert(err.message || 'Có lỗi xảy ra khi kết nối tới server.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      alert('Vui lòng nhập mã OTP.');
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

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Xác thực OTP hoặc đăng ký thất bại.');
      }

      alert('Đăng ký tài khoản thành công!');
      setShowOtpModal(false);
      onNavigate?.('login');
    } catch (err: any) {
      alert(err.message || 'Mã OTP không chính xác hoặc đã hết hạn!');
    }
  };

  return (
    <div className="w-[1440px] h-[900px] relative bg-white overflow-hidden flex select-none">
      {/* Cột Trái */}
      <RegisterBanner onNavigate={onNavigate} />

      {/* Cột Phải */}
      <RegisterForm 
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isFormComplete={isFormComplete}
        loading={loading}
        onNavigate={onNavigate}
      />

      {/* Modal OTP */}
      {showOtpModal && (
        <OtpModal 
          phone={formData.phone}
          otpCode={otpCode}
          onChangeOtp={(e) => setOtpCode(e.target.value)}
          onSubmit={handleVerifyOtp}
          onClose={() => setShowOtpModal(false)}
        />
      )}
    </div>
  );
};
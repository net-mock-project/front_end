import axios from 'axios';

export interface RegisterPayload {
  fullName: string;
  gender: 'male' | 'female' | 'other' | number; // Hỗ trợ cả chuỗi lẫn số
  dob: string; // Chuỗi ISO datetime gửi cho C# DateTime
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
  otpCode?: string;
}

// Hàm phụ trợ chuyển đổi dữ liệu trước khi gửi lên Backend C#
const formatPayload = (data: RegisterPayload) => {
  // Map giới tính từ string sang số nguyên khớp với C# Enum (Male = 1, Female = 2, Other = 3)
  let genderNumber = data.gender;
  if (typeof data.gender === 'string') {
    if (data.gender === 'male') genderNumber = 1;
    else if (data.gender === 'female') genderNumber = 2;
    else genderNumber = 3;
  }

  // Chuyển đổi chuỗi ngày sinh (ví dụ: "2005-05-05") sang định dạng DateTime chuẩn ISO (C# rất dễ nhận diện)
  let formattedDob = data.dob;
  if (data.dob && !data.dob.includes('T')) {
    formattedDob = new Date(data.dob).toISOString(); 
  }

  return {
    ...data,
    gender: genderNumber,
    dob: formattedDob,
  };
};

// Gửi yêu cầu lấy mã OTP qua Email
export const sendOtpApi = async (registerData: RegisterPayload) => {
  try {
    const payload = formatPayload(registerData);
    const response = await axios.post('/api/auth/send-otp', payload);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Không thể gửi mã OTP.';
    throw new Error(errorMessage);
  }
};

export const resendOtpApi = async (email: string) => {
  try {
    const response = await axios.post('/api/auth/resend-otp', { email });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Không thể gửi mã OTP.';
    throw new Error(errorMessage);
  }
};

// Gửi thông tin đăng ký + mã OTP để xác thực và tạo tài khoản
export const registerApi = async (registerData: RegisterPayload) => {
  try {
    const payload = formatPayload(registerData);
    const response = await axios.post('/api/auth/register', payload);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Đăng ký thất bại.';
    throw new Error(errorMessage);
  }
};
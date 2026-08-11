import axios from 'axios';

export interface RegisterPayload {
  fullName: string;
  dob: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
  otpCode?: string;
}

// Gửi yêu cầu lấy mã OTP qua Email
export const sendOtpApi = async (email: string) => {
  try {
    const response = await axios.post('/api/auth/send-otp', { email });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Không thể gửi mã OTP.';
    throw new Error(errorMessage);
  }
};

// Gửi thông tin đăng ký + mã OTP để xác thực và tạo tài khoản
export const registerApi = async (registerData: RegisterPayload) => {
  try {
    const response = await axios.post('/api/auth/register', registerData);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Đăng ký thất bại.';
    throw new Error(errorMessage);
  }
};
import axios from 'axios';

// Gửi yêu cầu lấy mã OTP
export const sendOtpApi = async (phoneNumber: string) => {
  try {
    const response = await axios.post('/api/auth/send-otp', {
      phoneNumber,
    });
    return response.data; // Axios tự động parse JSON và trả về trong trường data
  } catch (error: any) {
    // Axios gom lỗi (kể cả lỗi 4xx, 5xx) vào đây
    const errorMessage = error.response?.data?.message || 'Không thể gửi mã OTP.';
    throw new Error(errorMessage);
  }
};

// Gửi thông tin đăng ký + mã OTP để xác thực và tạo tài khoản
export const registerApi = async (registerData: {
  fullName: string;
  dob: string;
  phone: string;
  password: string;
  address: string;
  otpCode: string;
}) => {
  const payload = {
    fullName: registerData.fullName,
    email: `${registerData.phone}@rescuehub.local`,
    phoneNumber: registerData.phone,
    password: registerData.password,
    address: registerData.address,
    otpCode: registerData.otpCode,
  };

  try {
    const response = await axios.post('/api/auth/register', payload);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Đăng ký thất bại.';
    throw new Error(errorMessage);
  }
};
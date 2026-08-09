// Gửi yêu cầu lấy mã OTP
export const sendOtpApi = async (phoneNumber: string) => {
  const response = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phoneNumber }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Không thể gửi mã OTP.');
  }
  return data;
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
  // Map lại tên thuộc tính cho khớp với DTO ở Backend C# của bạn
  const payload = {
    fullName: registerData.fullName,
    email: `${registerData.phone}@rescuehub.local`, // Nếu DTO của bạn yêu cầu Email mà form chưa có, bạn có thể tạo tạm email theo số điện thoại
    phoneNumber: registerData.phone,
    password: registerData.password,
    address: registerData.address,
    otpCode: registerData.otpCode
  };

  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Đăng ký thất bại.');
  }
  return data;
};
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  LockOutlined, 
  EnvironmentOutlined 
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;

interface RegisterFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isFormComplete: boolean;
  loading: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  isFormComplete,
  loading
}) => {
  const navigate = useNavigate();

  return (
    <div 
      className="w-[698.40px] h-[900px] relative flex flex-col justify-center px-[99.2px] flex-shrink-0"
      style={{
        background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.98) 100%), radial-gradient(ellipse 114.18% 88.60% at 30.00% 30.00%, #FEE2E2 0%, rgba(254, 226, 226, 0) 36%)'
      }}
    >
      <Title level={2} style={{ color: '#172033', fontSize: '34px', fontWeight: 'bold', marginBottom: '8px' }}>
        Tạo tài khoản
      </Title>
      <Text style={{ color: '#667085', fontSize: '15px', marginBottom: '16px', lineHeight: '24px' }}>
        Nhập thông tin cơ bản. Bạn sẽ xác thực số điện thoại bằng mã OTP.
      </Text>

      <form onSubmit={handleSubmit}>
        {/* Row 1: Họ và tên & Ngày sinh */}
        <div className="flex gap-[16px] mb-3">
          <div className="flex-1">
            <label className="block text-[#344054] text-[13px] font-bold mb-1">Họ và tên</label>
            <Input 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              prefix={<UserOutlined className="text-gray-400 mr-1" />}
              required
              style={{ height: '42px', borderRadius: '12px' }}
            />
          </div>
          <div className="flex-1">
            <label className="block text-[#344054] text-[13px] font-bold mb-1">Ngày sinh</label>
            <Input 
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              placeholder="DD/MM/YYYY"
              prefix={<CalendarOutlined className="text-gray-400 mr-1" />}
              required
              style={{ height: '42px', borderRadius: '12px' }}
            />
          </div>
        </div>

        {/* Row 2: Email & Số điện thoại */}
        <div className="flex gap-[16px] mb-3">
          <div className="flex-1">
            <label className="block text-[#344054] text-[13px] font-bold mb-1">Email</label>
            <Input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập địa chỉ email"
              prefix={<MailOutlined className="text-gray-400 mr-1" />}
              required
              style={{ height: '42px', borderRadius: '12px' }}
            />
          </div>
          <div className="flex-1">
            <label className="block text-[#344054] text-[13px] font-bold mb-1">Số điện thoại</label>
            <Input 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              prefix={<PhoneOutlined className="text-gray-400 mr-1" />}
              required
              style={{ height: '42px', borderRadius: '12px' }}
            />
          </div>
        </div>

        {/* Row 3: Mật khẩu & Xác nhận mật khẩu */}
        <div className="flex gap-[16px] mb-3">
          <div className="flex-1">
            <label className="block text-[#344054] text-[13px] font-bold mb-1">Mật khẩu</label>
            <Input.Password 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu (ít nhất 8 ký tự)"
              prefix={<LockOutlined className="text-gray-400 mr-1" />}
              required
              style={{ height: '42px', borderRadius: '12px' }}
            />
          </div>
          <div className="flex-1">
            <label className="block text-[#344054] text-[13px] font-bold mb-1">Xác nhận mật khẩu</label>
            <Input.Password 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              prefix={<LockOutlined className="text-gray-400 mr-1" />}
              required
              style={{ height: '42px', borderRadius: '12px' }}
            />
          </div>
        </div>

        {/* Row 4: Địa chỉ hiện tại */}
        <div className="mb-4">
          <label className="block text-[#344054] text-[13px] font-bold mb-1">Địa chỉ hiện tại</label>
          <Input 
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Nhập địa chỉ hiện tại"
            prefix={<EnvironmentOutlined className="text-gray-400 mr-1" />}
            required
            style={{ height: '42px', borderRadius: '12px' }}
          />
        </div>

        {/* Terms checkbox */}
        <div className="flex items-center gap-2 mb-5">
          <Checkbox 
            name="agreed"
            checked={formData.agreed}
            onChange={(e) => {
              const syntheticEvent = {
                target: { name: 'agreed', value: e.target.checked, type: 'checkbox', checked: e.target.checked }
              } as unknown as React.ChangeEvent<HTMLInputElement>;
              handleChange(syntheticEvent);
            }}
          >
            <span className="text-[#667085] text-[12.5px]">Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật.</span>
          </Checkbox>
        </div>

        {/* Submit Button */}
        <Button 
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={!isFormComplete}
          block
          style={{
            height: '44.27px',
            borderRadius: '12px',
            backgroundColor: isFormComplete && !loading ? '#E5484D' : undefined,
            fontWeight: 'extrabold',
            fontSize: '15px',
            boxShadow: isFormComplete && !loading ? '0px 10px 22px rgba(229,72,77,0.25)' : 'none',
            marginBottom: '16px'
          }}
        >
          {loading ? 'Đang xử lý...' : 'Đăng ký và nhận OTP'}
        </Button>
      </form>

      {/* Footer Link sử dụng trực tiếp useNavigate */}
      <div className="text-center">
        <span className="text-[#667085] text-[13px]">Đã có tài khoản? </span>
        <Link 
          onClick={(e) => { 
            e.preventDefault(); 
            navigate('/login');
          }} 
          style={{ color: '#C9383E', fontSize: '13px', fontWeight: 'extrabold' }}
        >
          Đăng nhập
        </Link>
      </div>
    </div>
  );
};
import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, Row, Col, DatePicker, Select } from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  LockOutlined, 
  EnvironmentOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface RegisterFormProps {
  onSubmit: (values: any) => void;
  loading: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading }) => {
  const [form] = Form.useForm();

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '32px 48px',
        width: '100%',
        maxWidth: '650px',
        height: '100%',
        backgroundColor: '#ffffff',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ margin: 'auto 0', width: '100%' }}>
        <Title level={2} style={{ color: '#172033', fontSize: '30px', fontWeight: 'bold', marginBottom: '4px', marginTop: 0 }}>
          Tạo tài khoản
        </Title>
        <Text style={{ color: '#667085', fontSize: '14px', marginBottom: '24px', display: 'block' }}>
          Nhập thông tin cơ bản. Bạn sẽ xác thực email bằng mã OTP.
        </Text>

        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onSubmit}
          initialValues={{ isAgreeTerms: false }}
        >
          {/* Row 1: Họ và tên & Giới tính */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="fullName"
                label={<span style={{ color: '#344054', fontSize: '13px', fontWeight: 'bold' }}>Họ và tên</span>}
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input 
                  placeholder="Nhập họ và tên"
                  prefix={<UserOutlined style={{ color: '#9ca3af', marginRight: '4px' }} />}
                  style={{ height: '42px', borderRadius: '12px' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="gender"
                label={<span style={{ color: '#344054', fontSize: '13px', fontWeight: 'bold' }}>Giới tính</span>}
                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
              >
                <Select
                  placeholder="Chọn giới tính"
                  style={{ height: '42px' }}
                  options={[
                    { value: 1, label: 'Nam' },
                    { value: 2, label: 'Nữ' },
                    { value: 3, label: 'Khác' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 2: Ngày sinh & Số điện thoại */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="dateOfBirth"
                label={<span style={{ color: '#344054', fontSize: '13px', fontWeight: 'bold' }}>Ngày sinh</span>}
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
              >
                <DatePicker 
                  placeholder="DD/MM/YYYY"
                  format="DD/MM/YYYY"
                  suffixIcon={<CalendarOutlined style={{ color: '#9ca3af' }} />}
                  style={{ width: '100%', height: '42px', borderRadius: '12px' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label={<span style={{ color: '#344054', fontSize: '13px', fontWeight: 'bold' }}>Số điện thoại</span>}
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input 
                  placeholder="Nhập số điện thoại"
                  prefix={<PhoneOutlined style={{ color: '#9ca3af', marginRight: '4px' }} />}
                  style={{ height: '42px', borderRadius: '12px' }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 3: Email */}
          <Form.Item
            name="email"
            label={<span style={{ color: '#344054', fontSize: '13px', fontWeight: 'bold' }}>Email</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              placeholder="Nhập địa chỉ email"
              prefix={<MailOutlined style={{ color: '#9ca3af', marginRight: '4px' }} />}
              style={{ height: '42px', borderRadius: '12px' }}
            />
          </Form.Item>

          {/* Row 4: Mật khẩu & Xác nhận mật khẩu */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="password"
                label={<span style={{ color: '#344054', fontSize: '13px', fontWeight: 'bold' }}>Mật khẩu</span>}
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
                ]}
              >
                <Input.Password 
                  placeholder="Nhập mật khẩu"
                  prefix={<LockOutlined style={{ color: '#9ca3af', marginRight: '4px' }} />}
                  style={{ height: '42px', borderRadius: '12px' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="confirmPassword"
                label={<span style={{ color: '#344054', fontSize: '13px', fontWeight: 'bold' }}>Xác nhận mật khẩu</span>}
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  placeholder="Nhập lại mật khẩu"
                  prefix={<LockOutlined style={{ color: '#9ca3af', marginRight: '4px' }} />}
                  style={{ height: '42px', borderRadius: '12px' }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 5: Địa chỉ */}
          <Form.Item
            name="address"
            label={<span style={{ color: '#344054', fontSize: '13px', fontWeight: 'bold' }}>Địa chỉ hiện tại</span>}
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input 
              placeholder="Nhập địa chỉ hiện tại"
              prefix={<EnvironmentOutlined style={{ color: '#9ca3af', marginRight: '4px' }} />}
              style={{ height: '42px', borderRadius: '12px' }}
            />
          </Form.Item>

          {/* Checkbox Điều khoản */}
          <Form.Item 
            name="isAgreeTerms" 
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('Bạn phải đồng ý với điều khoản sử dụng!')),
              },
            ]}
          >
            <Checkbox>
              <span style={{ color: '#667085', fontSize: '12.5px' }}>
                Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật.
              </span>
            </Checkbox>
          </Form.Item>

          {/* Nút Submit */}
          <Button 
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#E5484D',
              fontWeight: 800,
              fontSize: '15px',
              boxShadow: '0px 10px 22px rgba(229,72,77,0.25)',
              marginBottom: '16px',
              border: 'none'
            }}
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký và nhận OTP'}
          </Button>
        </Form>

        {/* Footer link */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: '#667085', fontSize: '13px' }}>Đã có tài khoản? </span>
          <Link 
            to="/login"
            style={{ color: '#C9383E', fontSize: '13px', fontWeight: 800, textDecoration: 'none' }}
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};
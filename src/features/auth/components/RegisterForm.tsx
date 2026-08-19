import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Row, Col, DatePicker, Select } from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  LockOutlined, 
  EnvironmentOutlined
} from '@ant-design/icons';
import './RegisterForm.css';
import Title from 'antd/es/typography/Title';
import Text from 'antd/es/typography/Text';



interface RegisterFormProps {
  onSubmit: (values: any) => void;
  loading: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading }) => {
  const [form] = Form.useForm();

  return (
    <div className="register-form">
      <div className="register-form-inner">
        <Title level={2} className="register-form-title">
          Tạo tài khoản
        </Title>
        <Text className="register-form-subtitle">
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
                label={<span className="register-form-label">Họ và tên</span>}
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input 
                  className="register-form-input"
                  placeholder="Nhập họ và tên"
                  prefix={<UserOutlined style={{ color: '#9ca3af', marginRight: '4px' }} />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="gender"
                label={<span className="register-form-label">Giới tính</span>}
                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
              >
                <Select
                  className="register-form-select"
                  placeholder="Chọn giới tính"
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
                label={<span className="register-form-label">Ngày sinh</span>}
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
              >
                <DatePicker 
                  className="register-form-date-picker"
                  placeholder="DD/MM/YYYY"
                  format="DD/MM/YYYY"
                  inputReadOnly
                  suffixIcon={<CalendarOutlined style={{ color: '#9ca3af' }} />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label={<span className="register-form-label">Số điện thoại</span>}
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input 
                  className="register-form-input"
                  placeholder="Nhập số điện thoại"
                  prefix={<PhoneOutlined style={{ color: '#9ca3af', marginRight: '4px' }} />}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 3: Email */}
          <Form.Item
            name="email"
            label={<span className="register-form-label">Email</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              className="register-form-input"
              placeholder="Nhập địa chỉ email"
              prefix={<MailOutlined style={{ color: '#9ca3af', marginRight: '4px' }} />}
            />
          </Form.Item>

          {/* Row 4: Mật khẩu & Xác nhận mật khẩu */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="password"
                label={<span className="register-form-label">Mật khẩu</span>}
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
                ]}
              >
                <Input.Password 
                  className="register-form-password"
                  placeholder="Nhập mật khẩu"
                  prefix={<LockOutlined style={{ color: '#9ca3af', marginRight: '4px' }} />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="confirmPassword"
                label={<span className="register-form-label">Xác nhận mật khẩu</span>}
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
                  className="register-form-password"
                  placeholder="Nhập lại mật khẩu"
                  prefix={<LockOutlined style={{ color: '#9ca3af', marginRight: '4px' }} />}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 5: Địa chỉ */}
          <Form.Item
            name="address"
            label={<span className="register-form-label">Địa chỉ hiện tại</span>}
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input 
              className="register-form-input"
              placeholder="Nhập địa chỉ hiện tại"
              prefix={<EnvironmentOutlined style={{ color: '#9ca3af', marginRight: '4px' }} />}
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
              <span className="register-form-checkbox-text">
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
            className="register-form-submit"
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký và nhận OTP'}
          </Button>
        </Form>

        {/* Footer link */}
        <div className="register-form-footer">
          <span className="register-form-footer-text">Đã có tài khoản? </span>
          <Link className="register-form-link" to="/login">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};
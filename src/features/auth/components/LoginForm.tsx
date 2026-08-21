import { HeartFilled, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Checkbox, Divider, Form, Input, message } from "antd";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import "./LoginForm.css";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi } from "../api/authApi";

export const LoginForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (values: { email: string; password: string }) => loginApi(values),
    onSuccess: async (data) => {
      message.success("Đăng nhập thành công!");

      // 1. Xóa cache cũ và làm mới lại thông tin currentUser
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      await queryClient.invalidateQueries({ queryKey: ["profile"] });

      // 2. Điều hướng về trang chủ
      navigate("/", { replace: true });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errorMessages?.[0] ||
        error?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      message.error(errorMessage);
    },
  });

  const handleLogin = (values: { email: string; password: string }) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="login-form">
      <div className="login-form-inner">
        <div className="app-header__brand">
          <div className="app-header__logo">
            <HeartFilled />
          </div>
          <span>RescueHub</span>
        </div>

        <Title level={2} className="login-form-title">
          Chào mừng trở lại
        </Title>
        <Text className="login-form-subtitle">
          Đăng nhập để tiếp tục sử dụng các dịch vụ hỗ trợ và cứu trợ cộng đồng
        </Text>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="email"
            label={<span className="login-form-label">Email</span>}
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              className="login-form-input"
              placeholder="Nhập địa chỉ email"
              prefix={<MailOutlined style={{ color: "#9ca3af", marginRight: "4px" }} />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="login-form-label">Mật khẩu</span>}
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              className="login-form-password"
              placeholder="Nhập mật khẩu"
              prefix={<LockOutlined style={{ color: "#9ca3af", marginRight: "4px" }} />}
            />
          </Form.Item>

          <div className="login-form-options">
            <Form.Item
              name="isRememberLogin"
              valuePropName="checked"
              className="login-form-remember"
            >
              <Checkbox>
                <span className="login-form-checkbox-text">Ghi nhớ đăng nhập</span>
              </Checkbox>
            </Form.Item>

            <Link to="/forgot-password" className="login-form-link">
              Quên mật khẩu?
            </Link>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            className="login-form-submit"
            loading={loginMutation.isPending}
          >
            Đăng nhập
          </Button>

          <Divider>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>hoặc</div>
          </Divider>

          <div className="login-form-signup-row">
            <span className="login-form-signup-text">Chưa có tài khoản?</span>
            <Link to="/register" className="login-form-link">
              Đăng ký ngay
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};
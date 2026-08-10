import {
  Button,
  Form,
  Input,
  message,
  Space,
} from 'antd'
import { useMutation } from '@tanstack/react-query'

import {
  updateProfile,
  type UpdateProfileRequest,
} from '../api/profileApi'

import type { UserProfile } from '../../../types/user'

type ProfileFormProps = {
  user: UserProfile
}

function ProfileForm({ user }: ProfileFormProps) {
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()

  // Gọi API cập nhật hồ sơ
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,

    onSuccess: () => {
      messageApi.success('Cập nhật hồ sơ thành công')
    },

    onError: () => {
      messageApi.error('Không thể cập nhật hồ sơ')
    },
  })

  // Xử lý khi bấm Lưu thay đổi
  const handleSubmit = (values: UpdateProfileRequest) => {
    console.log('Dữ liệu gửi lên:', values)

    updateProfileMutation.mutate(values)
  }

  return (
    <section className="profile-form">
      {contextHolder}

      <h2>Thông tin cá nhân</h2>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          fullName: user.fullName,
          email: user.email ?? '',
          phone: user.phone ?? '',
          province: user.province ?? '',
        }}
        onFinish={handleSubmit}
      >
        <div className="profile-form__grid">
          <Form.Item
            label="Họ và tên"
            name="fullName"
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: 'email',
                message: 'Email không đúng định dạng',
              },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Tỉnh / Thành phố"
            name="province"
          >
            <Input placeholder="Nhập tỉnh / thành phố" />
          </Form.Item>
        </div>

        {/* Địa chỉ được xử lý bằng API riêng */}
        <Form.Item label="Địa chỉ hiện tại">
          <Input.TextArea
            rows={3}
            placeholder="Địa chỉ hiện tại"
            disabled
          />
        </Form.Item>

        <div className="profile-form__actions">
          <Space>
            <Button
              onClick={() => form.resetFields()}
              disabled={updateProfileMutation.isPending}
            >
              Hủy
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={updateProfileMutation.isPending}
            >
              Lưu thay đổi
            </Button>
          </Space>
        </div>
      </Form>
    </section>
  )
}

export default ProfileForm
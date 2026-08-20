import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Space,
} from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs, { type Dayjs } from 'dayjs'

import {
  updateProfile,
  type UpdateProfileRequest,
} from '../api/profileApi'

import type { User } from '../../../types/User'
import type { Gender } from '../../../types/Enums'

type ProfileFormProps = {
  user: User
}

type ProfileFormValues = {
  fullName?: string
  phone?: string
  dateOfBirth?: Dayjs | null
  gender?: Gender
}

function ProfileForm({ user }: ProfileFormProps) {
  const [form] = Form.useForm<ProfileFormValues>()
  const [messageApi, contextHolder] = message.useMessage()
  const queryClient = useQueryClient()

  // Gọi API cập nhật hồ sơ
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      })

      queryClient.invalidateQueries({
        queryKey: ['me'],
      })

      messageApi.success('Cập nhật hồ sơ thành công')
    },

    onError: () => {
      messageApi.error('Không thể cập nhật hồ sơ')
    },
  })

  // Xử lý khi bấm Lưu thay đổi
  const handleSubmit = (values: ProfileFormValues) => {
    const payload: UpdateProfileRequest = {
      fullName: values.fullName,
      phone: values.phone,

      dateOfBirth: values.dateOfBirth
        ? values.dateOfBirth.format('YYYY-MM-DD')
        : undefined,

      gender: values.gender,
    }

    updateProfileMutation.mutate(payload)
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
          phone: user.phone ?? '',

          dateOfBirth: user.dateOfBirth
            ? dayjs(user.dateOfBirth)
            : null,

          gender: user.gender ?? undefined,
        }}
        onFinish={handleSubmit}
      >
        <div className="profile-form__grid">

          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Vui lòng nhập họ và tên',
              },
              {
                max: 100,
                message: 'Họ và tên không được vượt quá 100 ký tự',
              },
            ]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>


          <Form.Item label="Email">
            <Input
              value={user.email}
              disabled
            />
          </Form.Item>


          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập số điện thoại',
              },
              {
                pattern: /^(0|\+84)[0-9]{9,10}$/,
                message: 'Số điện thoại không hợp lệ',
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>


          <Form.Item label="Tỉnh / Thành phố">
            <Input
              value={user.province ?? ''}
              disabled
            />
          </Form.Item>


          <Form.Item
            label="Ngày sinh"
            name="dateOfBirth"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn ngày sinh',
              },
              {
                validator: (_, value: Dayjs | null) => {
                  if (!value) {
                    return Promise.resolve()
                  }

                  // Kiểm tra ngày hợp lệ
                  if (!dayjs.isDayjs(value) || !value.isValid()) {
                    return Promise.reject(
                      new Error('Ngày sinh không hợp lệ'),
                    )
                  }

                  // Không cho ngày sinh lớn hơn ngày hiện tại
                  if (value.isAfter(dayjs(), 'day')) {
                    return Promise.reject(
                      new Error(
                        'Ngày sinh không được lớn hơn ngày hiện tại',
                      ),
                    )
                  }

                  return Promise.resolve()
                },
              },
            ]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
            />
          </Form.Item>


          <Form.Item
            label="Giới tính"
            name="gender"
          >
            <Select
              placeholder="Chọn giới tính"

              options={[
                {
                  value: 'Male',
                  label: 'Nam',
                },
                {
                  value: 'Female',
                  label: 'Nữ',
                },
                {
                  value: 'Other',
                  label: 'Khác',
                },
              ]}
            />
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
              onClick={() =>
                form.resetFields()
              }
              disabled={
                updateProfileMutation.isPending
              }
            >
              Hủy
            </Button>


            <Button
              type="primary"
              htmlType="submit"
              loading={
                updateProfileMutation.isPending
              }
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
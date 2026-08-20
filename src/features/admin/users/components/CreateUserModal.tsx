import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
} from 'antd'

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import axios from 'axios'

import dayjs, {
  type Dayjs,
} from 'dayjs'

import type {
  CreateUserRequest,
  Gender,
} from '../../../../types/User'

import {
  createUser,
} from '../api/adminUserApi'


type CreateUserModalProps = {
  open: boolean
  onClose: () => void
}


type CreateUserFormValues = {
  roleName: string
  province?: string
  fullName: string
  email: string
  phone: string
  dateOfBirth?: Dayjs | null
  gender?: Gender
  password: string
}


type ApiErrorResponse = {
  errorMessages?: string[]
  message?: string
}


// Role hiện được seed cố định trong BE
const roleOptions = [
  {
    value: 'Requester',
    label: 'Requester',
  },
  {
    value: 'Volunteer',
    label: 'Volunteer',
  },
  {
    value: 'Coordinator',
    label: 'Coordinator',
  },
  {
    value: 'Admin',
    label: 'Admin',
  },
]


function getErrorMessage(
  error: unknown,
) {

  if (
    axios.isAxiosError<ApiErrorResponse>(
      error,
    )
  ) {
    return (
      error.response
        ?.data
        ?.errorMessages?.[0] ||

      error.response
        ?.data
        ?.message ||

      'Không thể tạo người dùng'
    )
  }

  return 'Không thể tạo người dùng'
}


function CreateUserModal({
  open,
  onClose,
}: CreateUserModalProps) {

  const [form] =
    Form.useForm<CreateUserFormValues>()

  const [
    messageApi,
    contextHolder,
  ] = message.useMessage()

  const queryClient =
    useQueryClient()


  // Tạo User
  const createUserMutation =
    useMutation({
      mutationFn:
        createUser,

      onSuccess: () => {

        messageApi.success(
          'Tạo người dùng thành công',
        )

        queryClient.invalidateQueries({
          queryKey: ['admin-users'],
        })

        form.resetFields()

        onClose()
      },

      onError: (
        error,
      ) => {
        messageApi.error(
          getErrorMessage(
            error,
          ),
        )
      },
    })


  const handleCancel = () => {
    form.resetFields()
    onClose()
  }


  const handleSubmit = (
    values: CreateUserFormValues,
  ) => {

    const payload:
      CreateUserRequest = {

      roleName:
        values.roleName,

      province:
        values.province
          ?.trim() ||
        undefined,

      fullName:
        values.fullName.trim(),

      email:
        values.email.trim(),

      phone:
        values.phone.trim(),

      dateOfBirth:
        values.dateOfBirth
          ? values.dateOfBirth
              .format(
                'YYYY-MM-DD',
              )
          : undefined,

      gender:
        values.gender,

      password:
        values.password,
    }

    createUserMutation.mutate(
      payload,
    )
  }


  return (
    <Modal
      className="admin-users-create-modal"
      title="Tạo người dùng mới"
      open={open}
      footer={null}
      width={900}
      centered
      onCancel={handleCancel}
    >

      {contextHolder}


      <Form
        form={form}
        layout="vertical"
        onFinish={
          handleSubmit
        }
      >

        <div className="admin-users-form-grid">


          <Form.Item
            label="Vai trò"
            name="roleName"
            rules={[
              {
                required: true,
                message:
                  'Vui lòng chọn vai trò',
              },
            ]}
          >
            <Select
              placeholder="Chọn vai trò"
              options={
                roleOptions
              }
            />
          </Form.Item>


          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[
              {
                required: true,
                whitespace: true,
                message:
                  'Vui lòng nhập họ và tên',
              },
              {
                max: 150,
                message:
                  'Họ và tên không được vượt quá 150 ký tự',
              },
            ]}
          >
            <Input
              placeholder="Nhập họ và tên"
            />
          </Form.Item>


          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message:
                  'Vui lòng nhập email',
              },
              {
                type: 'email',
                message:
                  'Email không hợp lệ',
              },
              {
                max: 255,
                message:
                  'Email không được vượt quá 255 ký tự',
              },
            ]}
          >
            <Input
              placeholder="Nhập email"
            />
          </Form.Item>


          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              {
                required: true,
                message:
                  'Vui lòng nhập số điện thoại',
              },
              {
                pattern:
                  /^(0|\+84)[0-9]{9,10}$/,
                message:
                  'Số điện thoại không hợp lệ',
              },
            ]}
          >
            <Input
              placeholder="Nhập số điện thoại"
            />
          </Form.Item>


          <Form.Item
            label="Tỉnh / Thành phố"
            name="province"
            rules={[
              {
                max: 100,
                message:
                  'Tỉnh / Thành phố không được vượt quá 100 ký tự',
              },
            ]}
          >
            <Input
              placeholder="Nhập Tỉnh / Thành phố"
            />
          </Form.Item>


          <Form.Item
            label="Ngày sinh"
            name="dateOfBirth"
            rules={[
              {
                validator: (
                  _,
                  value:
                    Dayjs | null,
                ) => {

                  if (!value) {
                    return Promise.resolve()
                  }

                  if (
                    !dayjs.isDayjs(
                      value,
                    ) ||
                    !value.isValid()
                  ) {
                    return Promise.reject(
                      new Error(
                        'Ngày sinh không hợp lệ',
                      ),
                    )
                  }

                  if (
                    !value.isBefore(
                      dayjs(),
                      'day',
                    )
                  ) {
                    return Promise.reject(
                      new Error(
                        'Ngày sinh phải nhỏ hơn ngày hiện tại',
                      ),
                    )
                  }

                  return Promise.resolve()
                },
              },
            ]}
          >
            <DatePicker
              style={{
                width: '100%',
              }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
            />
          </Form.Item>


          <Form.Item
            label="Giới tính"
            name="gender"
          >
            <Select
              allowClear
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


          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message:
                  'Vui lòng nhập mật khẩu',
              },
              {
                min: 8,
                message:
                  'Mật khẩu phải có ít nhất 8 ký tự',
              },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
            />
          </Form.Item>

        </div>


        <div className="admin-users-form-actions">

          <Space>

            <Button
              onClick={
                handleCancel
              }
              disabled={
                createUserMutation.isPending
              }
            >
              Hủy
            </Button>


            <Button
              type="primary"
              htmlType="submit"
              loading={
                createUserMutation.isPending
              }
            >
              Tạo người dùng
            </Button>

          </Space>

        </div>

      </Form>

    </Modal>
  )
}


export default CreateUserModal
import {
  Avatar,
  Button,
  Input,
  message,
  Popconfirm,
  Space,
  Table,
  Tag,
  type TableProps,
} from 'antd'

import {
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons'

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import dayjs from 'dayjs'

import type {
  AdminUserListItem,
  UserStatus,
} from '../../../../types/User'

import {
  lockUser,
  unlockUser,
} from '../api/adminUserApi'


type AdminUsersTableProps = {
  users: AdminUserListItem[]
  totalCount: number
  pageNumber: number
  pageSize: number
  loading: boolean

  onSearch: (
    value: string,
  ) => void

  onPageChange: (
    pageNumber: number,
    pageSize: number,
  ) => void

  onView: (
    userId: string,
  ) => void
}

function getInitials(fullName: string) {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

// Hiển thị trạng thái
function getStatusTag(
  status: UserStatus,
) {
  switch (status) {
    case 'Active':
      return (
        <Tag color="success">
          Hoạt động
        </Tag>
      )

    case 'Suspended':
      return (
        <Tag color="error">
          Đã khóa
        </Tag>
      )

    case 'Inactive':
      return (
        <Tag>
          Không hoạt động
        </Tag>
      )
  }
}


function AdminUsersTable({
  users,
  totalCount,
  pageNumber,
  pageSize,
  loading,
  onSearch,
  onPageChange,
  onView,
}: AdminUsersTableProps) {

  const [
    messageApi,
    contextHolder,
  ] = message.useMessage()

  const queryClient =
    useQueryClient()


  // Khóa User
  const lockUserMutation =
    useMutation({
      mutationFn: lockUser,

      onSuccess: () => {
        messageApi.success(
          'Khóa tài khoản thành công',
        )

        queryClient.invalidateQueries({
          queryKey: ['admin-users'],
        })
      },

      onError: () => {
        messageApi.error(
          'Không thể khóa tài khoản',
        )
      },
    })


  // Mở khóa User
  const unlockUserMutation =
    useMutation({
      mutationFn: unlockUser,

      onSuccess: () => {
        messageApi.success(
          'Mở khóa tài khoản thành công',
        )

        queryClient.invalidateQueries({
          queryKey: ['admin-users'],
        })
      },

      onError: () => {
        messageApi.error(
          'Không thể mở khóa tài khoản',
        )
      },
    })


  const columns:
    TableProps<AdminUserListItem>['columns'] = [

    {
      title: 'Người dùng',
      key: 'user',
      render: (_, user) => (
        <div className="admin-users__user-cell">
          <Avatar
            size={40}
            src={user.profileUrl || undefined}
          >
            {getInitials(user.fullName)}
          </Avatar>

          <div>
            <strong>{user.fullName}</strong>
            <span>{user.email}</span>
          </div>
        </div>
      ),
    },


    {
      title: 'Vai trò',
      dataIndex: 'roleName',
      key: 'roleName',

      render: (
        roleName: string,
      ) => (
        <Tag>
          {roleName}
        </Tag>
      ),
    },


    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },


    {
      title: 'Tỉnh / Thành phố',
      dataIndex: 'province',
      key: 'province',

      render: (
        province: string | null,
      ) =>
        province || '-',
    },


    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',

      render: (
        status: UserStatus,
      ) =>
        getStatusTag(status),
    },


    {
      title: 'Xác thực',
      dataIndex: 'isVerified',
      key: 'isVerified',

      render: (
        isVerified: boolean,
      ) =>
        isVerified ? (
          <Tag color="success">
            Đã xác thực
          </Tag>
        ) : (
          <Tag>
            Chưa xác thực
          </Tag>
        ),
    },


    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',

      render: (
        createdAt: string,
      ) =>
        dayjs(createdAt).format(
          'DD/MM/YYYY',
        ),
    },


    {
      title: 'Thao tác',
      key: 'actions',

      render: (_, user) => (
        <Space>

          <Button
            type="link"
            onClick={() =>
              onView(user.id)
            }
          >
            Xem
          </Button>


          {user.status === 'Active' && (
            <Popconfirm
              title="Khóa tài khoản"
              description={
                `Bạn có chắc muốn khóa ${user.fullName}?`
              }
              okText="Khóa"
              cancelText="Hủy"
              onConfirm={() =>
                lockUserMutation.mutate(
                  user.id,
                )
              }
            >
              <Button
                type="link"
                danger
                icon={
                  <LockOutlined />
                }
                loading={
                  lockUserMutation.isPending &&
                  lockUserMutation.variables ===
                    user.id
                }
              >
                Khóa
              </Button>
            </Popconfirm>
          )}


          {user.status === 'Suspended' && (
            <Popconfirm
              title="Mở khóa tài khoản"
              description={
                `Bạn có chắc muốn mở khóa ${user.fullName}?`
              }
              okText="Mở khóa"
              cancelText="Hủy"
              onConfirm={() =>
                unlockUserMutation.mutate(
                  user.id,
                )
              }
            >
              <Button
                type="link"
                icon={
                  <UnlockOutlined />
                }
                loading={
                  unlockUserMutation.isPending &&
                  unlockUserMutation.variables ===
                    user.id
                }
              >
                Mở khóa
              </Button>
            </Popconfirm>
          )}

        </Space>
      ),
    },
  ]


  return (
    <section className="admin-users-card">

      {contextHolder}


      <div className="admin-users-toolbar">

        <Input.Search
          allowClear
          placeholder="Tìm theo họ tên, email hoặc số điện thoại"
          onSearch={(value) =>
            onSearch(
              value.trim(),
            )
          }
        />


        <span>
          Tổng:{' '}

          <strong>
            {totalCount}
          </strong>

          {' '}người dùng
        </span>

      </div>


      <Table<AdminUserListItem>
        rowKey="id"

        columns={
          columns
        }

        dataSource={
          users
        }

        loading={
          loading
        }

        scroll={{
          x: 1100,
        }}

        pagination={{
          current:
            pageNumber,

          pageSize,

          total:
            totalCount,

          showSizeChanger:
            true,

          pageSizeOptions: [
            10,
            20,
            50,
          ],

          onChange: (
            nextPage,
            nextPageSize,
          ) => {

            onPageChange(
              nextPageSize !== pageSize
                ? 1
                : nextPage,

              nextPageSize,
            )
          },
        }}
      />

    </section>
  )
}


export default AdminUsersTable
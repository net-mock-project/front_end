import {
  Avatar,
  Descriptions,
  Modal,
  Spin,
  Tag,
} from 'antd'

import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'

import type {
  Gender,
  UserStatus,
} from '../../../../types/User'

import {
  getUserDetail,
} from '../api/adminUserApi'


type UserDetailModalProps = {
  userId: string | null
  open: boolean
  onClose: () => void
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


function getGenderLabel(
  gender: Gender | null,
) {
  switch (gender) {
    case 'Male':
      return 'Nam'

    case 'Female':
      return 'Nữ'

    case 'Other':
      return 'Khác'

    default:
      return '-'
  }
}


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


function UserDetailModal({
  userId,
  open,
  onClose,
}: UserDetailModalProps) {

  const {
    data: user,
    isPending,
    isError,
  } = useQuery({
    queryKey: [
      'admin-user-detail',
      userId,
    ],

    queryFn: () =>
      getUserDetail(userId!),

    enabled:
      open && !!userId,
  })


  return (
    <Modal
      className="admin-users-detail-modal"
      title="Chi tiết người dùng"
      open={open}
      onCancel={onClose}
      footer={null}
      width={860}
      centered
      destroyOnHidden
    >

      {isPending && (
        <div className="admin-users-detail-loading">
          <Spin />
        </div>
      )}


      {isError && (
        <div>
          Không thể tải thông tin người dùng.
        </div>
      )}


      {user && (
        <>
          <div className="admin-users-detail-header">

            <Avatar
              size={64}
              src={user.profileUrl || undefined}
            >
              {getInitials(user.fullName)}
            </Avatar>


            <div>
              <h3>
                {user.fullName}
              </h3>

              <span>
                {user.email}
              </span>
            </div>

          </div>


          <Descriptions
            bordered
            column={2}
            size="small"
            items={[

              {
                key: 'id',
                label: 'ID',
                span: 2,

                children: (
                  <span className="admin-users-detail__id">
                    {user.id}
                  </span>
                ),
              },

              {
                key: 'roleName',
                label: 'Vai trò',
                children:
                  user.roleName || '-',
              },

              {
                key: 'status',
                label: 'Trạng thái',
                children:
                  getStatusTag(
                    user.status,
                  ),
              },

              {
                key: 'phone',
                label: 'Số điện thoại',
                children:
                  user.phone || '-',
              },

              {
                key: 'province',
                label: 'Tỉnh / Thành phố',
                children:
                  user.province || '-',
              },

              {
                key: 'dateOfBirth',
                label: 'Ngày sinh',
                children:
                  user.dateOfBirth
                    ? dayjs(
                        user.dateOfBirth,
                      ).format(
                        'DD/MM/YYYY',
                      )
                    : '-',
              },

              {
                key: 'gender',
                label: 'Giới tính',
                children:
                  getGenderLabel(
                    user.gender,
                  ),
              },

              {
                key: 'isVerified',
                label: 'Xác thực',
                children:
                  user.isVerified
                    ? (
                      <Tag color="success">
                        Đã xác thực
                      </Tag>
                    )
                    : (
                      <Tag>
                        Chưa xác thực
                      </Tag>
                    ),
              },

              {
                key: 'createdAt',
                label: 'Ngày tạo',
                children:
                  user.createdAt
                    ? dayjs(
                        user.createdAt,
                      ).format(
                        'DD/MM/YYYY HH:mm',
                      )
                    : '-',
              },

              {
                key: 'reliefRequestCount',
                label: 'Yêu cầu cứu trợ',
                children:
                  user.reliefRequestCount ?? 0,
              },

              {
                key: 'donationCount',
                label: 'Lượt quyên góp',
                children:
                  user.donationCount ?? 0,
              },

              {
                key: 'taskCompletedCount',
                label: 'Nhiệm vụ hoàn thành',
                children:
                  user.taskCompletedCount ?? 0,
              },
            ]}
          />

        </>
      )}

    </Modal>
  )
}


export default UserDetailModal
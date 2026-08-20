import { UploadOutlined } from '@ant-design/icons'
import {
  Avatar,
  Button,
  message,
  Upload,
} from 'antd'
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import { updateAvatar } from '../api/profileApi'
import type { User } from '../../../types/User'

type AvatarSectionProps = {
  user: User
}

function AvatarSection({
  user,
}: AvatarSectionProps) {
  const [messageApi, contextHolder] =
    message.useMessage()

  const queryClient =
    useQueryClient()


  const initials = user.fullName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()


  // Gọi API cập nhật ảnh đại diện
  const updateAvatarMutation =
    useMutation({
      mutationFn: updateAvatar,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['profile'],
        })

        queryClient.invalidateQueries({
          queryKey: ['me'],
        })

        messageApi.success(
          'Cập nhật ảnh đại diện thành công',
        )
      },

      onError: () => {
        messageApi.error(
          'Không thể cập nhật ảnh đại diện',
        )
      },
    })


  return (
    <section className="avatar-section">
      {contextHolder}

      <div className="avatar-section__header">
        <h2>Ảnh đại diện</h2>

        <p>
          Hỗ trợ định dạng JPG, JPEG,
          PNG hoặc WEBP.
        </p>
      </div>


      <div className="avatar-section__content">

        <Avatar
          size={88}
          src={
            user.profileUrl || undefined
          }
        >
          {initials}
        </Avatar>


        <Upload
          accept=".jpg,.jpeg,.png,.webp"
          maxCount={1}
          showUploadList={false}

          beforeUpload={(file) => {
            updateAvatarMutation.mutate(
              file,
            )

            return false
          }}
        >
          <Button
            icon={<UploadOutlined />}
            loading={
              updateAvatarMutation.isPending
            }
          >
            Tải ảnh mới
          </Button>
        </Upload>

      </div>
    </section>
  )
}

export default AvatarSection
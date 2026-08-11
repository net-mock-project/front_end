import {
  DeleteOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Space, Upload } from 'antd'

import type { User } from '../../../types/User'

type AvatarSectionProps = {
  user: User
}

function AvatarSection({ user }: AvatarSectionProps) {
  const initials = user.fullName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <section className="avatar-section">
      <div className="avatar-section__header">
        <h2>Ảnh đại diện</h2>
        <p>Hỗ trợ định dạng JPG, JPEG hoặc PNG.</p>
      </div>

      <div className="avatar-section__content">
        <Avatar
          size={88}
          src={user.profileUrl || undefined}
        >
          {initials}
        </Avatar>

        <Space>
          {/* Chưa gọi API upload ở bước giao diện */}
          <Upload
            accept=".jpg,.jpeg,.png"
            maxCount={1}
            showUploadList={false}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>
              Tải ảnh mới
            </Button>
          </Upload>

          <Button
            danger
            icon={<DeleteOutlined />}
          >
            Xóa ảnh
          </Button>
        </Space>
      </div>
    </section>
  )
}

export default AvatarSection
import { useState } from 'react'
import { Button, Card, Image, List, Tag, Typography } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

import type { ReliefRequest } from '../../../types/ReliefRequest'

const { Title, Text, Paragraph } = Typography

type ReliefRequestCardProps = {
  request: ReliefRequest
  onOpen: (requestId: string) => void
}

const statusLabels: Record<string, string> = {
  Pending: 'Chờ duyệt',
  Approved: 'Đã duyệt',
  InProgress: 'Đang xử lý',
  Completed: 'Hoàn thành',
  Rejected: 'Từ chối',
  Cancelled: 'Đã hủy',
}

function getStatusColor(status: string) {
  if (status === 'Completed') return 'success'
  if (status === 'Rejected' || status === 'Cancelled') return 'error'
  if (status === 'Approved' || status === 'InProgress') return 'processing'
  return 'warning'
}

function ReliefRequestCard({ request, onOpen }: ReliefRequestCardProps) {
  const requestImage = request.reliefImageUrl?.match(/^https?:\/\//i)
    ? request.reliefImageUrl
    : '/relief-request-placeholder.svg'
  const [imageFailed, setImageFailed] = useState(false)
  const imageSource = imageFailed
    ? '/relief-request-placeholder.svg'
    : requestImage

  return (
    <List.Item>
      <Card className="relief-request-card" hoverable onClick={() => onOpen(request.id)}>
        <Image
          className="relief-request-card__image"
          preview={false}
          src={imageSource}
          alt={request.title}
          onError={() => setImageFailed(true)}
        />

        <div className="relief-request-card__top">
          <Tag color={getStatusColor(request.status)}>{statusLabels[request.status] ?? request.status}</Tag>
          <Text type="secondary">{dayjs(request.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
        </div>
        <Title level={4}>{request.title}</Title>
        <Paragraph ellipsis={{ rows: 2 }}>{request.description}</Paragraph>
        <div className="relief-request-card__meta">
          <span>{request.estimatedAffectedPeople} người</span>
          <span>{request.requestedResource}</span>
        </div>
        <Button type="link" icon={<EyeOutlined />} onClick={(event) => { event.stopPropagation(); onOpen(request.id) }}>
          Xem chi tiết
        </Button>
      </Card>
    </List.Item>
  )
}

export default ReliefRequestCard
import { Button, Descriptions, List, Modal, Space, Spin, Tag, Typography } from 'antd'
import dayjs from 'dayjs'

import type { ReliefRequest } from '../../../types/ReliefRequest'

const { Text, Title } = Typography

type ReliefRequestDetailModalProps = {
  request: ReliefRequest | undefined
  loading: boolean
  open: boolean
  cancelling: boolean
  onClose: () => void
  onEdit: (request: ReliefRequest) => void
  onCancel: (requestId: string) => void
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

function formatDate(value: string | null) {
  return value ? dayjs(value).format('DD/MM/YYYY HH:mm') : 'Chưa cập nhật'
}

function ReliefRequestDetailModal({ request, loading, open, cancelling, onClose, onEdit, onCancel }: ReliefRequestDetailModalProps) {
  return (
    <Modal
      title={request?.title ?? 'Chi tiết yêu cầu cứu trợ'}
      open={open}
      onCancel={onClose}
      footer={request?.status === 'Pending' ? (
        <Space>
          <Button danger loading={cancelling} onClick={() => onCancel(request.id)}>Hủy yêu cầu</Button>
          <Button type="primary" onClick={() => onEdit(request)}>Chỉnh sửa</Button>
        </Space>
      ) : <Button onClick={onClose}>Đóng</Button>}
      width={760}
    >
      {loading ? <Spin /> : request ? <>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Trạng thái"><Tag color={getStatusColor(request.status)}>{statusLabels[request.status] ?? request.status}</Tag></Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{formatDate(request.createdAt)}</Descriptions.Item>
          <Descriptions.Item label="Nguồn lực">{request.requestedResource}</Descriptions.Item>
          <Descriptions.Item label="Mức khẩn cấp">{request.urgencyLevel}/5</Descriptions.Item>
          <Descriptions.Item label="Người bị ảnh hưởng">{request.estimatedAffectedPeople}</Descriptions.Item>
          <Descriptions.Item label="Bán kính">{request.estimatedAffectedRadiusKm} km</Descriptions.Item>
          <Descriptions.Item label="Mô tả" span={2}>{request.description}</Descriptions.Item>
        </Descriptions>

        <Title level={4} className="relief-request-detail__tasks-title">Relief task</Title>
        {request.reliefTasks?.length ? <List bordered dataSource={request.reliefTasks} renderItem={(task) => (
          <List.Item>
            <Space direction="vertical">
              <Text strong>{task.title ?? `Task ${task.id}`}</Text>
              <Text type="secondary">{task.description ?? 'Chưa có mô tả'} · {task.status ?? 'Chưa cập nhật'}</Text>
            </Space>
          </List.Item>
        )} /> : <Text type="secondary">Chưa có relief task được phân công.</Text>}
      </> : <Text type="secondary">Không thể tải chi tiết yêu cầu.</Text>}
    </Modal>
  )
}

export default ReliefRequestDetailModal
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Descriptions, Empty, List, Modal, Space, Spin, Tag, Tooltip, Typography, message } from 'antd'
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import axios from 'axios'

import type { ReliefRequest, ReliefTask, ReliefTaskPayload, SuitableVolunteer } from '../../../types/ReliefRequest'
import {
  completeReliefTask,
  createReliefTask,
  deleteReliefTask,
  getReliefTasks,
  getReliefTask,
  getSuitableVolunteers,
  assignVolunteer,
  approveReliefRequest,
  completeReliefRequest,
  updateReliefTask,
} from '../api/reliefRequestApi'
import ReliefTaskForm from './ReliefTaskForm'
import { getReliefSkillName } from '../config/skills'

const { Text, Title } = Typography

type ReliefRequestDetailModalProps = {
  request: ReliefRequest | undefined
  loading: boolean
  open: boolean
  cancelling: boolean
  isCoordinator: boolean
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

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { errorMessages?: string[]; message?: string } | undefined
    return data?.errorMessages?.[0] || data?.message || fallback
  }
  return fallback
}

function ReliefRequestDetailModal({ request, loading, open, cancelling, isCoordinator, onClose, onEdit, onCancel }: ReliefRequestDetailModalProps) {
  const [messageApi, contextHolder] = message.useMessage()
  const queryClient = useQueryClient()
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<ReliefTask | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [volunteersOpen, setVolunteersOpen] = useState(false)

  const approveMutation = useMutation({
    mutationFn: () => approveReliefRequest(request!.id),
    onSuccess: () => {
      messageApi.success('Duyệt yêu cầu cứu trợ thành công')
      queryClient.invalidateQueries({ queryKey: ['relief-requests'] })
      queryClient.invalidateQueries({ queryKey: ['relief-request', request?.id] })
    },
    onError: (error) => messageApi.error(getErrorMessage(error, 'Không thể duyệt yêu cầu cứu trợ')),
  })
  const completeRequestMutation = useMutation({
    mutationFn: () => completeReliefRequest(request!.id),
    onSuccess: () => {
      messageApi.success('Hoàn thành yêu cầu cứu trợ thành công')
      queryClient.invalidateQueries({ queryKey: ['relief-requests'] })
      queryClient.invalidateQueries({ queryKey: ['relief-request', request?.id] })
      onClose()
    },
    onError: (error) => messageApi.error(getErrorMessage(error, 'Không thể hoàn thành yêu cầu cứu trợ')),
  })

  const tasksQuery = useQuery({
    queryKey: ['relief-tasks', request?.id],
    queryFn: () => getReliefTasks(request!.id),
    enabled: Boolean(request?.id && open),
  })
  const taskDetailQuery = useQuery({
    queryKey: ['relief-task', request?.id, selectedTaskId],
    queryFn: () => getReliefTask(request!.id, selectedTaskId!),
    enabled: Boolean(request?.id && selectedTaskId),
  })
  const volunteersQuery = useQuery({
    queryKey: ['suitable-volunteers', request?.id, selectedTaskId],
    queryFn: () => getSuitableVolunteers(request!.id, selectedTaskId!),
    enabled: Boolean(isCoordinator && volunteersOpen && request?.id && selectedTaskId),
  })

  const taskMutation = useMutation({
    mutationFn: ({ task, payload }: { task: ReliefTask | null; payload: ReliefTaskPayload }) => task
      ? updateReliefTask({ requestId: request!.id, taskId: task.id, payload })
      : createReliefTask({ requestId: request!.id, payload }),
    onSuccess: () => {
      messageApi.success(editingTask ? 'Cập nhật task thành công' : 'Tạo task thành công')
      queryClient.invalidateQueries({ queryKey: ['relief-tasks', request?.id] })
      setTaskFormOpen(false)
      setEditingTask(null)
    },
    onError: (error) => messageApi.error(getErrorMessage(error, 'Không thể lưu task')),
  })
  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => deleteReliefTask({ requestId: request!.id, taskId }),
    onSuccess: () => {
      messageApi.success('Đã xóa task')
      queryClient.invalidateQueries({ queryKey: ['relief-tasks', request?.id] })
      setSelectedTaskId(null)
    },
    onError: (error) => messageApi.error(getErrorMessage(error, 'Không thể xóa task')),
  })
  const completeMutation = useMutation({
    mutationFn: (taskId: string) => completeReliefTask({ requestId: request!.id, taskId }),
    onSuccess: () => {
      messageApi.success('Đã đánh dấu task hoàn thành')
      queryClient.invalidateQueries({ queryKey: ['relief-tasks', request?.id] })
      queryClient.invalidateQueries({ queryKey: ['relief-task', request?.id, selectedTaskId] })
    },
    onError: (error) => messageApi.error(getErrorMessage(error, 'Không thể hoàn thành task')),
  })
  const assignMutation = useMutation({
    mutationFn: (volunteerId: string) => assignVolunteer({ requestId: request!.id, taskId: selectedTaskId!, volunteerId }),
    onSuccess: () => messageApi.success('Đã giao task cho volunteer'),
    onError: (error) => messageApi.error(getErrorMessage(error, 'Không thể giao task')),
  })

  const tasks = tasksQuery.data ?? []
  const selectedTask = taskDetailQuery.data
  const allTasksCompleted = tasks.length > 0 && tasks.every((task) => task.status.toLowerCase() === 'completed')
  const canManageTasks = isCoordinator && (
    request?.status === 'Approved' || request?.status === 'InProgress'
  )

  const handleCompleteRequest = () => {
    if (!allTasksCompleted) {
      messageApi.warning('Cần hoàn thành tất cả relief task trước')
      return
    }

    completeRequestMutation.mutate()
  }

  return (
    <>
      {contextHolder}
      <Modal
        title={request?.title ?? 'Chi tiết yêu cầu cứu trợ'}
        open={open}
        onCancel={onClose}
        footer={request?.status === 'Pending' ? (
          <Space>
            {!isCoordinator && <>
              <Button danger loading={cancelling} onClick={() => onCancel(request.id)}>Hủy yêu cầu</Button>
              <Button type="primary" onClick={() => onEdit(request)}>Chỉnh sửa</Button>
            </>}
            {isCoordinator && <Button type="primary" loading={approveMutation.isPending} onClick={() => approveMutation.mutate()}>Duyệt yêu cầu</Button>}
            <Button onClick={onClose}>Đóng</Button>
          </Space>
        ) : request?.status === 'Approved' && isCoordinator ? (
          <Space>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              loading={completeRequestMutation.isPending}
              disabled={tasksQuery.isPending || !allTasksCompleted}
              onClick={handleCompleteRequest}
              title={tasksQuery.isPending ? 'Đang tải danh sách task' : !tasks.length ? 'Cần tạo ít nhất một task' : !allTasksCompleted ? 'Cần hoàn thành tất cả task trước' : undefined}
            >
              Hoàn thành yêu cầu
            </Button>
            <Button onClick={onClose}>Đóng</Button>
          </Space>
        ) : <Button onClick={onClose}>Đóng</Button>}
        width={820}
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

          <div className="relief-request-detail__tasks-heading">
            <Title level={4}>Relief task</Title>
            {canManageTasks && <Button type="primary" onClick={() => { setEditingTask(null); setTaskFormOpen(true) }}>Thêm task</Button>}
          </div>

          {tasksQuery.isPending ? <Spin /> : tasks.length ? (
            <List bordered dataSource={tasks} renderItem={(task) => (
              <List.Item actions={canManageTasks ? [
                <Tooltip key="edit" title="Chỉnh sửa task">
                  <Button aria-label="Chỉnh sửa task" type="text" icon={<EditOutlined />} onClick={() => { setEditingTask(task); setTaskFormOpen(true) }} />
                </Tooltip>,
                <Tooltip key="delete" title="Xóa task">
                  <Button aria-label="Xóa task" type="text" danger icon={<DeleteOutlined />} onClick={() => Modal.confirm({ title: 'Xóa task?', okType: 'danger', okText: 'Xác nhận', cancelText: 'Đóng', onOk: () => deleteMutation.mutate(task.id) })} />
                </Tooltip>,
              ] : undefined}>
                <List.Item.Meta
                  title={<Button type="link" className="relief-task-list__title" onClick={() => setSelectedTaskId(task.id)}>{task.title}</Button>}
                  description={<Space wrap><Tag color={getStatusColor(task.status)}>{statusLabels[task.status] ?? task.status}</Tag><Text>{task.requiredVolunteers} volunteer · Ưu tiên {task.priority}</Text></Space>}
                />
              </List.Item>
            )} />
          ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có relief task" />}
        </> : <Text type="secondary">Không thể tải chi tiết yêu cầu.</Text>}
      </Modal>

      <Modal title={selectedTask?.title ?? 'Chi tiết relief task'} open={Boolean(selectedTaskId)} onCancel={() => setSelectedTaskId(null)} footer={<Button onClick={() => setSelectedTaskId(null)}>Đóng</Button>}>
        {taskDetailQuery.isPending ? <Spin /> : selectedTask ? <Descriptions bordered column={1}>
          <Descriptions.Item label="Trạng thái"><Tag color={getStatusColor(selectedTask.status)}>{selectedTask.status}</Tag></Descriptions.Item>
          <Descriptions.Item label="Mô tả">{selectedTask.description}</Descriptions.Item>
          <Descriptions.Item label="Số volunteer">{selectedTask.requiredVolunteers}</Descriptions.Item>
          <Descriptions.Item label="Độ ưu tiên">{selectedTask.priority}</Descriptions.Item>
          <Descriptions.Item label="Kỹ năng yêu cầu">
            {selectedTask.taskSkills.length
              ? selectedTask.taskSkills.map(getReliefSkillName).join(', ')
              : 'Không yêu cầu'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{formatDate(selectedTask.createdAt)}</Descriptions.Item>
          {canManageTasks && <Descriptions.Item label="Thao tác">
            <Space wrap>
              <Tooltip title="Lấy danh sách volunteer phù hợp">
                <Button icon={<TeamOutlined />} onClick={() => setVolunteersOpen(true)}>Volunteer phù hợp</Button>
              </Tooltip>
              {selectedTask.status !== 'Completed' && <Tooltip title="Đánh dấu task hoàn thành">
                <Button type="primary" icon={<CheckCircleOutlined />} loading={completeMutation.isPending} onClick={() => completeMutation.mutate(selectedTask.id)}>Hoàn thành</Button>
              </Tooltip>}
            </Space>
          </Descriptions.Item>}
        </Descriptions> : <Text type="secondary">Không thể tải chi tiết task.</Text>}
      </Modal>

      <Modal title="Volunteer phù hợp" open={volunteersOpen} onCancel={() => setVolunteersOpen(false)} footer={null}>
        {volunteersQuery.isPending ? <Spin /> : volunteersQuery.data?.length ? <List dataSource={volunteersQuery.data} renderItem={(volunteer: SuitableVolunteer) => (
          <List.Item actions={[<Button key="assign" type="primary" loading={assignMutation.isPending} onClick={() => assignMutation.mutate(volunteer.volunteerId)}>Giao task</Button>]}> 
            <List.Item.Meta title={volunteer.fullName ?? volunteer.volunteerId} description={volunteer.email ?? volunteer.phone ?? 'Volunteer'} />
          </List.Item>
        )} /> : <Empty description="Không có volunteer phù hợp" />}
      </Modal>

      <Modal title={editingTask ? 'Chỉnh sửa relief task' : 'Thêm relief task'} open={taskFormOpen} footer={null} onCancel={() => { setTaskFormOpen(false); setEditingTask(null) }} destroyOnClose>
        {request && <ReliefTaskForm
          reliefRequest={request}
            initialValues={editingTask ? {
              title: editingTask.title,
              description: editingTask.description,
              requiredVolunteers: editingTask.requiredVolunteers,
              priority: editingTask.priority,
              latitude: editingTask.latitude,
              longitude: editingTask.longitude,
              taskSkills: editingTask.taskSkills,
            } : undefined}
            requestLocation={{ lat: request.latitude, lng: request.longitude }}
            loading={taskMutation.isPending}
            onCancel={() => { setTaskFormOpen(false); setEditingTask(null) }}
            onSubmit={(payload) => taskMutation.mutate({ task: editingTask, payload })}
          />}
      </Modal>
    </>
  )
}

export default ReliefRequestDetailModal

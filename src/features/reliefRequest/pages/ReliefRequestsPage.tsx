import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Empty, Form, List, Modal, Spin, Typography, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios'

import {
  cancelReliefRequest,
  createReliefRequest,
  getAllReliefRequests,
  getMyReliefRequests,
  getReliefRequest,
  updateReliefRequest,
} from '../api/reliefRequestApi'
import ReliefRequestCard from '../components/ReliefRequestCard'
import ReliefRequestDetailModal from '../components/ReliefRequestDetailModal'
import ReliefRequestForm from '../components/ReliefRequestForm'
import type { ReliefRequest, ReliefRequestPayload } from '../../../types/ReliefRequest'
import { useGeoLocation } from '../../location/hooks/useGeoLocation'
import { useLocationHub } from '../../location/hooks/useLocationHub'
import { useCurrentUser } from '../../auth/hooks/useCurrentUser'

import './reliefRequests.css'

const { Paragraph } = Typography

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { errorMessages?: string[]; message?: string } | undefined
    return data?.errorMessages?.[0] || data?.message
  }

  return undefined
}

function ReliefRequestsPage() {
  const [form] = Form.useForm<ReliefRequestPayload>()
  const [messageApi, contextHolder] = message.useMessage()
  const queryClient = useQueryClient()
  const { data: currentUser } = useCurrentUser()
  const { location } = useGeoLocation()
  const { sendLocation } = useLocationHub()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null)

  useEffect(() => {
    if (location) {
      void sendLocation(location.latitude, location.longitude)
    }
  }, [location, sendLocation])

  useEffect(() => {
    if (formMode === 'create' && location) {
      form.setFieldsValue({
        latitude: location.latitude,
        longitude: location.longitude,
      })
    }
  }, [form, formMode, location])

  const requestsQuery = useQuery({
    queryKey: ['relief-requests', currentUser?.roleName],
    queryFn: currentUser?.roleName === 'Coordinator' ? getAllReliefRequests : getMyReliefRequests,
    enabled: Boolean(currentUser),
  })

  const detailQuery = useQuery({
    queryKey: ['relief-request', selectedId],
    queryFn: () => getReliefRequest(selectedId as string),
    enabled: Boolean(selectedId),
  })

  const saveMutation = useMutation({
    mutationFn: (values: ReliefRequestPayload) => (
      formMode === 'edit' && editingRequestId
        ? updateReliefRequest({ requestId: editingRequestId, payload: values })
        : createReliefRequest(values)
    ),
    onSuccess: () => {
      messageApi.success(
        formMode === 'edit'
          ? 'Cập nhật yêu cầu cứu trợ thành công'
          : 'Tạo yêu cầu cứu trợ thành công',
      )
      queryClient.invalidateQueries({ queryKey: ['relief-requests'] })
      setFormMode(null)
      setEditingRequestId(null)
      form.resetFields()
    },
    onError: (error) => {
      messageApi.error(getErrorMessage(error) ?? 'Không thể lưu yêu cầu cứu trợ')
    },
  })

  const cancelMutation = useMutation({
    mutationFn: cancelReliefRequest,
    onSuccess: () => {
      messageApi.success('Hủy yêu cầu cứu trợ thành công')
      queryClient.invalidateQueries({ queryKey: ['relief-requests'] })
      setSelectedId(null)
    },
    onError: (error) => {
      messageApi.error(getErrorMessage(error) ?? 'Không thể hủy yêu cầu cứu trợ')
    },
  })

  const handleOpenCreate = () => {
    form.resetFields()
    form.setFieldsValue({
      latitude: location?.latitude,
      longitude: location?.longitude,
      urgencyLevel: 0,
      estimatedAffectedPeople: 0,
      estimatedAffectedRadiusKm: 0,
      reliefImageUrl: '',
    })
    setEditingRequestId(null)
    setFormMode('create')
  }

  const handleOpenEdit = (request: ReliefRequest) => {
    form.setFieldsValue({
      longitude: request.longitude,
      latitude: request.latitude,
      title: request.title,
      description: request.description,
      reliefImageUrl: request.reliefImageUrl ?? '',
      requestedResource: request.requestedResource,
      urgencyLevel: request.urgencyLevel,
      estimatedAffectedPeople: request.estimatedAffectedPeople,
      estimatedAffectedRadiusKm: request.estimatedAffectedRadiusKm,
    })
    setEditingRequestId(request.id)
    setSelectedId(null)
    setFormMode('edit')
  }

  return (
    <main className="relief-requests-page">
      {contextHolder}

      <header className="relief-requests-page__header">
        <div className="relief-requests-page__header-row">
          <div>
            <Paragraph>
              Theo dõi tiến độ hỗ trợ và cập nhật nhu cầu khi yêu cầu chưa được duyệt.
            </Paragraph>
          </div>

          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleOpenCreate}>
            Tạo yêu cầu
          </Button>
        </div>
      </header>

      <section className="relief-requests-page__content">
        {requestsQuery.isPending ? (
          <div className="relief-requests-page__state">
            <Spin />
            <p>Đang tải danh sách yêu cầu cứu trợ...</p>
          </div>
        ) : requestsQuery.isError ? (
          <div className="relief-requests-page__state">
            <p>Không thể tải danh sách yêu cầu cứu trợ.</p>
          </div>
        ) : requestsQuery.data?.length ? (
          <List
            className="relief-requests-list"
            dataSource={requestsQuery.data}
            renderItem={(request) => <ReliefRequestCard request={request} onOpen={setSelectedId} />}
          />
        ) : <Empty description="Chưa có yêu cầu cứu trợ" />}
      </section>

      <Modal
        title={formMode === 'edit' ? 'Chỉnh sửa yêu cầu cứu trợ' : 'Tạo yêu cầu cứu trợ'}
        open={Boolean(formMode)}
        onCancel={() => setFormMode(null)}
        footer={null}
        width={760}
        destroyOnClose
      >
        <ReliefRequestForm
          form={form}
          loading={saveMutation.isPending}
          onSubmit={(values) => saveMutation.mutate(values)}
        />
      </Modal>

      <ReliefRequestDetailModal
        request={detailQuery.data}
        loading={detailQuery.isPending}
        open={Boolean(selectedId)}
        cancelling={cancelMutation.isPending}
        isCoordinator={currentUser?.roleName === 'Coordinator'}
        onClose={() => setSelectedId(null)}
        onEdit={handleOpenEdit}
        onCancel={(requestId) => Modal.confirm({
          title: 'Hủy yêu cầu cứu trợ?',
          content: 'Yêu cầu sẽ không thể khôi phục sau khi hủy.',
          okText: 'Xác nhận hủy',
          cancelText: 'Đóng',
          okType: 'danger',
          onOk: () => cancelMutation.mutate(requestId),
        })}
      />
    </main>
  )
}

export default ReliefRequestsPage

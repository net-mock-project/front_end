import { useState } from 'react'
import { AdvancedMarker, Map, Pin } from '@vis.gl/react-google-maps'
import type { MapMouseEvent } from '@vis.gl/react-google-maps'
import { Button, Form, Input, InputNumber, Select } from 'antd'

import type { ReliefRequest, ReliefTaskPayload } from '../../../types/ReliefRequest'
import { env } from '../../../config/env'
import { ReliefRequestMarker } from '../../map/components/ReliefRequestMarker'
import { RELIEF_SKILLS } from '../config/skills'
import '../../../features/map/components/MapComponents.css'
import '../pages/reliefRequests.css'

type ReliefTaskFormValues = Omit<ReliefTaskPayload, 'taskSkills'> & {
  taskSkills: string[]
}

type ReliefTaskFormProps = {
  initialValues?: ReliefTaskPayload
  reliefRequest: ReliefRequest
  requestLocation: { lat: number; lng: number }
  loading: boolean
  onCancel: () => void
  onSubmit: (payload: ReliefTaskPayload) => void
}

function ReliefTaskForm({ initialValues, reliefRequest, requestLocation, loading, onCancel, onSubmit }: ReliefTaskFormProps) {
  const [form] = Form.useForm<ReliefTaskFormValues>()
  const [selectedPosition, setSelectedPosition] = useState({
    lat: initialValues?.latitude || requestLocation.lat,
    lng: initialValues?.longitude || requestLocation.lng,
  })

  const defaultValues: ReliefTaskFormValues = initialValues
    ? { ...initialValues, taskSkills: initialValues.taskSkills }
    : {
        title: '',
        description: '',
        requiredVolunteers: 0,
        priority: 0,
        latitude: requestLocation.lat,
        longitude: requestLocation.lng,
        taskSkills: [],
      }

  const handleSubmit = (values: ReliefTaskFormValues) => {
    onSubmit({
      ...values,
      taskSkills: values.taskSkills,
    })
  }

  const handleMapClick = (event: MapMouseEvent) => {
    const position = event.detail.latLng
    if (!position) return

    setSelectedPosition(position)
    form.setFieldsValue({
      latitude: position.lat,
      longitude: position.lng,
    })
  }

  return (
    <Form form={form} layout="vertical" initialValues={defaultValues} onFinish={handleSubmit}>
      <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập tiêu đề task' }]}>
        <Input placeholder="Ví dụ: Phân phát nước uống" />
      </Form.Item>
      <Form.Item label="Mô tả" name="description" rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập mô tả task' }]}>
        <Input.TextArea rows={4} placeholder="Mô tả công việc cần thực hiện" />
      </Form.Item>
      <div className="relief-task-form__grid">
        <Form.Item label="Số volunteer cần thiết" name="requiredVolunteers" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Độ ưu tiên" name="priority" rules={[{ required: true, message: 'Vui lòng nhập độ ưu tiên' }]}>
          <InputNumber min={0} max={5} style={{ width: '100%' }} />
        </Form.Item>
      </div>
      <div className="relief-task-form__grid">
        <Form.Item label="Vĩ độ" name="latitude" rules={[{ required: true, message: 'Vui lòng nhập vĩ độ' }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Kinh độ" name="longitude" rules={[{ required: true, message: 'Vui lòng nhập kinh độ' }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      </div>
      <Form.Item label="Vị trí task">
        <div className="relief-task-form__map">
          <Map
            defaultCenter={selectedPosition}
            defaultZoom={17}
            mapId={env.googleMapsId}
            onClick={handleMapClick}
          >
            <ReliefRequestMarker reliefRequest={reliefRequest} onClick={() => undefined} />
            <AdvancedMarker position={selectedPosition} zIndex={2} title="Vị trí task">
              <Pin background="#1769aa" borderColor="#ffffff" glyphColor="#ffffff" />
            </AdvancedMarker>
          </Map>
        </div>
        <small className="relief-task-form__map-help">Marker đỏ là relief request. Bấm vào bản đồ để chọn vị trí task.</small>
      </Form.Item>
      <Form.Item label="Kỹ năng yêu cầu" name="taskSkills">
        <Select
          mode="multiple"
          allowClear
          placeholder="Chọn kỹ năng"
          options={RELIEF_SKILLS.map(([skillId, name]) => ({ value: skillId, label: name }))}
        />
      </Form.Item>
      <div className="relief-task-form__actions">
        <Button onClick={onCancel} disabled={loading}>Hủy</Button>
        <Button type="primary" htmlType="submit" loading={loading}>Lưu task</Button>
      </div>
    </Form>
  )
}

export default ReliefTaskForm

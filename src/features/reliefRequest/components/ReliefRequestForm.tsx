import { Button, Form, Input, InputNumber } from 'antd'

import type { ReliefRequestPayload } from '../../../types/ReliefRequest'

type ReliefRequestFormProps = {
  form: ReturnType<typeof Form.useForm<ReliefRequestPayload>>[0]
  loading: boolean
  onSubmit: (values: ReliefRequestPayload) => void
}

function ReliefRequestForm({ form, loading, onSubmit }: ReliefRequestFormProps) {
  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <div className="relief-request-form__grid">
        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập tiêu đề' }]}>
          <Input placeholder="Ví dụ: Cần hỗ trợ nước sạch" />
        </Form.Item>
        <Form.Item label="Mức độ khẩn cấp" name="urgencyLevel" rules={[{ required: true, message: 'Vui lòng nhập mức độ' }]}>
          <InputNumber min={0} max={5} style={{ width: '100%' }} />
        </Form.Item>
      </div>

      <Form.Item label="Mô tả" name="description" rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập mô tả' }]}>
        <Input.TextArea rows={4} placeholder="Mô tả tình hình và nhu cầu hỗ trợ" />
      </Form.Item>
      <Form.Item label="Nguồn lực cần hỗ trợ" name="requestedResource" rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập nguồn lực' }]}>
        <Input placeholder="Ví dụ: Nước uống, thuốc men" />
      </Form.Item>

      <div className="relief-request-form__grid">
        <Form.Item label="Số người bị ảnh hưởng" name="estimatedAffectedPeople" rules={[{ required: true, message: 'Vui lòng nhập số người' }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Bán kính ảnh hưởng (km)" name="estimatedAffectedRadiusKm" rules={[{ required: true, message: 'Vui lòng nhập bán kính' }]}>
          <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
        </Form.Item>
      </div>

      <div className="relief-request-form__grid">
        <Form.Item label="Vĩ độ" name="latitude" rules={[{ required: true, message: 'Vui lòng nhập vĩ độ' }]}>
          <InputNumber readOnly controls={false} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Kinh độ" name="longitude" rules={[{ required: true, message: 'Vui lòng nhập kinh độ' }]}>
          <InputNumber readOnly controls={false} style={{ width: '100%' }} />
        </Form.Item>
      </div>

      <Form.Item label="Ảnh minh họa (URL)" name="reliefImageUrl">
        <Input placeholder="https://..." />
      </Form.Item>

      <div className="relief-request-form__actions">
        <Button type="primary" htmlType="submit" loading={loading}>
          Lưu yêu cầu cứu trợ
        </Button>
      </div>
    </Form>
  )
}

export default ReliefRequestForm
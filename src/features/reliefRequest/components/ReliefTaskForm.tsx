import { Button, Form, Input, InputNumber, Select } from 'antd'

import type { ReliefTaskPayload } from '../../../types/ReliefRequest'
import { RELIEF_SKILLS } from '../config/skills'

type ReliefTaskFormValues = Omit<ReliefTaskPayload, 'taskSkills'> & {
  taskSkills: string[]
}

type ReliefTaskFormProps = {
  initialValues?: ReliefTaskPayload
  loading: boolean
  onCancel: () => void
  onSubmit: (payload: ReliefTaskPayload) => void
}

function ReliefTaskForm({ initialValues, loading, onCancel, onSubmit }: ReliefTaskFormProps) {
  const [form] = Form.useForm<ReliefTaskFormValues>()

  const defaultValues: ReliefTaskFormValues = initialValues
    ? { ...initialValues, taskSkills: initialValues.taskSkills }
    : {
        title: '',
        description: '',
        requiredVolunteers: 0,
        priority: 0,
        latitude: 0,
        longitude: 0,
        taskSkills: [],
      }

  const handleSubmit = (values: ReliefTaskFormValues) => {
    onSubmit({
      ...values,
      taskSkills: values.taskSkills,
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

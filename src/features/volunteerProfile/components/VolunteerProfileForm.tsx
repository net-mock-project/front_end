import { Button, Form, Input, InputNumber, Select, Space } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'

import type {
  VolunteerProfilePayload,
} from '../../../types/VolunteerProfile'
import { VOLUNTEER_SKILLS } from '../config/skills'

type VolunteerProfileFormProps = {
  initialValues?: VolunteerProfilePayload
  loading: boolean
  onSubmit: (values: VolunteerProfilePayload) => void
  onCancel: () => void
}

function VolunteerProfileForm({
  initialValues,
  loading,
  onSubmit,
  onCancel,
}: VolunteerProfileFormProps) {
  const [form] = Form.useForm<VolunteerProfilePayload>()

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues ?? {
        experienceYears: 0,
        cvUrl: '',
        skills: [{ skillId: '', level: 0 }],
      }}
      onFinish={onSubmit}
    >
      <div className="volunteer-profile-form__grid">
        <Form.Item
          label="Số năm kinh nghiệm"
          name="experienceYears"
          rules={[{ required: true, message: 'Vui lòng nhập số năm kinh nghiệm' }]}
        >
          <InputNumber min={0} max={80} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="CV (URL)"
          name="cvUrl"
          rules={[{ type: 'url', message: 'CV phải là một URL hợp lệ' }]}
        >
          <Input placeholder="https://..." />
        </Form.Item>
      </div>

      <Form.List name="skills">
        {(fields, { add, remove }) => (
          <>
            <div className="volunteer-profile-form__section-title">
              <strong>Kỹ năng</strong>
              <Button type="dashed" icon={<PlusOutlined />} onClick={() => add({ skillId: '', level: 0 })}>
                Thêm kỹ năng
              </Button>
            </div>

            {fields.map((field) => (
              <Space key={field.key} className="volunteer-profile-form__skill-row" align="start">
                <Form.Item
                  {...field}
                  label="Kỹ năng"
                  name={[field.name, 'skillId']}
                  rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập skill ID' }]}
                >
                  <Select
                    placeholder="Chọn kỹ năng"
                    options={VOLUNTEER_SKILLS.map((skill) => ({
                      value: skill.skillId,
                      label: skill.name,
                    }))}
                  />
                </Form.Item>
                <Form.Item
                  {...field}
                  label="Cấp độ"
                  name={[field.name, 'level']}
                  rules={[{ required: true, message: 'Vui lòng nhập cấp độ' }]}
                >
                  <InputNumber min={0} max={5} />
                </Form.Item>
                {fields.length > 1 && (
                  <Button danger type="text" icon={<DeleteOutlined />} aria-label="Xóa kỹ năng" onClick={() => remove(field.name)} />
                )}
              </Space>
            ))}
          </>
        )}
      </Form.List>

      <div className="volunteer-profile-form__actions">
        <Button onClick={onCancel} disabled={loading}>Hủy</Button>
        <Button type="primary" htmlType="submit" loading={loading}>Lưu thay đổi</Button>
      </div>
    </Form>
  )
}

export default VolunteerProfileForm

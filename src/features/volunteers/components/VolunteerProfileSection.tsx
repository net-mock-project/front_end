import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  InputNumber,
  Input,
  Select,
  Tag,
  Row,
  Col,
  Space,
  Empty,
  Spin,
} from "antd";
import {
  UserOutlined,
  FilePdfOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  ExportOutlined,
  EditOutlined,
  CloseCircleOutlined,
  RedoOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import {
  useMyVolunteerProfile,
  useSubmitProfileMutation,
  useUpdateProfileMutation,
} from "../hooks/useVolunteerQueries";
import { getMyVolunteerTasks } from "../../volunteer/api/volunteerTaskApi";
import { SYSTEM_SKILLS } from "../constants/skills";
import type { User } from "../../../types/User";
import { VolunteerApprovalStatus } from "../../../types/Volunteer";

interface Props {
  user: User;
}

export const VolunteerProfileSection: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: profile, isLoading } = useMyVolunteerProfile();
  const submitMutation = useSubmitProfileMutation();
  const updateMutation = useUpdateProfileMutation();

  // Đọc danh sách nhiệm vụ thực tế của Volunteer từ Database
  const { data: myTasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ["my-volunteer-tasks"],
    queryFn: getMyVolunteerTasks,
    enabled: profile?.approvalStatus === VolunteerApprovalStatus.Approved,
  });

  const handleOpenModal = () => {
    const initialSkills = profile?.skills?.length
      ? profile.skills.map((s) => ({ skillId: s.skillId, level: s.level }))
      : [{ skillId: SYSTEM_SKILLS[0].id, level: 3 }];

    form.setFieldsValue({
      experienceYears: profile?.experienceYears ?? 0,
      cvUrl: profile?.cvUrl ?? "",
      skills: initialSkills,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (values: any) => {
    const payload = {
      experienceYears: Number(values.experienceYears) || 0,
      cvUrl: values.cvUrl?.trim() || null,
      skills: (values.skills || []).map((s: any) => ({
        skillId: s.skillId,
        level: Number(s.level) || 1,
      })),
    };

    if (!profile || !profile.approvalStatus) {
      await submitMutation.mutateAsync(payload);
    } else {
      await updateMutation.mutateAsync(payload);
    }
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-400">Đang tải hồ sơ Volunteer...</div>;
  }

  const cvFileName = profile?.cvUrl
    ? profile.cvUrl.split("/").pop()?.split("?")[0] || "CV_Attachment.pdf"
    : null;

  return (
    <div style={{ width: "100%", textAlign: "left" }}>
      {/* 1. CHƯA CÓ HỒ SƠ */}
      {(!profile || !profile.approvalStatus) && (
        <div
          style={{
            minHeight: 420,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "48px 24px",
            backgroundColor: "#ffffff",
            borderRadius: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: "#EFF6FF",
              color: "#3B82F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              marginBottom: 16,
            }}
          >
            <UserOutlined />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px", color: "#111827" }}>
            Bạn chưa có hồ sơ Volunteer
          </h3>
          <p style={{ color: "#6B7280", fontSize: 14, maxWidth: 440, marginBottom: 24 }}>
            Tải CV, khai báo số năm kinh nghiệm và các kỹ năng chuyên môn để Coordinator xem xét.
          </p>
          <Button
            type="primary"
            size="large"
            onClick={handleOpenModal}
            style={{
              backgroundColor: "#EB5757",
              borderColor: "#EB5757",
              height: 44,
              borderRadius: 12,
              fontWeight: 600,
              padding: "0 28px",
            }}
          >
            Tạo hồ sơ Volunteer
          </Button>
        </div>
      )}

      {/* 2. REJECTED (BỊ TỪ CHỐI) */}
      {profile?.approvalStatus === VolunteerApprovalStatus.Rejected && (
        <div
          style={{
            minHeight: 420,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "48px 24px",
            backgroundColor: "#ffffff",
            borderRadius: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: "#FEE2E2",
              color: "#DC2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              marginBottom: 16,
            }}
          >
            <CloseCircleOutlined />
          </div>
          <div
            style={{
              backgroundColor: "#FEE2E2",
              color: "#DC2626",
              padding: "4px 14px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Hồ sơ chưa được phê duyệt
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px", color: "#111827" }}>
            Hồ sơ Volunteer của bạn đã bị từ chối
          </h3>
          <p style={{ color: "#6B7280", fontSize: 14, maxWidth: 460, marginBottom: 24 }}>
            Hồ sơ trước đó chưa đạt yêu cầu. Bạn có thể cập nhật lại thông tin kinh nghiệm, bổ sung CV và kỹ năng để gửi lại xét duyệt.
          </p>
          <Button
            type="primary"
            size="large"
            icon={<RedoOutlined />}
            onClick={handleOpenModal}
            style={{
              backgroundColor: "#EB5757",
              borderColor: "#EB5757",
              height: 44,
              borderRadius: 12,
              fontWeight: 600,
              padding: "0 28px",
            }}
          >
            Nộp lại hồ sơ Volunteer
          </Button>
        </div>
      )}

      {/* 3. PENDING (ĐANG XÉT DUYỆT) */}
      {profile?.approvalStatus === VolunteerApprovalStatus.Pending && (
        <Row gutter={20}>
          <Col span={14}>
            <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827", textAlign: "left" }}>{user.fullName}</h3>
                <Space size={8}>
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={handleOpenModal}
                    style={{ borderRadius: 8, fontWeight: 600 }}
                  >
                    Chỉnh sửa
                  </Button>
                  <div style={{ backgroundColor: "#FEF9C3", padding: "4px 16px", borderRadius: 999, color: "#D97706", fontSize: 12, fontWeight: 700 }}>
                    Pending
                  </div>
                </Space>
              </div>

              <Row gutter={[10, 10]} style={{ marginBottom: 20 }}>
                <Col span={12}>
                  <div style={{ backgroundColor: "#F9FAFB", padding: 12, borderRadius: 12, textAlign: "left" }}>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>ExperienceYears</div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{profile.experienceYears} năm</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ backgroundColor: "#F9FAFB", padding: 12, borderRadius: 12, textAlign: "left" }}>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>ApprovalStatus</div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>Pending</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ backgroundColor: "#F9FAFB", padding: 12, borderRadius: 12, textAlign: "left" }}>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>ApprovedBy</div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{profile.approvedBy || "—"}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ backgroundColor: "#F9FAFB", padding: 12, borderRadius: 12, textAlign: "left" }}>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>ApprovedAt</div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>
                      {profile.approvedAt ? dayjs(profile.approvedAt).format("DD/MM/YYYY HH:mm") : "—"}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ backgroundColor: "#F9FAFB", padding: 12, borderRadius: 12, textAlign: "left" }}>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>UpdatedAt</div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>
                      {profile.updatedAt ? dayjs(profile.updatedAt).format("DD/MM/YYYY") : "—"}
                    </div>
                  </div>
                </Col>
              </Row>

              <div style={{ marginBottom: 20, textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#374151" }}>VolunteerSkill</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((s, idx) => (
                      <Tag key={idx} color="blue" style={{ borderRadius: 999, padding: "2px 10px" }}>
                        {s.skillName || "Kỹ năng"} • Level {s.level}
                      </Tag>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs">Chưa đăng ký kỹ năng nào</span>
                  )}
                </div>
              </div>

              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#374151" }}>CV đính kèm</div>
                {profile.cvUrl ? (
                  <div style={{ backgroundColor: "#EFF6FF", border: "1px solid #DBEAFE", borderRadius: 14, padding: 12, display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", fontSize: 18 }}>
                      <FilePdfOutlined />
                    </div>
                    <div style={{ overflow: "hidden", textAlign: "left" }}>
                      <a
                        href={profile.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 13, fontWeight: 700, color: "#1E3A8A", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
                      >
                        {cvFileName} <ExportOutlined style={{ fontSize: 11 }} />
                      </a>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>
                        Tải lên: {profile.createdAt ? dayjs(profile.createdAt).format("DD/MM/YYYY") : "—"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: 12, backgroundColor: "#F9FAFB", borderRadius: 12, color: "#9CA3AF", fontSize: 12, textAlign: "center" }}>
                    Chưa cung cấp liên kết CV
                  </div>
                )}
              </div>
            </div>
          </Col>

          <Col span={10}>
            <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 16 }}>Tiểu sử cứu trợ</div>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span style={{ fontSize: 12, color: "#9CA3AF" }}>Hồ sơ đang chờ duyệt để nhận nhiệm vụ</span>}
                style={{ margin: "24px 0" }}
              />

              <div style={{ backgroundColor: "#FEF3C7", border: "1px solid #FDE68A", padding: 12, borderRadius: 12, color: "#92400E", fontSize: 12, textAlign: "left" }}>
                Coordinator sẽ phản hồi trong 24–48 giờ.
              </div>
            </div>
          </Col>
        </Row>
      )}

      {/* 4. APPROVED (ĐÃ DUYỆT) */}
      {profile?.approvalStatus === VolunteerApprovalStatus.Approved && (
        <Row gutter={20}>
          <Col span={14}>
            <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827", textAlign: "left" }}>{user.fullName}</h3>
                <div style={{ backgroundColor: "#DCFCE7", padding: "4px 16px", borderRadius: 999, color: "#16A34A", fontSize: 12, fontWeight: 700 }}>
                  Approved
                </div>
              </div>

              <Row gutter={[10, 10]} style={{ marginBottom: 20 }}>
                <Col span={12}>
                  <div style={{ backgroundColor: "#F9FAFB", padding: 12, borderRadius: 12, textAlign: "left" }}>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>ExperienceYears</div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{profile.experienceYears} năm</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ backgroundColor: "#F9FAFB", padding: 12, borderRadius: 12, textAlign: "left" }}>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>ApprovedBy</div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{profile.approvedBy || "—"}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ backgroundColor: "#F9FAFB", padding: 12, borderRadius: 12, textAlign: "left" }}>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>ApprovedAt</div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>
                      {profile.approvedAt ? dayjs(profile.approvedAt).format("DD/MM/YYYY HH:mm") : "—"}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ backgroundColor: "#F9FAFB", padding: 12, borderRadius: 12, textAlign: "left" }}>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>UpdatedAt</div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>
                      {profile.updatedAt ? dayjs(profile.updatedAt).format("DD/MM/YYYY") : "—"}
                    </div>
                  </div>
                </Col>
              </Row>

              <div style={{ marginBottom: 20, textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#374151" }}>VolunteerSkill</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((s, idx) => (
                      <Tag key={idx} color="blue" style={{ borderRadius: 999, padding: "2px 10px" }}>
                        {s.skillName || "Kỹ năng"} • Level {s.level}
                      </Tag>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs">Chưa đăng ký kỹ năng nào</span>
                  )}
                </div>
              </div>

              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#374151" }}>CV đính kèm</div>
                {profile.cvUrl ? (
                  <div style={{ backgroundColor: "#EFF6FF", border: "1px solid #DBEAFE", borderRadius: 14, padding: 12, display: "flex", gap: 10, alignItems: "center" }}>
                    <FilePdfOutlined style={{ color: "#EF4444", fontSize: 16 }} />
                    <a
                      href={profile.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 12, fontWeight: 600, color: "#1E3A8A", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      {cvFileName}
                    </a>
                  </div>
                ) : (
                  <div style={{ padding: 12, backgroundColor: "#F9FAFB", borderRadius: 12, color: "#9CA3AF", fontSize: 12, textAlign: "center" }}>
                    Chưa cung cấp liên kết CV
                  </div>
                )}
              </div>
            </div>
          </Col>

          {/* CỘT TIỂU SỬ CỨU TRỢ (ĐỌC DỮ LIỆU THẬT) */}
          <Col span={10}>
            <div style={{ backgroundColor: "#ffffff", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>Tiểu sử cứu trợ</div>
                {myTasks.length > 0 && (
                  <Tag color="blue" style={{ borderRadius: 999 }}>
                    {myTasks.length} nhiệm vụ
                  </Tag>
                )}
              </div>

              {isLoadingTasks ? (
                <div style={{ padding: "32px 0", textAlign: "center" }}>
                  <Spin tip="Đang tải lịch sử nhiệm vụ..." />
                </div>
              ) : myTasks.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span style={{ fontSize: 12, color: "#9CA3AF" }}>Chưa có lịch sử nhiệm vụ cứu trợ được ghi nhận</span>}
                  style={{ margin: "24px 0" }}
                />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 420, overflowY: "auto", paddingRight: 4 }}>
                  {myTasks.map((task: any) => {
                    const isCompleted = task.status === "Completed" || task.status === 2;
                    return (
                      <div
                        key={task.id || task.taskId}
                        onClick={() => navigate(`/my-tasks/${task.id || task.taskId}`)}
                        style={{
                          backgroundColor: "#F9FAFB",
                          border: "1px solid #F3F4F6",
                          borderRadius: 12,
                          padding: 12,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          textAlign: "left",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827", lineHeight: 1.3 }}>
                            {task.title || task.description || "Nhiệm vụ cứu trợ"}
                          </span>
                          <Tag
                            color={isCompleted ? "green" : "orange"}
                            style={{ borderRadius: 999, fontSize: 10, margin: 0 }}
                          >
                            {isCompleted ? "Hoàn thành" : "Đang thực hiện"}
                          </Tag>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#6B7280", marginTop: 6 }}>
                          {isCompleted ? (
                            <CheckCircleFilled style={{ color: "#16A34A" }} />
                          ) : (
                            <ClockCircleFilled style={{ color: "#D97706" }} />
                          )}
                          <span>
                            {task.createdAt ? dayjs(task.createdAt).format("DD/MM/YYYY HH:mm") : "Gần đây"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Col>
        </Row>
      )}

      {/* Modal nộp / cập nhật lại hồ sơ */}
      <Modal
        title={<span style={{ fontWeight: 700, fontSize: 16 }}>Đăng ký / Cập nhật hồ sơ Volunteer</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitMutation.isPending || updateMutation.isPending}
        okText="Lưu hồ sơ"
        cancelText="Hủy"
        width={560}
        okButtonProps={{ style: { backgroundColor: "#EB5757", borderColor: "#EB5757", borderRadius: 8 } }}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} style={{ paddingTop: 8, textAlign: "left" }}>
          <Form.Item
            name="experienceYears"
            label="Số năm kinh nghiệm cứu trợ"
            rules={[{ required: true, message: "Vui lòng nhập số năm kinh nghiệm" }]}
          >
            <InputNumber min={0} max={50} style={{ width: "100%", borderRadius: 8 }} />
          </Form.Item>

          <Form.Item
            name="cvUrl"
            label="Đường dẫn CV / Hồ sơ năng lực (Google Drive, Dropbox, PDF)"
            rules={[{ type: "url", message: "Đường dẫn không đúng định dạng URL" }]}
          >
            <Input placeholder="https://drive.google.com/..." style={{ borderRadius: 8 }} />
          </Form.Item>

          <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 13, textAlign: "left" }}>Danh sách kỹ năng chuyên môn</div>
          <Form.List name="skills">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, "skillId"]}
                      rules={[{ required: true, message: "Chọn kỹ năng" }]}
                      style={{ width: 280, marginBottom: 0 }}
                    >
                      <Select placeholder="Chọn kỹ năng">
                        {SYSTEM_SKILLS.map((sk) => (
                          <Select.Option key={sk.id} value={sk.id}>
                            {sk.name} - {sk.description}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "level"]}
                      rules={[{ required: true, message: "Chọn cấp độ" }]}
                      style={{ width: 140, marginBottom: 0 }}
                    >
                      <Select placeholder="Cấp độ">
                        <Select.Option value={1}>Level 1 (Cơ bản)</Select.Option>
                        <Select.Option value={2}>Level 2 (Khá)</Select.Option>
                        <Select.Option value={3}>Level 3 (Thành thạo)</Select.Option>
                        <Select.Option value={4}>Level 4 (Chuyên môn)</Select.Option>
                        <Select.Option value={5}>Level 5 (Chuyên gia)</Select.Option>
                      </Select>
                    </Form.Item>

                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{ color: "#EF4444", cursor: "pointer", fontSize: 16 }}
                    />
                  </Space>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add({ skillId: SYSTEM_SKILLS[0].id, level: 3 })}
                  block
                  icon={<PlusOutlined />}
                  style={{ borderRadius: 8, marginTop: 4 }}
                >
                  Thêm kỹ năng
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};
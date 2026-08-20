import React, { useState, useMemo } from "react";
import {
  Table,
  Button,
  Input,
  Row,
  Col,
  Modal,
  Form,
  InputNumber,
  Select,
  Space,
  Typography,
} from "antd";
import {
  UserAddOutlined,
  CheckOutlined,
  CompassOutlined,
  CalendarOutlined,
  SearchOutlined,
  PlusOutlined,
  FilePdfOutlined,
  ExportOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import {
  usePendingVolunteers,
  useApprovedVolunteers,
  useApproveVolunteerMutation,
  useRejectVolunteerMutation,
  useCreateVolunteerMutation,
} from "../hooks/useVolunteerQueries";
import { SYSTEM_SKILLS } from "../constants/skills";
import { VolunteerApprovalStatus, type Volunteer } from "../../../types/Volunteer";
import "./ManageVolunteersPage.css";

const { Title, Text } = Typography;

export const ManageVolunteersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "suspended">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [createForm] = Form.useForm();

  const { data: pendingData, isLoading: isPendingLoading } = usePendingVolunteers();
  const { data: approvedData, isLoading: isApprovedLoading } = useApprovedVolunteers();

  const approveMutation = useApproveVolunteerMutation();
  const rejectMutation = useRejectVolunteerMutation();
  const createMutation = useCreateVolunteerMutation();

  const allVolunteers = useMemo(() => {
    const pending = pendingData?.items || [];
    const approved = approvedData?.items || [];
    return [...pending, ...approved];
  }, [pendingData, approvedData]);

  // Bộ lọc 4 trạng thái: Tất cả | Pending | Approved | Suspended
  const filteredVolunteers = useMemo(() => {
    let list = allVolunteers;

    if (activeTab === "pending") {
      list = list.filter((v) => v.approvalStatus === VolunteerApprovalStatus.Pending);
    } else if (activeTab === "approved") {
      list = list.filter((v) => v.approvalStatus === VolunteerApprovalStatus.Approved);
    } else if (activeTab === "suspended") {
      list = list.filter(
        (v) =>
          v.approvalStatus === VolunteerApprovalStatus.Rejected ||
          v.approvalStatus === "Suspended"
      );
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (v) =>
          v.fullName?.toLowerCase().includes(q) ||
          v.email?.toLowerCase().includes(q) ||
          v.province?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allVolunteers, activeTab, searchTerm]);

  // Thống kê KPI
  const totalCount = allVolunteers.length || 126;
  const approvedCount = approvedData?.totalCount || 98;
  const availableCount = Math.round(approvedCount * 0.75) || 74;
  const taskCompletedCount = 412;

  const handleApprove = async () => {
    if (!selectedVolunteer) return;
    await approveMutation.mutateAsync(selectedVolunteer.volunteerId);
    setIsDetailModalOpen(false);
  };

  const handleReject = async () => {
    if (!selectedVolunteer) return;
    await rejectMutation.mutateAsync({
      id: selectedVolunteer.volunteerId,
      req: { reason: "Chưa đạt yêu cầu kinh nghiệm" }, 
    });
    setIsDetailModalOpen(false);
  };

  const handleCreateSubmit = async (values: any) => {
    await createMutation.mutateAsync({
      userId: values.userId || "20000000-0000-0000-0000-000000000001",
      experienceYears: Number(values.experienceYears) || 1,
      cvUrl: values.cvUrl || null,
      skills: (values.skills || []).map((s: any) => ({
        skillId: s.skillId,
        level: Number(s.level) || 1,
      })),
    });
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  const columns: ColumnsType<Volunteer> = [
    {
      title: "Volunteer",
      key: "volunteer",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>
            {record.fullName || "Volunteer"}
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>
            #{String(record.volunteerId || "V-301").slice(0, 6).toUpperCase()}
          </div>
        </div>
      ),
    },
    {
      title: "Khu vực",
      dataIndex: "province",
      key: "province",
      render: (province) => <span style={{ color: "#374151" }}>{province || "Đà Nẵng"}</span>,
    },
    {
      title: "Kinh nghiệm",
      dataIndex: "experienceYears",
      key: "experienceYears",
      render: (years) => <span style={{ color: "#374151" }}>{years || 0} năm</span>,
    },
    {
      title: "Kỹ năng",
      key: "skills",
      render: (_, record) => {
        const skillList = record.skills?.map((s) => s.skillName || "Kỹ năng").join(", ");
        return <span style={{ color: "#4B5563" }}>{skillList || "Sơ cứu, Lái xe"}</span>;
      },
    },
    {
      title: "Approval",
      key: "approvalStatus",
      render: (_, record) => {
        if (record.approvalStatus === VolunteerApprovalStatus.Approved) {
          return <span className="status-badge status--approved">Approved</span>;
        }
        if (record.approvalStatus === VolunteerApprovalStatus.Pending) {
          return <span className="status-badge status--pending">Pending</span>;
        }
        return <span className="status-badge status--suspended">Suspended</span>;
      },
    },
    {
      title: "Availability",
      key: "availability",
      render: (_, __, index) => {
        const statuses = [
          { label: "Available", className: "avail--available" },
          { label: "Busy", className: "avail--busy" },
          { label: "Offline", className: "avail--offline" },
        ];
        const status = statuses[index % 3];
        return <span className={`status-badge ${status.className}`}>{status.label}</span>;
      },
    },
    {
      title: "Task",
      key: "task",
      render: (_, __, index) => (
        <span style={{ fontWeight: 600, color: "#111827" }}>
          {[12, 24, 8, 19, 15][index % 5]}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Button
          className="btn-view"
          onClick={() => {
            setSelectedVolunteer(record);
            setIsDetailModalOpen(true);
          }}
        >
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div className="manage-volunteers-page">
      <div className="manage-volunteers-container">
        {/* Header căn lề trái khớp mẫu */}
        <div className="manage-volunteers-header">
          <div className="header-text">
            <div className="header-breadcrumb">Admin / Volunteer</div>
            <Title level={2} className="header-title">
              Quản lý Volunteer
            </Title>
            <Text className="header-subtitle">
              Xét duyệt, lọc kỹ năng và quản lý tình nguyện viên theo khu vực phụ trách.
            </Text>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="btn-create-volunteer"
            onClick={() => {
              createForm.resetFields();
              createForm.setFieldsValue({
                experienceYears: 1,
                skills: [{ skillId: SYSTEM_SKILLS[0].id, level: 3 }],
              });
              setIsCreateModalOpen(true);
            }}
          >
            Tạo Volunteer
          </Button>
        </div>

        {/* 4 Thẻ KPI */}
        <Row gutter={20} className="kpi-row">
          <Col span={6}>
            <div className="kpi-card">
              <div className="kpi-icon kpi-icon--red">
                <UserAddOutlined />
              </div>
              <div className="kpi-value">{totalCount}</div>
              <div className="kpi-label">Tổng Volunteer</div>
              <div className="kpi-subtext">+8 tháng này</div>
            </div>
          </Col>

          <Col span={6}>
            <div className="kpi-card">
              <div className="kpi-icon kpi-icon--green">
                <CheckOutlined />
              </div>
              <div className="kpi-value">{approvedCount}</div>
              <div className="kpi-label">Đã duyệt</div>
              <div className="kpi-subtext">77,8%</div>
            </div>
          </Col>

          <Col span={6}>
            <div className="kpi-card">
              <div className="kpi-icon kpi-icon--blue">
                <CompassOutlined />
              </div>
              <div className="kpi-value">{availableCount}</div>
              <div className="kpi-label">Available</div>
              <div className="kpi-subtext">58,7%</div>
            </div>
          </Col>

          <Col span={6}>
            <div className="kpi-card">
              <div className="kpi-icon kpi-icon--yellow">
                <CalendarOutlined />
              </div>
              <div className="kpi-value">{taskCompletedCount}</div>
              <div className="kpi-label">Task hoàn thành</div>
              <div className="kpi-subtext">96% đúng hạn</div>
            </div>
          </Col>
        </Row>

        {/* Thanh lọc 4 Tabs & Ô tìm kiếm */}
        <div className="filter-bar">
          <div className="pill-tabs">
            {[
              { key: "all", label: "Tất cả" },
              { key: "pending", label: "Pending" },
              { key: "approved", label: "Approved" },
              { key: "suspended", label: "Suspended" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`pill-tab ${activeTab === tab.key ? "active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Input
            placeholder="Tìm Volunteer"
            prefix={<SearchOutlined style={{ color: "#9CA3AF" }} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Bảng danh sách */}
        <div className="table-card">
          <Table
            columns={columns}
            dataSource={filteredVolunteers}
            rowKey={(r) => r.volunteerId || String(Math.random())}
            loading={isPendingLoading || isApprovedLoading}
            pagination={{
              pageSize: 8,
              showSizeChanger: false,
              style: { paddingRight: 24, marginBottom: 16 },
            }}
          />
        </div>
      </div>

      {/* Modal Chi tiết & Duyệt */}
      <Modal
        title={<span style={{ fontWeight: 800, fontSize: 18 }}>Chi tiết hồ sơ Volunteer</span>}
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        width={600}
        footer={
          selectedVolunteer?.approvalStatus === VolunteerApprovalStatus.Pending ? (
            <Space size={12}>
              <Button danger onClick={handleReject} loading={rejectMutation.isPending} style={{ borderRadius: 10 }}>
                Từ chối
              </Button>
              <Button
                type="primary"
                onClick={handleApprove}
                loading={approveMutation.isPending}
                style={{ backgroundColor: "#16A34A", borderColor: "#16A34A", borderRadius: 10 }}
              >
                Phê duyệt
              </Button>
            </Space>
          ) : (
            <Button onClick={() => setIsDetailModalOpen(false)} style={{ borderRadius: 10 }}>
              Đóng
            </Button>
          )
        }
      >
        {selectedVolunteer && (
          <div style={{ paddingTop: 12 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>Họ và tên</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                {selectedVolunteer.fullName}
              </div>
            </div>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>Email</div>
                <div style={{ fontWeight: 600 }}>{selectedVolunteer.email || "—"}</div>
              </Col>
              <Col span={12}>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>Số điện thoại</div>
                <div style={{ fontWeight: 600 }}>{selectedVolunteer.phone || "—"}</div>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>Khu vực</div>
                <div style={{ fontWeight: 600 }}>{selectedVolunteer.province || "Đà Nẵng"}</div>
              </Col>
              <Col span={12}>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>Kinh nghiệm</div>
                <div style={{ fontWeight: 600 }}>{selectedVolunteer.experienceYears} năm</div>
              </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6 }}>Kỹ năng chuyên môn</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selectedVolunteer.skills?.length ? (
                  selectedVolunteer.skills.map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: "#EFF6FF",
                        color: "#2563EB",
                        padding: "2px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {s.skillName || "Kỹ năng"} • Level {s.level}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: 12, color: "#9CA3AF" }}>Chưa có thông tin</span>
                )}
              </div>
            </div>

            {selectedVolunteer.cvUrl && (
              <div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6 }}>CV đính kèm</div>
                <div
                  style={{
                    backgroundColor: "#EFF6FF",
                    border: "1px solid #DBEAFE",
                    borderRadius: 12,
                    padding: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <FilePdfOutlined style={{ color: "#EF4444", fontSize: 18 }} />
                  <a
                    href={selectedVolunteer.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontWeight: 700, color: "#1E3A8A", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
                  >
                    Xem CV ứng viên <ExportOutlined style={{ fontSize: 12 }} />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal Tạo Volunteer */}
      <Modal
        title={<span style={{ fontWeight: 800, fontSize: 18 }}>Tạo Volunteer mới</span>}
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onOk={() => createForm.submit()}
        confirmLoading={createMutation.isPending}
        okText="Tạo mới"
        cancelText="Hủy"
        width={560}
        okButtonProps={{ style: { backgroundColor: "#EB5757", borderColor: "#EB5757", borderRadius: 8 } }}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreateSubmit} style={{ paddingTop: 12 }}>
          <Form.Item
            name="userId"
            label="User ID"
            rules={[{ required: true, message: "Vui lòng nhập User ID" }]}
            initialValue="20000000-0000-0000-0000-000000000001"
          >
            <Input placeholder="Guid của User" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Form.Item
            name="experienceYears"
            label="Số năm kinh nghiệm"
            rules={[{ required: true, message: "Vui lòng nhập số năm kinh nghiệm" }]}
          >
            <InputNumber min={0} max={50} style={{ width: "100%", borderRadius: 8 }} />
          </Form.Item>

          <Form.Item name="cvUrl" label="Đường dẫn CV (Tùy chọn)">
            <Input placeholder="https://example.com/cv.pdf" style={{ borderRadius: 8 }} />
          </Form.Item>

          <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 13 }}>Kỹ năng chuyên môn</div>
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
                            {sk.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "level"]}
                      rules={[{ required: true, message: "Cấp độ" }]}
                      style={{ width: 140, marginBottom: 0 }}
                    >
                      <Select placeholder="Cấp độ">
                        <Select.Option value={1}>Level 1</Select.Option>
                        <Select.Option value={2}>Level 2</Select.Option>
                        <Select.Option value={3}>Level 3</Select.Option>
                        <Select.Option value={4}>Level 4</Select.Option>
                        <Select.Option value={5}>Level 5</Select.Option>
                      </Select>
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} style={{ color: "#EF4444", cursor: "pointer" }} />
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
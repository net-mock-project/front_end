import React, { useState, useMemo } from "react";
import {
  Table,
  Button,
  Input,
  Row,
  Col,
  Modal,
  Form,
  Space,
  Typography,
  Tag,
} from "antd";
import {
  UserOutlined,
  CheckOutlined,
  CompassOutlined,
  CalendarOutlined,
  SearchOutlined,
  FilePdfOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import {
  usePendingVolunteers,
  useApprovedVolunteers,
  useApproveVolunteerMutation,
  useRejectVolunteerMutation,
} from "../hooks/useVolunteerQueries";
import { VolunteerApprovalStatus, type Volunteer } from "../../../types/Volunteer";
import "./ManageVolunteersPage.css";

const { Title, Text } = Typography;

export const ManageVolunteersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "suspended">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [rejectForm] = Form.useForm();

  const { data: pendingData, isLoading: isPendingLoading } = usePendingVolunteers();
  const { data: approvedData, isLoading: isApprovedLoading } = useApprovedVolunteers();

  const approveMutation = useApproveVolunteerMutation();
  const rejectMutation = useRejectVolunteerMutation();

  const allVolunteers = useMemo(() => {
    const pending = pendingData?.items || [];
    const approved = approvedData?.items || [];
    return [...pending, ...approved];
  }, [pendingData, approvedData]);

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

  const totalCount = allVolunteers.length || 126;
  const approvedCount = approvedData?.totalCount || 98;



  const handleApprove = async () => {
    if (!selectedVolunteer) return;
    await approveMutation.mutateAsync(selectedVolunteer.volunteerId);
    setIsDetailModalOpen(false);
  };

  const handleOpenRejectModal = () => {
    rejectForm.resetFields();
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async (values: { reason: string }) => {
    if (!selectedVolunteer) return;
    await rejectMutation.mutateAsync({
      id: selectedVolunteer.volunteerId,
      req: { reason: values.reason?.trim() || "Chưa đạt yêu cầu năng lực/kinh nghiệm" },
    });
    setIsRejectModalOpen(false);
    setIsDetailModalOpen(false);
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
        {/* Header */}
        <div className="manage-volunteers-header">
          <div className="header-text">
            <div className="header-breadcrumb">Coordinator / Volunteer</div>
            <Title level={2} className="header-title">
              Quản lý Volunteer khu vực
            </Title>
            <Text className="header-subtitle">
              Xét duyệt hồ sơ, đánh giá năng lực và quản lý tình nguyện viên.
            </Text>
          </div>
        </div>

        {/* 4 Thẻ KPI */}
        <Row gutter={20} className="kpi-row">
          <Col span={6}>
            <div className="kpi-card">
              <div className="kpi-icon kpi-icon--red">
                <UserOutlined />
              </div>
              <div className="kpi-value">{totalCount}</div>
              <div className="kpi-label">Tổng Volunteer</div>
            </div>
          </Col>

          <Col span={6}>
            <div className="kpi-card">
              <div className="kpi-icon kpi-icon--green">
                <CheckOutlined />
              </div>
              <div className="kpi-value">{approvedCount}</div>
              <div className="kpi-label">Đã duyệt</div>
            </div>
          </Col>

        </Row>

        {/* Bộ lọc Tabs & Ô tìm kiếm */}
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

        {/* Table */}
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

      {/* Modal Chi tiết & Phê duyệt / Từ chối */}
      <Modal
        title={<span style={{ fontWeight: 800, fontSize: 18 }}>Chi tiết hồ sơ Volunteer</span>}
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        width={600}
        footer={
          selectedVolunteer?.approvalStatus === VolunteerApprovalStatus.Pending ? (
            <Space size={12}>
              <Button
                danger
                onClick={handleOpenRejectModal}
                style={{ borderRadius: 10, height: 38 }}
              >
                Từ chối
              </Button>
              <Button
                type="primary"
                onClick={handleApprove}
                loading={approveMutation.isPending}
                style={{
                  backgroundColor: "#16A34A",
                  borderColor: "#16A34A",
                  borderRadius: 10,
                  height: 38,
                }}
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
              <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6 }}>
                Kỹ năng chuyên môn
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selectedVolunteer.skills?.length ? (
                  selectedVolunteer.skills.map((s, idx) => (
                    <Tag
                      key={idx}
                      color="blue"
                      style={{ borderRadius: 999, padding: "2px 10px" }}
                    >
                      {s.skillName || "Kỹ năng"} • Level {s.level}
                    </Tag>
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
                    style={{
                      fontWeight: 700,
                      color: "#1E3A8A",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    Xem CV ứng viên <ExportOutlined style={{ fontSize: 12 }} />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal Nhập lý do Từ chối */}
      <Modal
        title={<span style={{ fontWeight: 700, fontSize: 16, color: "#DC2626" }}>Từ chối hồ sơ tình nguyện viên</span>}
        open={isRejectModalOpen}
        onCancel={() => setIsRejectModalOpen(false)}
        onOk={() => rejectForm.submit()}
        confirmLoading={rejectMutation.isPending}
        okText="Xác nhận từ chối"
        okButtonProps={{ danger: true, style: { borderRadius: 8 } }}
        cancelText="Hủy"
        width={480}
      >
        <Form form={rejectForm} layout="vertical" onFinish={handleConfirmReject} style={{ paddingTop: 8 }}>
          <Form.Item
            name="reason"
            label="Lý do từ chối"
            rules={[{ required: true, message: "Vui lòng nhập lý do từ chối hồ sơ" }]}
            initialValue="Chưa đáp ứng đủ yêu cầu kinh nghiệm cứu trợ"
          >
            <Input.TextArea
              rows={3}
              placeholder="Nhập lý do gửi phản hồi cho tình nguyện viên..."
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
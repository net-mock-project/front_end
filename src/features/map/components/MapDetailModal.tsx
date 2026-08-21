import { Modal, Tag } from "antd";
import { CloseOutlined, EnvironmentOutlined, InfoCircleOutlined, PhoneOutlined, TeamOutlined, ThunderboltFilled, UserOutlined } from "@ant-design/icons";
import type { ReliefRequest } from "../../../types/ReliefRequest";
import type { Volunteer } from "../../../types/Volunteer";
import "./MapDetailModal.css";

export type SelectedMarker = { type: "volunteer"; value: Volunteer } | { type: "relief"; value: ReliefRequest } | null;

interface MapDetailModalProps {
    selectedMarker: SelectedMarker;
    onClose: () => void;
}

const formatDate = (value?: string) => value ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Chưa cập nhật";

export function MapDetailModal({ selectedMarker, onClose }: MapDetailModalProps) {
    return <Modal open={selectedMarker !== null} onCancel={onClose} footer={null} closeIcon={<CloseOutlined />} className="map-detail-modal" destroyOnClose>
        {selectedMarker?.type === "volunteer" && <VolunteerDetails volunteer={selectedMarker.value} />}
        {selectedMarker?.type === "relief" && <ReliefDetails reliefRequest={selectedMarker.value} />}
    </Modal>;
}

function VolunteerDetails({ volunteer }: { volunteer: Volunteer }) {
    return <div className="detail-content">
        <div className="detail-heading"><div className="detail-avatar volunteer-avatar"><UserOutlined /></div><div><div className="detail-eyebrow">TÌNH NGUYỆN VIÊN</div><h2>{volunteer.fullName}</h2></div></div>
        <Tag color={volunteer.status.toLowerCase() === "active" ? "green" : "default"}>{volunteer.status}</Tag>
        <div className="detail-grid"><DetailItem icon={<EnvironmentOutlined />} label="Khu vực" value={volunteer.province} /><DetailItem icon={<ThunderboltFilled />} label="Kinh nghiệm" value={`${volunteer.experienceYears} năm`} /><DetailItem icon={<PhoneOutlined />} label="Điện thoại" value={volunteer.phone} /><DetailItem icon={<TeamOutlined />} label="Xác thực" value={volunteer.approvalStatus} /></div>
        <a className="detail-contact" href={`tel:${volunteer.phone}`}><PhoneOutlined /> Liên hệ</a>
    </div>;
}

function ReliefDetails({ reliefRequest }: { reliefRequest: ReliefRequest }) {
    return <div className="detail-content">
        <div className="detail-heading"><div className="detail-avatar relief-avatar"><ThunderboltFilled /></div><div><div className="detail-eyebrow">YÊU CẦU CỨU TRỢ</div><h2>{reliefRequest.title}</h2></div></div>
        <Tag color={reliefRequest.urgencyLevel >= 3 ? "red" : "orange"}>Mức độ {reliefRequest.urgencyLevel}</Tag>
        <p className="detail-description">{reliefRequest.description || "Chưa có mô tả cho yêu cầu này."}</p>
        <div className="detail-grid"><DetailItem icon={<TeamOutlined />} label="Đối tượng ảnh hưởng" value={`${reliefRequest.estimatedAffectedPeople} người`} /><DetailItem icon={<EnvironmentOutlined />} label="Bán kính ảnh hưởng" value={`${reliefRequest.estimatedAffectedRadiusKm} km`} /><DetailItem icon={<ThunderboltFilled />} label="Nguồn lực cần" value={reliefRequest.requestedResource} /><DetailItem icon={<InfoCircleOutlined />} label="Trạng thái" value={reliefRequest.status} /></div>
        <div className="detail-time"><strong>Thời gian yêu cầu</strong><span>{formatDate(reliefRequest.startTime)} đến {formatDate(reliefRequest.endTime)}</span></div>
    </div>;
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return <div className="detail-item"><span>{icon}</span><div><small>{label}</small><strong>{value || "Chưa cập nhật"}</strong></div></div>;
}

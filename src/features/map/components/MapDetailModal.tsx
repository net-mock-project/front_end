import { Button, Descriptions, Modal, Tag } from "antd";
import type { ReliefRequest } from "../../../types/ReliefRequest";
import type { Volunteer } from "../../../types/Volunteer";

export type SelectedMarker = { type: "volunteer"; value: Volunteer } | { type: "relief"; value: ReliefRequest } | null;

interface MapDetailModalProps {
    selectedMarker: SelectedMarker;
    onClose: () => void;
}

const formatDate = (value?: string) => value ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Chưa cập nhật";

export function MapDetailModal({ selectedMarker, onClose }: MapDetailModalProps) {
    const title = selectedMarker?.type === "volunteer" ? selectedMarker.value.fullName : selectedMarker?.type === "relief" ? selectedMarker.value.title : "Chi tiết";

    return <Modal title={title} open={selectedMarker !== null} onCancel={onClose} footer={<Button onClick={onClose}>Đóng</Button>} width={560} destroyOnClose>
        {selectedMarker?.type === "volunteer" && <VolunteerDetails volunteer={selectedMarker.value} />}
        {selectedMarker?.type === "relief" && <ReliefDetails reliefRequest={selectedMarker.value} />}
    </Modal>;
}

function VolunteerDetails({ volunteer }: { volunteer: Volunteer }) {
    return <Descriptions bordered column={{ xs: 1, sm: 2 }}>
        <Descriptions.Item label="Trạng thái"><Tag color={volunteer.status.toLowerCase() === "active" ? "success" : "default"}>{volunteer.status}</Tag></Descriptions.Item>
        <Descriptions.Item label="Xác thực"><Tag color={volunteer.approvalStatus.toLowerCase() === "approved" ? "success" : "warning"}>{volunteer.approvalStatus}</Tag></Descriptions.Item>
        <Descriptions.Item label="Email">{volunteer.email || "Chưa cập nhật"}</Descriptions.Item>
        <Descriptions.Item label="Điện thoại">{volunteer.phone || "Chưa cập nhật"}</Descriptions.Item>
        <Descriptions.Item label="Khu vực">{volunteer.province || "Chưa cập nhật"}</Descriptions.Item>
        <Descriptions.Item label="Kinh nghiệm">{volunteer.experienceYears} năm</Descriptions.Item>
        <Descriptions.Item label="Tọa độ" span={2}>{volunteer.latitude}, {volunteer.longitude}</Descriptions.Item>
    </Descriptions>;
}

function ReliefDetails({ reliefRequest }: { reliefRequest: ReliefRequest }) {
    return <Descriptions bordered column={{ xs: 1, sm: 2 }}>
        <Descriptions.Item label="Trạng thái"><Tag color={reliefRequest.status === "Completed" ? "success" : "processing"}>{reliefRequest.status}</Tag></Descriptions.Item>
        <Descriptions.Item label="Mức khẩn cấp"><Tag color={reliefRequest.urgencyLevel >= 3 ? "error" : "warning"}>{reliefRequest.urgencyLevel}/5</Tag></Descriptions.Item>
        <Descriptions.Item label="Nguồn lực">{reliefRequest.requestedResource || "Chưa cập nhật"}</Descriptions.Item>
        <Descriptions.Item label="Người bị ảnh hưởng">{reliefRequest.estimatedAffectedPeople}</Descriptions.Item>
        <Descriptions.Item label="Bán kính">{reliefRequest.estimatedAffectedRadiusKm} km</Descriptions.Item>
        <Descriptions.Item label="Thời gian">{formatDate(reliefRequest.startTime)} đến {formatDate(reliefRequest.endTime)}</Descriptions.Item>
        <Descriptions.Item label="Mô tả" span={2}>{reliefRequest.description || "Chưa có mô tả cho yêu cầu này."}</Descriptions.Item>
    </Descriptions>;
}

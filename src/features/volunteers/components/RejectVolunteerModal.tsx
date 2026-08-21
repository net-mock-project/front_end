import React, { useState } from "react";
import { Modal, Input } from "antd";

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => Promise<void>;
  loading?: boolean;
}

export const RejectVolunteerModal: React.FC<Props> = ({
  open,
  onCancel,
  onConfirm,
  loading = false,
}) => {
  const [reason, setReason] = useState("");

  const handleOk = async () => {
    await onConfirm(reason);
    setReason("");
  };

  return (
    <Modal
      title={<span style={{ fontWeight: 700 }}>Từ chối hồ sơ Tình nguyện viên</span>}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Xác nhận từ chối"
      cancelText="Hủy"
      okButtonProps={{ danger: true, style: { borderRadius: 8 } }}
      cancelButtonProps={{ style: { borderRadius: 8 } }}
    >
      <p className="text-gray-500 text-xs mt-1 mb-3">
        Vui lòng nhập lý do từ chối để hệ thống gửi thông báo đến người đăng ký:
      </p>
      <Input.TextArea
        rows={3}
        placeholder="Ví dụ: Thiếu thông tin số điện thoại, chưa có kinh nghiệm phù hợp..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        style={{ borderRadius: 8 }}
      />
    </Modal>
  );
};
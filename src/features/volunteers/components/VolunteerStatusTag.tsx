import React from "react";
import { Tag } from "antd";
import { VolunteerApprovalStatus } from "../../../types/Volunteer";

interface Props {
  status: VolunteerApprovalStatus | string;
}

export const VolunteerStatusTag: React.FC<Props> = ({ status }) => {
  switch (status) {
    case VolunteerApprovalStatus.Approved:
      return (
        <Tag
          style={{
            backgroundColor: "#ECFDF5",
            color: "#059669",
            borderColor: "#A7F3D0",
            borderRadius: "9999px",
            padding: "2px 10px",
            fontWeight: 500,
          }}
        >
          Active
        </Tag>
      );
    case VolunteerApprovalStatus.Pending:
      return (
        <Tag
          style={{
            backgroundColor: "#FFFBEB",
            color: "#D97706",
            borderColor: "#FDE68A",
            borderRadius: "9999px",
            padding: "2px 10px",
            fontWeight: 500,
          }}
        >
          Pending
        </Tag>
      );
    case VolunteerApprovalStatus.Rejected:
      return (
        <Tag
          style={{
            backgroundColor: "#FEF2F2",
            color: "#DC2626",
            borderColor: "#FECACA",
            borderRadius: "9999px",
            padding: "2px 10px",
            fontWeight: 500,
          }}
        >
          Rejected
        </Tag>
      );
    default:
      return <Tag className="rounded-full px-2.5">{status}</Tag>;
  }
};
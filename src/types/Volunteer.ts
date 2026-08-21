import type { User } from "./User";

export const VolunteerApprovalStatus = {
  Pending: "Pending",
  Approved: "Approved",
  Rejected: "Rejected",
} as const;

export type VolunteerApprovalStatus =
  (typeof VolunteerApprovalStatus)[keyof typeof VolunteerApprovalStatus];

export interface VolunteerSkillInput {
  skillId: string;
  level: number;
}

export interface VolunteerSkillDto {
  skillId: string;
  skillName?: string;
  level: number;
}

export interface Volunteer extends User {
  volunteerId: string;
  experienceYears: number;
  approvalStatus: VolunteerApprovalStatus | string;
  cvUrl?: string | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
  skills: VolunteerSkillDto[];
  createdAt?: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export interface SubmitVolunteerProfileRequest {
  experienceYears: number;
  cvUrl?: string | null;
  skills: VolunteerSkillInput[];
}

export interface UpdateVolunteerProfileRequest {
  experienceYears: number;
  cvUrl?: string | null;
  skills: VolunteerSkillInput[];
}

export interface CoordinatorCreateVolunteerRequest {
  userId: string;
  experienceYears: number;
  cvUrl?: string | null;
  skills: VolunteerSkillInput[];
}

export interface RejectVolunteerProfileRequest {
  reason?: string;
}

export interface VolunteerQueryRequest {
  searchTerm?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  isDescending?: boolean;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}
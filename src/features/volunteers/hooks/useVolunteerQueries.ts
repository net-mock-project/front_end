import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { coordinatorVolunteerApi } from "../api/coordinatorVolunteerApi";
import { volunteerProfileApi } from "../api/volunteerProfileApi";
import type {
  CoordinatorCreateVolunteerRequest,
  RejectVolunteerProfileRequest,
  SubmitVolunteerProfileRequest,
  UpdateVolunteerProfileRequest,
  VolunteerQueryRequest,
} from "../../../types/Volunteer";

export const useMyVolunteerProfile = () => {
  return useQuery({
    queryKey: ["volunteer", "my-profile"],
    queryFn: () => volunteerProfileApi.getMyProfile(),
    retry: false,
  });
};

export const useSkillsQuery = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: () => volunteerProfileApi.getAvailableSkills(),
    staleTime: 1000 * 60 * 30,
  });
};

export const usePendingVolunteers = (params?: VolunteerQueryRequest) => {
  return useQuery({
    queryKey: ["volunteers", "pending", params],
    queryFn: () => coordinatorVolunteerApi.getPendingVolunteers(params),
  });
};

export const useApprovedVolunteers = (params?: VolunteerQueryRequest) => {
  return useQuery({
    queryKey: ["volunteers", "approved", params],
    queryFn: () => coordinatorVolunteerApi.getApprovedVolunteers(params),
  });
};

export const useSubmitProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitVolunteerProfileRequest) =>
      volunteerProfileApi.submitProfile(data),
    onSuccess: () => {
      message.success("Nộp hồ sơ Volunteer thành công! Đang chờ xét duyệt.");
      queryClient.invalidateQueries({ queryKey: ["volunteer", "my-profile"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || "Nộp hồ sơ thất bại!");
    },
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateVolunteerProfileRequest) =>
      volunteerProfileApi.updateProfile(data),
    onSuccess: () => {
      message.success("Cập nhật hồ sơ thành công!");
      queryClient.invalidateQueries({ queryKey: ["volunteer", "my-profile"] });
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || "Cập nhật hồ sơ thất bại!");
    },
  });
};

export const useCancelProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => volunteerProfileApi.cancelProfile(),
    onSuccess: () => {
      message.success("Đã hủy đơn đăng ký Volunteer.");
      queryClient.invalidateQueries({ queryKey: ["volunteer", "my-profile"] });
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || "Hủy đơn thất bại!");
    },
  });
};

export const useApproveVolunteerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (volunteerId: string) =>
      coordinatorVolunteerApi.approveVolunteer(volunteerId),
    onSuccess: () => {
      message.success("Phê duyệt hồ sơ thành công!");
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || "Phê duyệt thất bại!");
    },
  });
};

export const useRejectVolunteerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      req,
    }: {
      id: string;
      req?: RejectVolunteerProfileRequest;
    }) => coordinatorVolunteerApi.rejectVolunteer(id, req),
    onSuccess: () => {
      message.success("Đã từ chối hồ sơ thành công!");
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || "Thao tác thất bại!");
    },
  });
};

export const useCreateVolunteerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CoordinatorCreateVolunteerRequest) =>
      coordinatorVolunteerApi.createVolunteer(data),
    onSuccess: () => {
      message.success("Tạo Volunteer mới thành công!");
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || "Tạo Volunteer thất bại!");
    },
  });
};
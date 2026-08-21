import httpClient from "../../../api/httpClient";
import type {
  CoordinatorCreateVolunteerRequest,
  PagedResult,
  RejectVolunteerProfileRequest,
  UpdateVolunteerProfileRequest,
  Volunteer,
  VolunteerQueryRequest,
} from "../../../types/Volunteer";

const normalizePagedResult = (rawResponse: any): PagedResult<Volunteer> => {
  // Lấy dữ liệu từ trường result (hoặc fallback về data / raw)
  const resultData = rawResponse?.result || rawResponse?.data || rawResponse;
  const rawItems = resultData?.items || (Array.isArray(resultData) ? resultData : []);

  const items = rawItems.map((item: any) => ({
    ...item,
    volunteerId: item.volunteerId || item.id,
  }));

  return {
    items,
    totalCount: resultData?.totalCount ?? items.length,
  };
};

export const coordinatorVolunteerApi = {
  getPendingVolunteers: async (
    params?: VolunteerQueryRequest
  ): Promise<PagedResult<Volunteer>> => {
    const response = await httpClient.get("/api/coordinator/volunteers/pending", { params });
    return normalizePagedResult(response.data);
  },

  getApprovedVolunteers: async (
    params?: VolunteerQueryRequest
  ): Promise<PagedResult<Volunteer>> => {
    const response = await httpClient.get("/api/coordinator/volunteers", { params });
    return normalizePagedResult(response.data);
  },

  getVolunteerById: async (id: string): Promise<Volunteer> => {
    const response = await httpClient.get(`/api/coordinator/volunteers/${id}`);
    const data = response.data?.result || response.data?.data || response.data;
    return {
      ...data,
      volunteerId: data.volunteerId || data.id,
    };
  },

  createVolunteer: async (
    data: CoordinatorCreateVolunteerRequest
  ): Promise<Volunteer> => {
    const response = await httpClient.post("/api/coordinator/volunteers", data);
    return response.data?.result || response.data;
  },

  updateVolunteer: async (
    id: string,
    data: UpdateVolunteerProfileRequest
  ): Promise<Volunteer> => {
    const response = await httpClient.put(`/api/coordinator/volunteers/${id}`, data);
    return response.data?.result || response.data;
  },

  deleteVolunteer: async (
    id: string,
    data?: RejectVolunteerProfileRequest
  ): Promise<{ message: string }> => {
    const response = await httpClient.delete(`/api/coordinator/volunteers/${id}`, {
      data,
    });
    return response.data?.result || response.data;
  },

  approveVolunteer: async (id: string): Promise<Volunteer> => {
    const response = await httpClient.patch(`/api/coordinator/volunteers/${id}/approve`);
    return response.data?.result || response.data;
  },

  rejectVolunteer: async (
    id: string,
    data?: RejectVolunteerProfileRequest
  ): Promise<Volunteer> => {
    const response = await httpClient.patch(`/api/coordinator/volunteers/${id}/reject`, data);
    return response.data?.result || response.data;
  },
};
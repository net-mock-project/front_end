import httpClient from '../../../api/httpClient';
import type { MyDonationRecord } from '../../../types/donation';

export async function getMyDonations(filters: { status?: string; search?: string }) {
  const response = await httpClient.get<any>('/api/me/donations', {
    params: {
      status: filters.status === 'ALL' ? undefined : filters.status,
      search: filters.search,
    },
  });
  return response.data.result; // Trả về mảng bên trong result
}

// Cập nhật đơn quyên góp
export async function updateMyDonation(params: { donationId: string; data: Partial<MyDonationRecord> }) {
  const { donationId, data } = params;
  const response = await httpClient.patch(`/api/me/donations/${donationId}`, data);
  return response.data;
}

// Hủy đơn quyên góp
export async function cancelMyDonation(donationId: string) {
  const response = await httpClient.delete(`/api/me/donations/${donationId}`);
  return response.data;
}
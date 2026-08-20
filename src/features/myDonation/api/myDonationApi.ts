import httpClient from '../../../api/httpClient';
import type { MyDonationRecord } from '../../../types/donation';

// Lấy danh sách quyên góp
export async function getMyDonations(filters: { status?: string; search?: string }) {
  const response = await httpClient.get<MyDonationRecord[]>('/api/me/donations', {
    params: {
      status: filters.status === 'ALL' ? undefined : filters.status,
      search: filters.search,
    },
  });
  return response.data;
}

// Cập nhật đơn quyên góp
export async function updateMyDonation(donationId: string, data: Partial<MyDonationRecord>) {
  const response = await httpClient.patch(`/api/me/donations/${donationId}`, data);
  return response.data;
}
import httpClient from '../../../api/httpClient'; 
import type { MyDonationRecord } from '../../../types/donation';

interface GetCoordinatorDonationsParams {
  status?: string;
  search?: string;
}

// Lấy danh sách đơn quyên góp dành cho coordinator
export const getCoordinatorDonations = async (params?: GetCoordinatorDonationsParams) => {
  const response = await httpClient.get('/api/donations', { params });
  
  const resData = response.data;
  
  // Nếu backend trả về mảng trực tiếp
  if (Array.isArray(resData)) {
    return resData as MyDonationRecord[];
  }
  
  // Nếu backend bọc mảng trong các thuộc tính phổ biến (data, content, items, result)
  return (resData?.data || resData?.content || resData?.items || resData?.result || []) as MyDonationRecord[];
};

// Chấp nhận đơn quyên góp
export const acceptCoordinatorDonation = async (donationId: string | number) => {
  const response = await httpClient.patch(`/api/donations/${donationId}/accept`);
  return response.data;
};

// Từ chối đơn quyên góp
export const rejectCoordinatorDonation = async (donationId: string | number) => {
  const response = await httpClient.patch(`/api/donations/${donationId}/reject`);
  return response.data;
};
import httpClient from '../../../api/httpClient';
import type { DonationFormValues } from '../../../types/donation';

// Hàm gọi API tạo đơn quyên góp
export async function createDonation(data: DonationFormValues) {
  const response = await httpClient.post('/api/donations', data);
  return response.data;
}
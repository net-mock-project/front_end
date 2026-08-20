import httpClient from '../../../api/httpClient';
import type { DonationFormValues } from '../../../types/donation';

export async function createDonation(data: DonationFormValues) {
  const response = await httpClient.post('/api/me/donations', data);
  return response.data;
}

export async function getSupplies(): Promise<string[]> {
  const response = await httpClient.get('/api/me/supplies');
  return response.data;
}
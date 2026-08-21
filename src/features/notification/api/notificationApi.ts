import httpClient from '../../../api/httpClient';
import type { AppNotification } from '../../../types/Notification';

const NOTIFICATION_ENDPOINT = '/api/me/notifications';

export const getNotifications = async (): Promise<AppNotification[]> => {
  const response = await httpClient.get(NOTIFICATION_ENDPOINT);
  const raw = response.data?.result ?? response.data?.data ?? response.data;

  // Bóc tách nếu Backend trả về dạng PagedResult có chứa mảng items
  if (raw?.items && Array.isArray(raw.items)) {
    return raw.items;
  }

  return Array.isArray(raw) ? raw : [];
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await httpClient.patch(`${NOTIFICATION_ENDPOINT}/${notificationId}/read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await httpClient.patch(`${NOTIFICATION_ENDPOINT}/read-all`);
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  await httpClient.delete(`${NOTIFICATION_ENDPOINT}/${notificationId}`);
};

export const deleteAllNotifications = async (): Promise<void> => {
  await httpClient.delete(NOTIFICATION_ENDPOINT);
};
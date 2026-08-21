export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: number | string;
  urlLink?: string | null;
  isRead: boolean;
  createdAt: string;
}
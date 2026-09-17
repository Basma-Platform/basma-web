import api from './api';
import type {
  NotificationsResponse,
  NotificationUnreadCountResponse,
  MarkNotificationResponse,
} from '../types';

export const notificationService = {
  /**
   * GET /api/v1/notifications
   * Get all notifications (paginated)
   *
   * @param params - { filter, page, per_page }
   *   filter: 'all' | 'unread' | 'read'
   */
  getNotifications: async (params?: {
    filter?: 'all' | 'unread' | 'read';
    page?: number;
    per_page?: number;
  }) => {
    const response = await api.get<NotificationsResponse>(
      '/v1/notifications',
      { params }
    );
    return response.data;
  },

  /**
   * GET /api/v1/notifications/unread-count
   * Get unread notifications count (for polling)
   */
  getUnreadCount: async () => {
    const response = await api.get<NotificationUnreadCountResponse>(
      '/v1/notifications/unread-count'
    );
    return response.data;
  },

  /**
   * PUT /api/v1/notifications/{id}/read
   * Mark single notification as read
   */
  markAsRead: async (id: string) => {
    const response = await api.put<MarkNotificationResponse>(
      `/v1/notifications/${id}/read`
    );
    return response.data;
  },

  /**
   * PUT /api/v1/notifications/read-all
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    const response = await api.put<MarkNotificationResponse>(
      '/v1/notifications/read-all'
    );
    return response.data;
  },

  /**
   * DELETE /api/v1/notifications/{id}
   * Delete a single notification
   */
  deleteNotification: async (id: string) => {
    const response = await api.delete<MarkNotificationResponse>(
      `/v1/notifications/${id}`
    );
    return response.data;
  },

  /**
   * DELETE /api/v1/notifications/all
   * Delete all notifications
   */
  deleteAllNotifications: async () => {
    const response = await api.delete<MarkNotificationResponse>(
      '/v1/notifications/all'
    );
    return response.data;
  },
};

export default notificationService;
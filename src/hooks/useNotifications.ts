import { useState, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from './useAuth';
import { useNotificationsContext } from '../context/NotificationsContext';
import { toast } from 'react-toastify';
import type { Notification } from '../types';

/**
 * Hook for managing notifications list + actions.
 *
 * ⚠️ IMPORTANT:
 * The "unread count" + "polling" logic now lives in
 * `NotificationsContext` (single source of truth).
 *
 * This hook handles:
 * - Fetching the full notifications list (paginated)
 * - Marking as read/unread
 * - Deleting notifications
 *
 * Used in: NotificationsDropdown, NotificationsPage, DashboardHeader
 */
export const useNotifications = () => {
  const { isAuthenticated } = useAuth();

  // ✅ Single source of truth for unread count + polling
  const {
    unreadCount,
    markUnreadCount,
    refreshUnreadCount,
  } = useNotificationsContext();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<{
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  } | null>(null);

  /**
   * Fetch notifications list
   * GET /api/v1/notifications
   *
   * ✅ Bails silently if user is not authenticated.
   * ✅ Silent on 401 (session may be transitioning).
   */
  const fetchNotifications = useCallback(
    async (params?: {
      filter?: 'all' | 'unread' | 'read';
      page?: number;
      per_page?: number;
    }) => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const response = await notificationService.getNotifications(params);
        setNotifications(response.data);
        setMeta(response.meta);
        // ✅ Sync unread count via context
        markUnreadCount(response.unread_count);
        return response;
      } catch (error: any) {
        if (error.response?.status === 401) return;
        const message =
          error.response?.data?.message || 'حدث خطأ في تحميل الإشعارات';
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, markUnreadCount]
  );

  /**
   * Mark single notification as read
   * PUT /api/v1/notifications/{id}/read
   */
  const markAsRead = useCallback(
    async (id: string) => {
      if (!isAuthenticated) return;

      try {
        const response = await notificationService.markAsRead(id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id
              ? { ...n, is_read: true, read_at: new Date().toISOString() }
              : n
          )
        );
        // ✅ Sync unread count
        markUnreadCount(response.unread_count);
        return response;
      } catch (error: any) {
        if (error.response?.status === 401) return;
        const message =
          error.response?.data?.message || 'حدث خطأ في تحديث الإشعار';
        toast.error(message);
        throw error;
      }
    },
    [isAuthenticated, markUnreadCount]
  );

  /**
   * Mark all notifications as read
   * PUT /api/v1/notifications/read-all
   */
  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          is_read: true,
          read_at: n.read_at || new Date().toISOString(),
        }))
      );
      // ✅ Sync unread count to 0
      markUnreadCount(0);
      toast.success(response.message);
      return response;
    } catch (error: any) {
      if (error.response?.status === 401) return;
      const message =
        error.response?.data?.message || 'حدث خطأ في تحديث الإشعارات';
      toast.error(message);
      throw error;
    }
  }, [isAuthenticated, markUnreadCount]);

  /**
   * Delete single notification
   * DELETE /api/v1/notifications/{id}
   */
  const deleteNotification = useCallback(
    async (id: string) => {
      if (!isAuthenticated) return;

      try {
        const response = await notificationService.deleteNotification(id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        // ✅ Sync unread count
        markUnreadCount(response.unread_count);
        toast.success(response.message);
        return response;
      } catch (error: any) {
        if (error.response?.status === 401) return;
        const message =
          error.response?.data?.message || 'حدث خطأ في حذف الإشعار';
        toast.error(message);
        throw error;
      }
    },
    [isAuthenticated, markUnreadCount]
  );

  /**
   * Delete all notifications
   * DELETE /api/v1/notifications/all
   */
  const deleteAllNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await notificationService.deleteAllNotifications();
      setNotifications([]);
      setMeta(null);
      // ✅ Sync unread count to 0
      markUnreadCount(0);
      toast.success(response.message);
      return response;
    } catch (error: any) {
      if (error.response?.status === 401) return;
      const message =
        error.response?.data?.message || 'حدث خطأ في حذف الإشعارات';
      toast.error(message);
      throw error;
    }
  }, [isAuthenticated, markUnreadCount]);

  // ============================================
  // Backward-compat stubs
  // (polling now lives in NotificationsContext)
  // ============================================
  const startPolling = useCallback(() => {
    // No-op — controlled by NotificationsProvider
  }, []);

  const stopPolling = useCallback(() => {
    // No-op — controlled by NotificationsProvider
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    // Delegates to context
    await refreshUnreadCount();
  }, [refreshUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    meta,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    // Kept for backward compatibility — do NOT trigger polling here
    startPolling,
    stopPolling,
  };
};

export default useNotifications;
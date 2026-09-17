import { useState, useCallback, useEffect, useRef } from 'react';
import { notificationService } from '../services/notificationService';
import { toast } from 'react-toastify';
import type { Notification } from '../types';

const POLLING_INTERVAL = 60000; // 60 seconds

/**
 * Hook for managing notifications
 *
 * Used in: NotificationsDropdown, NotificationsPage, DashboardHeader
 *
 * Provides:
 * - fetchNotifications (paginated with filter)
 * - fetchUnreadCount (for badge)
 * - markAsRead (single)
 * - markAllAsRead
 * - deleteNotification (single)
 * - deleteAllNotifications
 * - startPolling / stopPolling (for unread count)
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<{
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  } | null>(null);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Fetch notifications
   * GET /api/v1/notifications
   */
  const fetchNotifications = useCallback(
    async (params?: {
      filter?: 'all' | 'unread' | 'read';
      page?: number;
      per_page?: number;
    }) => {
      try {
        setLoading(true);
        const response = await notificationService.getNotifications(params);
        setNotifications(response.data);
        setMeta(response.meta);
        setUnreadCount(response.unread_count);
        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'حدث خطأ في تحميل الإشعارات';
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Fetch unread count (for badge - used in polling)
   * GET /api/v1/notifications/unread-count
   */
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.count);
      return response.count;
    } catch (error: any) {
      // Silent error - polling shouldn't spam toasts
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  /**
   * Mark single notification as read
   * PUT /api/v1/notifications/{id}/read
   */
  const markAsRead = useCallback(async (id: string) => {
    try {
      const response = await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(response.unread_count);
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ في تحديث الإشعار';
      toast.error(message);
      throw error;
    }
  }, []);

  /**
   * Mark all notifications as read
   * PUT /api/v1/notifications/read-all
   */
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          is_read: true,
          read_at: n.read_at || new Date().toISOString(),
        }))
      );
      setUnreadCount(response.unread_count);
      toast.success(response.message);
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ في تحديث الإشعارات';
      toast.error(message);
      throw error;
    }
  }, []);

  /**
   * Delete single notification
   * DELETE /api/v1/notifications/{id}
   */
  const deleteNotification = useCallback(async (id: string) => {
    try {
      const response = await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount(response.unread_count);
      toast.success(response.message);
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ في حذف الإشعار';
      toast.error(message);
      throw error;
    }
  }, []);

  /**
   * Delete all notifications
   * DELETE /api/v1/notifications/all
   */
  const deleteAllNotifications = useCallback(async () => {
    try {
      const response = await notificationService.deleteAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
      setMeta(null);
      toast.success(response.message);
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ في حذف الإشعارات';
      toast.error(message);
      throw error;
    }
  }, []);

  /**
   * Start polling for unread count (every 60 seconds)
   */
  const startPolling = useCallback(() => {
    if (pollingRef.current) return;
    pollingRef.current = setInterval(() => {
      fetchUnreadCount();
    }, POLLING_INTERVAL);
  }, [fetchUnreadCount]);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

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
    startPolling,
    stopPolling,
  };
};

export default useNotifications;
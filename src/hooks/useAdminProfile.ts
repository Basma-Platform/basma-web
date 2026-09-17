import { useState, useCallback } from 'react';
import { profileService } from '../services/profileService';
import { useAuth } from './useAuth';
import { toast } from 'react-toastify';
import type {
  AdminStatsResponse,
  UpdateAdminProfilePayload,
  ChangePasswordPayload,
  UploadAdminImageResponse,
} from '../types';

export const useAdminProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [adminStats, setAdminStats] = useState<AdminStatsResponse | null>(null);

  /**
   * Fetch Admin Stats
   */
  const fetchAdminStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await profileService.getAdminStats();
      setAdminStats(data);
      return data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ في تحميل الإحصائيات';
      toast.error(message);
      throw error;
    } finally {
      setStatsLoading(false);
    }
  }, []);

  /**
   * Update Admin Profile
   */
  const updateAdminProfile = useCallback(
    async (data: UpdateAdminProfilePayload) => {
      try {
        setLoading(true);
        const response = await profileService.updateAdminProfile(data);

        // ✅ استخدام callback pattern لتجنب stale closure
        if (response.user) {
          const newName = response.user.name;
          updateUser((currentUser) =>
            currentUser ? { ...currentUser, name: newName } : currentUser
          );
        }

        toast.success(response.message || 'تم تحديث الملف الشخصي بنجاح');
        return response.user;
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'حدث خطأ في تحديث الملف الشخصي';
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [updateUser]
  );

  /**
   * Change Admin Password
   */
  const changeAdminPassword = useCallback(
    async (data: ChangePasswordPayload) => {
      try {
        setLoading(true);
        const response = await profileService.changeAdminPassword(data);
        toast.success(response.message || 'تم تغيير كلمة المرور بنجاح');
        return true;
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'حدث خطأ في تغيير كلمة المرور';
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Upload Admin Image
   */
  const uploadAdminImage = useCallback(
    async (file: File): Promise<UploadAdminImageResponse> => {
      try {
        setLoading(true);
        const response = await profileService.uploadAdminImage(file);

        // ✅ استخدام callback pattern لتجنب stale closure
        if (response.user) {
          const newImage = response.user.profile_image;
          updateUser((currentUser) =>
            currentUser ? { ...currentUser, profile_image: newImage } : currentUser
          );
        }

        toast.success(response.message || 'تم تحديث الصورة الشخصية بنجاح');
        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'حدث خطأ في رفع الصورة';
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [updateUser]
  );

  return {
    user,
    loading,
    statsLoading,
    adminStats,
    fetchAdminStats,
    updateAdminProfile,
    changeAdminPassword,
    uploadAdminImage,
  };
};

export default useAdminProfile;
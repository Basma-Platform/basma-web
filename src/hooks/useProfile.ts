import { useState, useCallback } from 'react';
import { profileService } from '../services/profileService';
import { useAuth } from './useAuth';
import { toast } from 'react-toastify';
import type {
  ProfileStatsResponse,
  UpdateProfilePayload,
  ChangePasswordPayload,
  UploadProfileImageResponse,
} from '../types';

export const useProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [profileStats, setProfileStats] = useState<ProfileStatsResponse | null>(null);

  /**
   * Fetch Profile Stats
   */
  const fetchProfileStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await profileService.getStats();
      setProfileStats(data);
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'حدث خطأ في تحميل الإحصائيات';
      toast.error(message);
      throw error;
    } finally {
      setStatsLoading(false);
    }
  }, []);

  /**
   * Update Profile
   */
  const updateProfile = useCallback(async (data: UpdateProfilePayload) => {
    try {
      setLoading(true);
      const response = await profileService.updateProfile(data);

      // ✅ تحديث الـ AuthContext
      updateUser(response.user);

      toast.success(response.message || 'تم تحديث الملف الشخصي بنجاح');
      return response.user;
    } catch (error: any) {
      const message = error.response?.data?.message || 'حدث خطأ في تحديث الملف الشخصي';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  /**
   * Change Password
   */
  const changePassword = useCallback(async (data: ChangePasswordPayload) => {
    try {
      setLoading(true);
      const response = await profileService.changePassword(data);
      toast.success(response.message || 'تم تغيير كلمة المرور بنجاح');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'حدث خطأ في تغيير كلمة المرور';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Upload Profile Image
   */
  const uploadImage = useCallback(async (file: File): Promise<UploadProfileImageResponse> => {
    try {
      setLoading(true);
      const response = await profileService.uploadImage(file);

      // ✅ تحديث الـ AuthContext
      if (response.user) {
        updateUser(response.user);
      }

      toast.success(response.message || 'تم تحديث الصورة الشخصية بنجاح');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'حدث خطأ في رفع الصورة';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  return {
    user,
    loading,
    statsLoading,
    profileStats,
    fetchProfileStats,
    updateProfile,
    changePassword,
    uploadImage,
  };
};

export default useProfile;
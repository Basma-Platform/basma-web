import { useState, useCallback } from 'react';
import { communityService } from '../services/communityService';
import { toast } from 'react-toastify';
import {
  translateBackendMessage,
  translateFieldErrors,
} from '../utils/helpRequestErrorMessages';
import { COMMUNITY_MAX_IMAGES_PER_POST } from '../utils/communityHelpers';
import type {
  CommunityPostFormPayload,
  CommunityPostCreateResponse,
  CommunityPostUpdateResponse,
} from '../types';

/**
 * Create / Update / Delete Community Posts.
 *
 * - Handles FormData building internally
 * - 422 → exposes field errors via `errors` state
 * - 403 → uses translated backend message
 *
 * Used in:
 *  - CreateCommunityPostPage
 *  - EditCommunityPostPage
 */
export const useCommunityPostForm = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // ============================================
  // Create
  // ============================================
  const createPost = useCallback(
    async (
      payload: CommunityPostFormPayload
    ): Promise<CommunityPostCreateResponse> => {
      try {
        setLoading(true);
        setErrors({});

        const formData = buildFormData(payload);
        const response = await communityService.createPost(formData);

        toast.success(
          translateBackendMessage(response.message, response.message) ||
            'تم استلام منشورك. سيتم مراجعته خلال 24-48 ساعة'
        );

        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 422) {
          setErrors(translateFieldErrors(data?.errors));
          toast.error('يرجى تصحيح البيانات المدخلة');
        } else if (status === 403) {
          toast.error(
            translateBackendMessage(data?.message, data?.error_code) ||
              'لا يمكن النشر حالياً',
            { autoClose: 6000 }
          );
        } else {
          toast.error(
            translateBackendMessage(data?.message, data?.error_code) ||
              'حدث خطأ أثناء النشر'
          );
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ============================================
  // Update
  // ============================================
  const updatePost = useCallback(
    async (
      id: number,
      payload: CommunityPostFormPayload
    ): Promise<CommunityPostUpdateResponse> => {
      try {
        setLoading(true);
        setErrors({});

        const formData = buildFormData(payload, true);
        const response = await communityService.updatePost(id, formData);

        toast.success(
          translateBackendMessage(response.message, response.message) ||
            'تم تحديث المنشور بنجاح'
        );

        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 422) {
          setErrors(translateFieldErrors(data?.errors));
          toast.error('يرجى تصحيح البيانات المدخلة');
        } else if (status === 400) {
          toast.error(
            translateBackendMessage(data?.message, data?.message) ||
              'لا يمكن تعديل المنشور بعد المراجعة'
          );
        } else if (status === 404) {
          toast.error(data?.message || 'المنشور غير موجود');
        } else {
          toast.error(
            translateBackendMessage(data?.message, data?.message) ||
              'حدث خطأ أثناء التحديث'
          );
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ============================================
  // Delete
  // ============================================
  const deletePost = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      const response = await communityService.deletePost(id);

      toast.success(
        translateBackendMessage(response.message, response.message) ||
          'تم حذف المنشور بنجاح'
      );
    } catch (error: any) {
      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 400) {
        toast.error(
          translateBackendMessage(data?.message, data?.message) ||
            'لا يمكن حذف المنشور بعد المراجعة'
        );
      } else if (status === 404) {
        toast.error(data?.message || 'المنشور غير موجود');
      } else {
        toast.error(
          translateBackendMessage(data?.message, data?.message) ||
            'حدث خطأ أثناء الحذف'
        );
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // Reset errors (e.g. when form reopens)
  // ============================================
  const resetErrors = useCallback(() => setErrors({}), []);

  return {
    loading,
    errors,
    createPost,
    updatePost,
    deletePost,
    resetErrors,
  };
};

// ============================================
// FormData builder
// ============================================
function buildFormData(
  payload: CommunityPostFormPayload,
  isEdit = false
): FormData {
  const fd = new FormData();

  // Type is immutable on edit — backend ignores it anyway
  if (!isEdit) {
    fd.append('type', payload.type);
  }

  fd.append('title', payload.title.trim());
  fd.append('description', payload.description.trim());

  // Optional categorization
  if (payload.category_id != null) {
    fd.append('category_id', String(payload.category_id));
  }
  if (payload.governorate_id != null) {
    fd.append('governorate_id', String(payload.governorate_id));
  }
  if (payload.city_id != null) {
    fd.append('city_id', String(payload.city_id));
  }

  // Display name
  fd.append('display_name_type', payload.display_name_type);
  if (
    payload.display_name_type === 'custom' &&
    payload.display_name_custom
  ) {
    fd.append('display_name_custom', payload.display_name_custom.trim());
  }

  // WhatsApp
  if (payload.whatsapp_number) {
    fd.append('whatsapp_number', payload.whatsapp_number.trim());
  }

  // Expiry (only for auto-expiring types)
  if (payload.expiry_choice) {
    fd.append('expiry_choice', payload.expiry_choice);
  }

  // Images — new uploads
  if (payload.images && payload.images.length > 0) {
    payload.images
      .slice(0, COMMUNITY_MAX_IMAGES_PER_POST)
      .forEach((file) => {
        fd.append('images[]', file);
      });
  }

  // Edit only — keep existing images
  if (isEdit && payload.keep_images) {
    payload.keep_images.forEach((path) => {
      fd.append('keep_images[]', path);
    });
  }

  return fd;
}

export default useCommunityPostForm;
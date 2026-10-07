import { useState, useCallback } from 'react';
import { helpRequestService } from '../services/helpRequestService';
import { toast } from 'react-toastify';
import {
  translateHelpRequestError,
  translateFieldErrors,
} from '../utils/helpRequestErrorMessages';
import type {
  HelpRequestCreatePayload,
  HelpRequestCreateResponse,
} from '../types';

/**
 * User Help Request mutations (create + delete).
 * Used in: CreateHelpRequestPage, MyHelpRequestDetailPage
 */
export const useHelpRequestForm = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  /**
   * POST /api/v1/user/help-requests (multipart)
   */
  const create = useCallback(
    async (
      payload: HelpRequestCreatePayload
    ): Promise<HelpRequestCreateResponse> => {
      try {
        setLoading(true);
        setErrors({});

        const formData = buildFormData(payload);
        const response = await helpRequestService.create(formData);

        // ✅ Translate response.message → Arabic
        toast.success(
          translateHelpRequestError(
            response.message,
            response.message
          ) || 'تم استلام طلبك بنجاح'
        );

        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 422) {
          // ✅ Translate field errors
          setErrors(translateFieldErrors(data?.errors));
          toast.error('يرجى تصحيح البيانات المدخلة');
        } else if (status === 403 || status === 409) {
          // ✅ Translate error_code or message
          toast.error(
            translateHelpRequestError(data?.message, data?.error_code),
            { autoClose: 6000 }
          );
        } else {
          // ✅ Translate generic error
          toast.error(
            translateHelpRequestError(data?.message, data?.error_code)
          );
        }

        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * DELETE /api/v1/user/help-requests/{id}
   */
  const deleteRequest = useCallback(
    async (id: number, reason?: string) => {
      try {
        setLoading(true);
        const response = await helpRequestService.delete(id, reason);

        toast.success(
          translateHelpRequestError(
            response.message,
            response.message
          ) || 'تم حذف الطلب بنجاح'
        );

        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 403) {
          toast.error(
            translateHelpRequestError(data?.message, data?.error_code),
            { autoClose: 6000 }
          );
        } else {
          toast.error(
            translateHelpRequestError(data?.message, data?.error_code)
          );
        }

        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    errors,
    create,
    deleteRequest,
  };
};

// ============================================
// FormData builder
// ============================================
function buildFormData(payload: HelpRequestCreatePayload): FormData {
  const fd = new FormData();

  // Flat fields
  fd.append('public_title', payload.public_title);
  fd.append('public_description', payload.public_description);
  fd.append('governorate_id', String(payload.governorate_id));
  fd.append('city_id', String(payload.city_id));
  fd.append('display_name_type', payload.display_name_type);
  if (payload.display_name_custom) {
    fd.append('display_name_custom', payload.display_name_custom);
  }

  // Video
  fd.append('video', payload.video);

  // Nested — full_details
  fd.append('full_details[real_name]', payload.full_details.real_name);
  fd.append('full_details[age]', String(payload.full_details.age));
  fd.append(
    'full_details[family_size]',
    String(payload.full_details.family_size)
  );
  if (payload.full_details.health_condition) {
    fd.append(
      'full_details[health_condition]',
      payload.full_details.health_condition
    );
  }
  if (payload.full_details.income_source) {
    fd.append('full_details[income_source]', payload.full_details.income_source);
  }

  // Nested — contact_info
  fd.append('contact_info[whatsapp]', payload.contact_info.whatsapp);
  if (payload.contact_info.alt_phone) {
    fd.append('contact_info[alt_phone]', payload.contact_info.alt_phone);
  }

  // Nested — region_data
  fd.append('region_data[street]', payload.region_data.street);
  fd.append('region_data[building]', payload.region_data.building);

  return fd;
}

export default useHelpRequestForm;
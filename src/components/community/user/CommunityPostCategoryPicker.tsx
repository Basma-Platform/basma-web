import { useEffect, useState } from 'react';
import { categoryService } from '../../../services/categoryService';
import { selectStyle } from './CommunityPostFormShared';
import type { Category } from '../../../types';

interface CommunityPostCategoryPickerProps {
  value: number | null;
  onChange: (id: number | null) => void;
  error?: string | string[];
}

const CommunityPostCategoryPicker = ({
  value,
  onChange,
  error,
}: CommunityPostCategoryPickerProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const errorText = Array.isArray(error) ? error[0] : error;

  useEffect(() => {
    let mounted = true;
    categoryService
      .getCategories()
      .then((data) => {
        if (mounted) setCategories(data);
      })
      .catch(() => {
        /* silent */
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <select
        value={value ?? ''}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : null)
        }
        disabled={loading}
        style={{
          ...selectStyle,
          opacity: loading ? 0.6 : 1,
        }}
      >
        <option value="">{loading ? 'جاري التحميل...' : 'بدون تصنيف'}</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {errorText && (
        <p
          style={{
            color: '#DC3545',
            fontSize: '0.72rem',
            fontFamily: 'Cairo, sans-serif',
            marginTop: '5px',
            marginBottom: 0,
          }}
        >
          {errorText}
        </p>
      )}
    </div>
  );
};

export default CommunityPostCategoryPicker;
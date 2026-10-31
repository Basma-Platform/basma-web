import { useEffect, useState } from 'react';
import { regionService } from '../../../services/regionService';
import { selectStyle } from './CommunityPostFormShared';
import type { Governorate, City } from '../../../types';

interface CommunityPostRegionPickerProps {
  governorateId: number | null;
  cityId: number | null;
  onChangeGovernorate: (id: number | null) => void;
  onChangeCity: (id: number | null) => void;
  governorateError?: string | string[];
  cityError?: string | string[];
}

const CommunityPostRegionPicker = ({
  governorateId,
  cityId,
  onChangeGovernorate,
  onChangeCity,
  governorateError,
  cityError,
}: CommunityPostRegionPickerProps) => {
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  const govError = Array.isArray(governorateError)
    ? governorateError[0]
    : governorateError;
  const citError = Array.isArray(cityError) ? cityError[0] : cityError;

  // Fetch governorates once
  useEffect(() => {
    let mounted = true;
    regionService
      .getGovernorates()
      .then((data) => {
        if (mounted) setGovernorates(data);
      })
      .catch(() => {
        /* silent */
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch cities when governorate changes
  useEffect(() => {
    if (!governorateId) {
      setCities([]);
      return;
    }

    let mounted = true;
    setLoading(true);
    regionService
      .getCities(governorateId)
      .then((data) => {
        if (mounted) setCities(data);
      })
      .catch(() => {
        if (mounted) setCities([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [governorateId]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
      }}
    >
      {/* Governorate */}
      <div>
        <label
          style={{
            display: 'block',
            color: 'var(--text-secondary)',
            fontSize: '0.78rem',
            fontWeight: 800,
            fontFamily: 'Cairo, sans-serif',
            marginBottom: '6px',
          }}
        >
          المحافظة
        </label>
        <select
          value={governorateId ?? ''}
          onChange={(e) => {
            const id = e.target.value ? Number(e.target.value) : null;
            onChangeGovernorate(id);
            onChangeCity(null);
          }}
          style={selectStyle}
        >
          <option value="">اختر المحافظة</option>
          {governorates.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        {govError && (
          <p
            style={{
              color: '#DC3545',
              fontSize: '0.7rem',
              fontFamily: 'Cairo, sans-serif',
              marginTop: '5px',
              marginBottom: 0,
            }}
          >
            {govError}
          </p>
        )}
      </div>

      {/* City */}
      <div>
        <label
          style={{
            display: 'block',
            color: 'var(--text-secondary)',
            fontSize: '0.78rem',
            fontWeight: 800,
            fontFamily: 'Cairo, sans-serif',
            marginBottom: '6px',
          }}
        >
          المنطقة
        </label>
        <select
          value={cityId ?? ''}
          onChange={(e) =>
            onChangeCity(e.target.value ? Number(e.target.value) : null)
          }
          disabled={!governorateId || loading}
          style={{
            ...selectStyle,
            opacity: !governorateId || loading ? 0.55 : 1,
          }}
        >
          <option value="">
            {loading ? 'جاري التحميل...' : 'اختر المنطقة'}
          </option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {citError && (
          <p
            style={{
              color: '#DC3545',
              fontSize: '0.7rem',
              fontFamily: 'Cairo, sans-serif',
              marginTop: '5px',
              marginBottom: 0,
            }}
          >
            {citError}
          </p>
        )}
      </div>
    </div>
  );
};

export default CommunityPostRegionPicker;
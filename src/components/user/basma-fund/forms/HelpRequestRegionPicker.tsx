import { useEffect, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { regionService } from '../../../../services/regionService';
import { FUND_THEME } from '../../../../utils/helpRequestHelpers';
import type { Governorate, City } from '../../../../types';
import {
  FieldLabel,
  FieldError,
  inputStyle,
  FieldGrid,
} from './HelpRequestFormShared';

interface HelpRequestRegionPickerProps {
  governorateId: number | '';
  cityId: number | '';
  onChange: (payload: {
    governorateId: number | '';
    cityId: number | '';
  }) => void;
  errors?: { governorate_id?: string; city_id?: string };
}

/**
 * Public region picker (governorate + city).
 * Loads cities dynamically when governorate changes.
 *
 * ✅ Dropdown arrows hidden — cleaner RTL look.
 */
const HelpRequestRegionPicker = ({
  governorateId,
  cityId,
  onChange,
  errors,
}: HelpRequestRegionPickerProps) => {
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // ============================================
  // Load governorates once
  // ============================================
  useEffect(() => {
    let mounted = true;
    regionService
      .getGovernorates()
      .then((data) => {
        if (mounted) setGovernorates(data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // ============================================
  // Load cities when governorate changes
  // ============================================
  useEffect(() => {
    if (!governorateId) {
      setCities([]);
      return;
    }
    let mounted = true;
    setLoadingCities(true);
    regionService
      .getCities(Number(governorateId))
      .then((data) => {
        if (mounted) setCities(data);
      })
      .catch(() => {
        if (mounted) setCities([]);
      })
      .finally(() => {
        if (mounted) setLoadingCities(false);
      });
    return () => {
      mounted = false;
    };
  }, [governorateId]);

  const handleGovernorate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange({
      governorateId: val === '' ? '' : Number(val),
      cityId: '',
    });
  };

  const handleCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange({
      governorateId,
      cityId: val === '' ? '' : Number(val),
    });
  };

  // ============================================
  // Hide arrow — RTL-safe CSS
  // ============================================
  const selectStyle: React.CSSProperties = {
    ...inputStyle(false),
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: 'none',
    paddingLeft: '32px',
  };

  return (
    <FieldGrid columns={2}>
      <div>
        <FieldLabel required>المحافظة</FieldLabel>
        <select
          value={governorateId === '' ? '' : String(governorateId)}
          onChange={handleGovernorate}
          style={selectStyle}
        >
          <option value="">اختر المحافظة</option>
          {governorates.map((gov) => (
            <option key={gov.id} value={gov.id}>
              {gov.name}
            </option>
          ))}
        </select>
        <FieldError>{errors?.governorate_id}</FieldError>
      </div>

      <div>
        <FieldLabel required>المدينة / الحي</FieldLabel>
        <select
          value={cityId === '' ? '' : String(cityId)}
          onChange={handleCity}
          disabled={!governorateId || loadingCities}
          style={{
            ...selectStyle,
            opacity: !governorateId || loadingCities ? 0.6 : 1,
            cursor:
              !governorateId || loadingCities ? 'not-allowed' : 'pointer',
          }}
        >
          <option value="">
            {loadingCities
              ? 'جاري التحميل...'
              : !governorateId
              ? 'اختر المحافظة أولاً'
              : 'اختر المدينة/الحي'}
          </option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        <FieldError>{errors?.city_id}</FieldError>
      </div>

      {/* Hint */}
      <div
        style={{
          gridColumn: '1 / -1',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          borderRadius: '9px',
          backgroundColor: `${FUND_THEME.accent}08`,
          color: 'var(--text-muted)',
          fontSize: '0.72rem',
          fontWeight: 600,
          fontFamily: 'Cairo, sans-serif',
          lineHeight: 1.55,
        }}
      >
        <FaMapMarkerAlt size={11} color={FUND_THEME.accent} />
        المنطقة ظاهرة علناً (بدون العنوان التفصيلي) — العنوان يُحفظ مشفّراً.
      </div>
    </FieldGrid>
  );
};

export default HelpRequestRegionPicker;
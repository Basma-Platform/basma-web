import { Row, Col, Form, Button } from 'react-bootstrap';
import { FaFilter, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import type { Governorate, City } from '../../types';

interface AnnouncementFiltersProps {
  governorates: Governorate[];
  cities: City[];
  selectedGovernorate: string;
  selectedCity: string;
  selectedCategory: string;
  selectedType: string;
  selectedPriceType: string;
  onGovernorateChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onPriceTypeChange: (value: string) => void;
  onClearFilters: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  isLoggedIn?: boolean;
}

const AnnouncementFilters = ({
  governorates,
  cities,
  selectedGovernorate,
  selectedCity,
  selectedCategory,
  selectedType,
  selectedPriceType,
  onGovernorateChange,
  onCityChange,
  onCategoryChange,
  onTypeChange,
  onPriceTypeChange,
  onClearFilters,
  showFilters,
  onToggleFilters,
  isLoggedIn = false,
}: AnnouncementFiltersProps) => {
  const { isDark } = useTheme();

  // ✅ Dummy usage to prevent unused warning (will be used in Sprint 2 for auth)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // TODO: Sprint 2 - Use isLoggedIn to show/hide auth-specific filters
  if (isLoggedIn) {
    // This will be used for auth-specific filters in Sprint 2
    console.log('🔐 Auth mode: User is logged in - showing all filters');
  } else {
    console.log('👤 Guest mode: Showing public filters only');
  }

  const categories = [
    { value: '', label: 'الكل' },
    { value: 'goods', label: 'بضائع' },
    { value: 'service', label: 'خدمة' },
    { value: 'barter', label: 'مقايضة' },
  ];

  const types = [
    { value: '', label: 'الكل' },
    { value: 'offer', label: 'عرض' },
    { value: 'request', label: 'طلب' },
  ];

  const priceTypes = [
    { value: '', label: 'الكل' },
    { value: 'free', label: 'مجاني' },
    { value: 'paid', label: 'مدفوع' },
    { value: 'barter', label: 'مقايضة' },
  ];

  const hasActiveFilters = selectedGovernorate || selectedCity || selectedCategory || selectedType || selectedPriceType;

  return (
    <div>
      {/* Mobile Toggle */}
      <Button
        variant="outline-secondary"
        onClick={onToggleFilters}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          marginBottom: '16px',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(139,90,43,0.15)',
          color: isDark ? '#C49A6C' : '#6B4226',
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
          borderRadius: '12px',
          padding: '12px',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        <FaFilter />
        {showFilters ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}
        {hasActiveFilters && (
          <span
            style={{
              backgroundColor: '#E87A20',
              color: '#FFFFFF',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 'auto',
            }}
          >
            {[selectedGovernorate, selectedCity, selectedCategory, selectedType, selectedPriceType].filter(Boolean).length}
          </span>
        )}
      </Button>

      {/* Filters */}
      <div
        style={{
          display: showFilters ? 'block' : 'none',
          backgroundColor: isDark ? '#16213e' : '#FFFFFF',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.06)'}`,
        }}
      >
        <Row className="g-3">
          {/* Governorate */}
          <Col xs={12} md={6} lg={4}>
            <Form.Group>
              <Form.Label
                style={{
                  color: isDark ? '#C49A6C' : '#8B5A2B',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                المحافظة
              </Form.Label>
              <Form.Select
                value={selectedGovernorate}
                onChange={(e) => onGovernorateChange(e.target.value)}
                style={{
                  backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)',
                  color: isDark ? '#FDF5E6' : '#6B4226',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                <option value="">جميع المحافظات</option>
                {governorates.map((gov) => (
                  <option key={gov.id} value={gov.id}>
                    {gov.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* City */}
          <Col xs={12} md={6} lg={4}>
            <Form.Group>
              <Form.Label
                style={{
                  color: isDark ? '#C49A6C' : '#8B5A2B',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                المدينة / الحي
              </Form.Label>
              <Form.Select
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                disabled={!selectedGovernorate}
                style={{
                  backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)',
                  color: isDark ? '#FDF5E6' : '#6B4226',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontFamily: 'Cairo, sans-serif',
                  opacity: !selectedGovernorate ? 0.6 : 1,
                }}
              >
                <option value="">جميع المدن</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Category */}
          <Col xs={12} md={6} lg={4}>
            <Form.Group>
              <Form.Label
                style={{
                  color: isDark ? '#C49A6C' : '#8B5A2B',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                الفئة
              </Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                style={{
                  backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)',
                  color: isDark ? '#FDF5E6' : '#6B4226',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Type */}
          <Col xs={12} md={6} lg={4}>
            <Form.Group>
              <Form.Label
                style={{
                  color: isDark ? '#C49A6C' : '#8B5A2B',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                النوع
              </Form.Label>
              <Form.Select
                value={selectedType}
                onChange={(e) => onTypeChange(e.target.value)}
                style={{
                  backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)',
                  color: isDark ? '#FDF5E6' : '#6B4226',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                {types.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Price Type */}
          <Col xs={12} md={6} lg={4}>
            <Form.Group>
              <Form.Label
                style={{
                  color: isDark ? '#C49A6C' : '#8B5A2B',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                نوع الدفع
              </Form.Label>
              <Form.Select
                value={selectedPriceType}
                onChange={(e) => onPriceTypeChange(e.target.value)}
                style={{
                  backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)',
                  color: isDark ? '#FDF5E6' : '#6B4226',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                {priceTypes.map((pt) => (
                  <option key={pt.value} value={pt.value}>
                    {pt.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Clear Filters */}
          <Col xs={12}>
            <Button
              variant="link"
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
              style={{
                color: '#E87A20',
                textDecoration: 'none',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 600,
                fontSize: '0.9rem',
                opacity: hasActiveFilters ? 1 : 0.4,
                cursor: hasActiveFilters ? 'pointer' : 'default',
              }}
            >
              <FaTimes style={{ marginLeft: '6px' }} />
              مسح جميع الفلاتر
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AnnouncementFilters;
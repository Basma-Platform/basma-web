import { Row, Col, Form, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import type { Governorate, City, UserContext } from '../../types';

interface AnnouncementFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  governorates: Governorate[];
  cities: City[];
  selectedGovernorate: string;
  setSelectedGovernorate: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedPriceType: string;
  setSelectedPriceType: (value: string) => void;
  selectedPrivacyType: string;
  setSelectedPrivacyType: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  userContext: UserContext | null;
  isLoggedIn: boolean;
  privacyOptions: { value: string; label: string; available: boolean }[];
}

const AnnouncementFilters = ({
  showFilters,
  setShowFilters,
  governorates,
  cities,
  selectedGovernorate,
  setSelectedGovernorate,
  selectedCity,
  setSelectedCity,
  selectedType,
  setSelectedType,
  selectedPriceType,
  setSelectedPriceType,
  selectedPrivacyType,
  setSelectedPrivacyType,
  hasActiveFilters,
  onClearFilters,
  userContext,
  isLoggedIn,
  privacyOptions,
}: AnnouncementFiltersProps) => {
  const typeOptions = [
    { value: '', label: 'جميع الأنواع' },
    { value: 'offer', label: 'عرض' },
    { value: 'request', label: 'طلب' },
  ];

  const priceOptions = [
    { value: '', label: 'جميع طرق الدفع' },
    { value: 'free', label: 'مجاني' },
    { value: 'paid', label: 'مدفوع' },
    { value: 'barter', label: 'مقايضة' },
  ];

  // Determine which filters are available based on user_context
  const canFilterByGovernorate = userContext?.available_filters?.governorate_id !== false;
  const canFilterByCity = userContext?.available_filters?.city_id !== false;
  const canFilterByType = userContext?.available_filters?.type !== false;
  const canFilterByPaymentType = userContext?.available_filters?.payment_type !== false;
  const canFilterByPrivacy = userContext?.available_filters?.privacy_type === true && isLoggedIn;

  // Filter privacy options to only show available ones
  const availablePrivacyOptions = privacyOptions.filter(opt => opt.available);

  // Count how many filters are visible
  let visibleFilterCount = 0;
  if (canFilterByGovernorate) visibleFilterCount++;
  if (canFilterByCity) visibleFilterCount++;
  if (canFilterByType) visibleFilterCount++;
  if (canFilterByPaymentType) visibleFilterCount++;
  if (canFilterByPrivacy && availablePrivacyOptions.length > 0) visibleFilterCount++;

  // Calculate column size
  let colSize = 12;
  let isFiveFilters = false;

  if (visibleFilterCount === 1) colSize = 12;
  else if (visibleFilterCount === 2) colSize = 6;
  else if (visibleFilterCount === 3) colSize = 4;
  else if (visibleFilterCount === 4) colSize = 3;
  else if (visibleFilterCount === 5) {
    colSize = 3;
    isFiveFilters = true;
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 12px var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* ============================================ */}
      {/* FILTERS TOGGLE ROW */}
      {/* ============================================ */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            variant={hasActiveFilters ? 'primary' : 'outline-secondary'}
            onClick={() => setShowFilters(!showFilters)}
            style={{
              borderRadius: '12px',
              height: '44px',
              padding: '0 18px',
              backgroundColor: hasActiveFilters ? 'var(--primary-orange)' : 'transparent',
              borderColor: hasActiveFilters ? 'var(--primary-orange)' : 'var(--border-color)',
              color: hasActiveFilters ? '#FFFFFF' : 'var(--text-secondary)',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <FaFilter size={14} /> 
            {hasActiveFilters ? 'تعديل الفلاتر' : 'إظهار الفلاتر'}
            {hasActiveFilters && (
              <span
                style={{
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  padding: '0 8px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >
                {[selectedGovernorate, selectedCity, selectedType, selectedPriceType, selectedPrivacyType].filter(Boolean).length}
              </span>
            )}
            {showFilters ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="link"
              onClick={onClearFilters}
              style={{
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.8rem',
                padding: '4px 8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#DC3545';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <FaTimes size={12} style={{ marginLeft: '4px' }} /> مسح الكل
            </Button>
          )}
        </div>

        {/* Active filters summary - Enhanced */}
        {hasActiveFilters && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {selectedGovernorate && (
              <span
                style={{
                  backgroundColor: 'rgba(232,122,32,0.12)',
                  color: 'var(--primary-orange)',
                  padding: '2px 12px',
                  borderRadius: '14px',
                  fontSize: '0.7rem',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 600,
                }}
              >
                {governorates.find(g => g.id === Number(selectedGovernorate))?.name}
              </span>
            )}
            {selectedCity && (
              <span
                style={{
                  backgroundColor: 'rgba(232,122,32,0.12)',
                  color: 'var(--primary-orange)',
                  padding: '2px 12px',
                  borderRadius: '14px',
                  fontSize: '0.7rem',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 600,
                }}
              >
                {cities.find(c => c.id === Number(selectedCity))?.name}
              </span>
            )}
            {selectedType && (
              <span
                style={{
                  backgroundColor: 'rgba(232,122,32,0.12)',
                  color: 'var(--primary-orange)',
                  padding: '2px 12px',
                  borderRadius: '14px',
                  fontSize: '0.7rem',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 600,
                }}
              >
                {typeOptions.find(t => t.value === selectedType)?.label}
              </span>
            )}
            {selectedPriceType && (
              <span
                style={{
                  backgroundColor: 'rgba(232,122,32,0.12)',
                  color: 'var(--primary-orange)',
                  padding: '2px 12px',
                  borderRadius: '14px',
                  fontSize: '0.7rem',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 600,
                }}
              >
                {priceOptions.find(p => p.value === selectedPriceType)?.label}
              </span>
            )}
            {selectedPrivacyType && isLoggedIn && (
              <span
                style={{
                  backgroundColor: 'rgba(232,122,32,0.12)',
                  color: 'var(--primary-orange)',
                  padding: '2px 12px',
                  borderRadius: '14px',
                  fontSize: '0.7rem',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 600,
                }}
              >
                {availablePrivacyOptions.find(p => p.value === selectedPrivacyType)?.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* FILTERS DROPDOWNS */}
      {/* ============================================ */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <Row className="g-2">
                {/* Governorate Filter */}
                {canFilterByGovernorate && (
                  <Col xs={12} sm={colSize} lg={isFiveFilters ? 2 : colSize} style={isFiveFilters ? { flex: '0 0 20%', maxWidth: '20%' } : {}}>
                    <Form.Select
                      value={selectedGovernorate}
                      onChange={(e) => setSelectedGovernorate(e.target.value)}
                      style={{
                        borderRadius: '10px',
                        height: '42px',
                        backgroundColor: 'var(--bg-input)',
                        borderColor: selectedGovernorate ? 'var(--primary-orange)' : 'var(--border-color)',
                        color: 'var(--text-primary)',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '0.85rem',
                        width: '100%',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <option value="">جميع المحافظات</option>
                      {governorates.map(gov => (
                        <option key={gov.id} value={gov.id}>{gov.name}</option>
                      ))}
                    </Form.Select>
                  </Col>
                )}

                {/* City Filter */}
                {canFilterByCity && (
                  <Col xs={12} sm={colSize} lg={isFiveFilters ? 2 : colSize} style={isFiveFilters ? { flex: '0 0 20%', maxWidth: '20%' } : {}}>
                    <Form.Select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      disabled={!selectedGovernorate}
                      style={{
                        borderRadius: '10px',
                        height: '42px',
                        backgroundColor: 'var(--bg-input)',
                        borderColor: selectedCity ? 'var(--primary-orange)' : 'var(--border-color)',
                        color: 'var(--text-primary)',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '0.85rem',
                        opacity: selectedGovernorate ? 1 : 0.6,
                        width: '100%',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <option value="">جميع الأحياء\المدن</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </Form.Select>
                  </Col>
                )}

                {/* Type Filter */}
                {canFilterByType && (
                  <Col xs={12} sm={colSize} lg={isFiveFilters ? 2 : colSize} style={isFiveFilters ? { flex: '0 0 20%', maxWidth: '20%' } : {}}>
                    <Form.Select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      style={{
                        borderRadius: '10px',
                        height: '42px',
                        backgroundColor: 'var(--bg-input)',
                        borderColor: selectedType ? 'var(--primary-orange)' : 'var(--border-color)',
                        color: 'var(--text-primary)',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '0.85rem',
                        width: '100%',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {typeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Form.Select>
                  </Col>
                )}

                {/* Payment Type Filter */}
                {canFilterByPaymentType && (
                  <Col xs={12} sm={colSize} lg={isFiveFilters ? 2 : colSize} style={isFiveFilters ? { flex: '0 0 20%', maxWidth: '20%' } : {}}>
                    <Form.Select
                      value={selectedPriceType}
                      onChange={(e) => setSelectedPriceType(e.target.value)}
                      style={{
                        borderRadius: '10px',
                        height: '42px',
                        backgroundColor: 'var(--bg-input)',
                        borderColor: selectedPriceType ? 'var(--primary-orange)' : 'var(--border-color)',
                        color: 'var(--text-primary)',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '0.85rem',
                        width: '100%',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {priceOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Form.Select>
                  </Col>
                )}

                {/* Privacy Filter */}
                {canFilterByPrivacy && availablePrivacyOptions.length > 0 && (
                  <Col xs={12} sm={colSize} lg={isFiveFilters ? 2 : colSize} style={isFiveFilters ? { flex: '0 0 20%', maxWidth: '20%' } : {}}>
                    <Form.Select
                      value={selectedPrivacyType}
                      onChange={(e) => setSelectedPrivacyType(e.target.value)}
                      style={{
                        borderRadius: '10px',
                        height: '42px',
                        backgroundColor: 'var(--bg-input)',
                        borderColor: selectedPrivacyType ? 'var(--primary-orange)' : 'var(--border-color)',
                        color: 'var(--text-primary)',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '0.85rem',
                        width: '100%',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <option value="">🔒 جميع الخصوصية</option>
                      {availablePrivacyOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Form.Select>
                  </Col>
                )}
              </Row>

              {/* Quick tip */}
              <div style={{ marginTop: '0.75rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: 'Cairo, sans-serif', opacity: 0.6 }}>
                يمكنك اختيار أكثر من فئة فرعية من الأسفل
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnnouncementFilters;
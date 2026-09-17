import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaFilter, FaTimes, FaChevronDown, FaChevronUp, 
  FaSearch, FaList, FaThLarge 
} from 'react-icons/fa';
import type { Governorate, City, UserContext } from '../../types';

interface AnnouncementFiltersProps {
  // Search
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isSearching: boolean;
  
  // Sort
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOptions: { value: string; label: string }[];
  
  // View Mode
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
  
  // Filters
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
  searchTerm,
  setSearchTerm,
  isSearching,
  sortBy,
  setSortBy,
  sortOptions,
  viewMode,
  setViewMode,
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

  // ✅ تسميات الخصوصية المطلوبة
  const privacyLabels: Record<string, string> = {
    'public': 'عام - للجميع',
    'region_only': 'نفس المنطقة فقط',
    'verified_only': 'للموثقين الهوية فقط',
    'verified_region': 'موثق الهوية + نفس المنطقة',
  };

  const canFilterByGovernorate = userContext?.available_filters?.governorate_id !== false;
  const canFilterByCity = userContext?.available_filters?.city_id !== false;
  const canFilterByType = userContext?.available_filters?.type !== false;
  const canFilterByPaymentType = userContext?.available_filters?.payment_type !== false;
  const canFilterByPrivacy = userContext?.available_filters?.privacy_type === true && isLoggedIn;

  const availablePrivacyOptions = privacyOptions.filter(opt => opt.available);

  let visibleFilterCount = 0;
  if (canFilterByGovernorate) visibleFilterCount++;
  if (canFilterByCity) visibleFilterCount++;
  if (canFilterByType) visibleFilterCount++;
  if (canFilterByPaymentType) visibleFilterCount++;
  if (canFilterByPrivacy && availablePrivacyOptions.length > 0) visibleFilterCount++;

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
      {/* SEARCH + SORT + FILTER BUTTON + VIEW MODE */}
      <Row className="align-items-center g-2">
        {/* Search */}
        <Col xs={12} md={6} lg={7}>
          <div style={{ position: 'relative' }}>
            <FaSearch 
              style={{ 
                position: 'absolute', 
                right: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--text-muted)', 
                opacity: 0.6, 
                fontSize: '0.9rem' 
              }} 
            />
            <Form.Control
              type="text"
              placeholder="ابحث عن إعلان، خدمة، أو سلعة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                paddingRight: '40px',
                paddingLeft: '40px',
                borderRadius: '12px',
                height: '44px',
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
                fontFamily: 'Cairo, sans-serif',
                transition: 'all 0.3s ease',
                fontSize: '0.95rem',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-orange)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,122,32,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <style>{`
              input::placeholder {
                color: var(--text-muted) !important;
                opacity: 0.7 !important;
                font-family: 'Cairo', sans-serif;
              }
              [data-theme="dark"] input::placeholder {
                color: #a08070 !important;
                opacity: 0.8 !important;
              }
            `}</style>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.1)';
                  e.currentTarget.style.color = '#DC3545';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                <FaTimes />
              </button>
            )}
            {isSearching && searchTerm && (
              <div style={{ position: 'absolute', left: '45px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Spinner animation="border" size="sm" style={{ color: 'var(--primary-orange)', width: '16px', height: '16px' }} />
              </div>
            )}
          </div>
        </Col>

        {/* Sort + Filter Button + View Mode */}
        <Col xs={12} md={6} lg={5}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: 'auto',
                minWidth: '120px',
                flex: '1 1 auto',
                borderRadius: '12px',
                height: '44px',
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Form.Select>

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
              {showFilters ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}
              {hasActiveFilters && (
                <span
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    borderRadius: '50%',
                    padding: '0 6px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}
                >
                  {[selectedGovernorate, selectedCity, selectedType, selectedPriceType, selectedPrivacyType].filter(Boolean).length}
                </span>
              )}
              {showFilters ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </Button>

            <div 
              className="view-mode-toggle" 
              style={{ 
                display: 'flex', 
                borderRadius: '12px', 
                border: '1px solid var(--border-color)', 
                overflow: 'hidden', 
                height: '44px' 
              }}
            >
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '0 14px',
                  border: 'none',
                  background: viewMode === 'list' ? 'var(--primary-orange)' : 'transparent',
                  color: viewMode === 'list' ? '#FFFFFF' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  if (viewMode !== 'list') {
                    e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.08)';
                    e.currentTarget.style.color = 'var(--primary-orange)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (viewMode !== 'list') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                <FaList size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '0 14px',
                  border: 'none',
                  background: viewMode === 'grid' ? 'var(--primary-orange)' : 'transparent',
                  color: viewMode === 'grid' ? '#FFFFFF' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  if (viewMode !== 'grid') {
                    e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.08)';
                    e.currentTarget.style.color = 'var(--primary-orange)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (viewMode !== 'grid') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                <FaThLarge size={16} />
              </button>
            </div>
          </div>
        </Col>
      </Row>

      {/* FILTERS PANEL */}
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
                      <option value="">جميع المدن والأحياء</option>
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
                      <option value="">جميع خيارات الخصوصية</option>
                      {availablePrivacyOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {privacyLabels[opt.value] || opt.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                )}
              </Row>

              {/* Clear Filters + Quick Tip */}
              <div style={{ 
                marginTop: '0.75rem', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
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
                    <FaTimes size={12} style={{ marginLeft: '4px' }} /> مسح جميع الفلاتر
                  </Button>
                )}
                <div style={{ 
                  color: 'var(--text-muted)', 
                  fontSize: '0.7rem', 
                  fontFamily: 'Cairo, sans-serif', 
                  opacity: 0.6,
                  textAlign: 'center',
                }}>
                  يمكنك اختيار أكثر من فئة فرعية من الأسفل
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 767px) {
          .view-mode-toggle {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AnnouncementFilters;
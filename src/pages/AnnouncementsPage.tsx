import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { announcementService } from '../services/announcementService';
import { regionService } from '../services/regionService';
import AnnouncementPost from '../components/announcements/AnnouncementPost';
import AnnouncementPostSkeleton from '../components/announcements/AnnouncementPostSkeleton';
import AnnouncementCardSkeleton from '../components/announcements/AnnouncementCardSkeleton';
import SEO from '../components/SEO';
import type { Announcement, Governorate, City } from '../types';
import { 
  FaSearch, FaFilter, FaTimes,
  FaChevronDown, FaChevronUp,
  FaThLarge, FaList
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AnnouncementsPage = () => {
  const { isAuthenticated } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  // Filters
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPriceType, setSelectedPriceType] = useState('');

  const observerRef = useRef<HTMLDivElement | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLoggedIn = isAuthenticated;

  // Debounce search
  useEffect(() => {
    setIsSearching(true);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, 500);
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  // Fetch governorates
  useEffect(() => {
    const fetchGovernorates = async () => {
      try {
        const data = await regionService.getGovernorates();
        setGovernorates(data);
      } catch (error) {
        console.error('Error fetching governorates:', error);
      }
    };
    fetchGovernorates();
  }, []);

  // Fetch cities when governorate changes
  useEffect(() => {
    if (selectedGovernorate) {
      const fetchCities = async () => {
        try {
          const data = await regionService.getCities(Number(selectedGovernorate));
          setCities(data);
          setSelectedCity('');
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      };
      fetchCities();
    } else {
      setCities([]);
      setSelectedCity('');
    }
  }, [selectedGovernorate]);

  // Fetch announcements
  const fetchAnnouncements = useCallback(async (page: number, reset: boolean = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params: any = {
        page,
        search: debouncedSearchTerm || undefined,
        governorate_id: selectedGovernorate || undefined,
        city_id: selectedCity ? Number(selectedCity) : undefined,
        category: selectedCategory || undefined,
        type: selectedType || undefined,
        payment_type: selectedPriceType || undefined,
        sort: sortBy,
      };

      const response = await announcementService.getPublicAnnouncements(params);
      
      if (reset) {
        setAnnouncements(response.data);
      } else {
        setAnnouncements(prev => [...prev, ...response.data]);
      }
      
      setTotal(response.total);
      setHasMore(page < response.last_page);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearchTerm, selectedGovernorate, selectedCity, selectedCategory, selectedType, selectedPriceType, sortBy]);

  // Initial fetch & when debounced search changes
  useEffect(() => {
    setCurrentPage(1);
    fetchAnnouncements(1, true);
  }, [fetchAnnouncements]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchAnnouncements(1, true);
  }, [selectedGovernorate, selectedCity, selectedCategory, selectedType, selectedPriceType, sortBy]);

  // Infinite scroll observer
  useEffect(() => {
    if (!observerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading && !isSearching) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          fetchAnnouncements(nextPage, false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, isSearching, currentPage, fetchAnnouncements]);

  const handleClearFilters = () => {
    setSelectedGovernorate('');
    setSelectedCity('');
    setSelectedCategory('');
    setSelectedType('');
    setSelectedPriceType('');
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSortBy('newest');
  };

  const hasActiveFilters = selectedGovernorate || selectedCity || selectedCategory || selectedType || selectedPriceType;

  const filterOptions = [
    { value: '', label: 'جميع الفئات' },
    { value: 'goods', label: 'بضائع' },
    { value: 'service', label: 'خدمة' },
    { value: 'barter', label: 'مقايضة' },
  ];

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

  const sortOptions = [
    { value: 'newest', label: 'الأحدث' },
    { value: 'oldest', label: 'الأقدم' },
    { value: 'most_viewed', label: 'الأكثر مشاهدة' },
  ];

  const showSkeletons = loading || isSearching;

  const getSkeletonCount = () => {
    if (viewMode === 'list') return 3;
    return 8;
  };

  const renderSkeletons = () => {
    if (viewMode === 'list') {
      return Array.from({ length: 3 }).map((_, index) => (
        <AnnouncementPostSkeleton key={`skeleton-${index}`} />
      ));
    } else {
      const count = getSkeletonCount();
      return (
        <Row className="g-3">
          {Array.from({ length: count }).map((_, index) => (
            <Col key={`skeleton-${index}`} xs={12} sm={6} lg={4} xl={3}>
              <AnnouncementCardSkeleton />
            </Col>
          ))}
        </Row>
      );
    }
  };

  const renderAnnouncements = () => {
    if (viewMode === 'list') {
      return announcements.map((announcement, index) => (
        <motion.div
          key={announcement.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(index * 0.05, 0.5) }}
        >
          <AnnouncementPost
            announcement={announcement}
            isLoggedIn={isLoggedIn}
            viewMode={viewMode}
          />
        </motion.div>
      ));
    } else {
      return (
        <Row className="g-3">
          {announcements.map((announcement, index) => (
            <Col 
              key={announcement.id} 
              xs={12} sm={6} lg={4} xl={3}
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.5) }}
            >
              <AnnouncementPost
                announcement={announcement}
                isLoggedIn={isLoggedIn}
                viewMode={viewMode}
              />
            </Col>
          ))}
        </Row>
      );
    }
  };

  return (
    <>
      <SEO title="الإعلانات" description="تصفح جميع الإعلانات على منصة بصمة" />
      <div style={{ paddingTop: '80px', paddingBottom: '60px', backgroundColor: 'var(--bg-body)', minHeight: '100vh', transition: 'background-color 0.3s ease' }}>
        <Container>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-4">
            <div style={{ width: '50px', height: '4px', backgroundColor: 'var(--primary-orange)', borderRadius: '2px', margin: '0 auto 0.75rem' }} />
            <h1 style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1.8rem, 2.5vw, 2.4rem)', fontWeight: 900, fontFamily: 'Cairo, sans-serif', marginBottom: '0.25rem' }}>الإعلانات</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontFamily: 'Cairo, sans-serif' }}>استعرض أحدث الإعلانات من مجتمعك</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '1rem 1.25rem', marginBottom: '1.5rem', boxShadow: '0 2px 12px var(--shadow-sm)', border: '1px solid var(--border-color)', transition: 'all 0.3s ease' }}>
            <Row className="align-items-center g-2">
              <Col xs={12} md={6} lg={5}>
                <div style={{ position: 'relative' }}>
                  <FaSearch style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', opacity: 0.6, fontSize: '0.9rem' }} />
                  <Form.Control type="text" placeholder="ابحث في الإعلانات..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ paddingRight: '40px', paddingLeft: '40px', borderRadius: '12px', height: '44px', backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', fontFamily: 'Cairo, sans-serif', transition: 'all 0.3s ease' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary-orange)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,122,32,0.1)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                  {searchTerm && <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', fontSize: '0.8rem' }}><FaTimes /></button>}
                  {isSearching && searchTerm && <div style={{ position: 'absolute', left: '40px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '4px' }}><Spinner animation="border" size="sm" style={{ color: 'var(--primary-orange)', width: '14px', height: '14px' }} /></div>}
                </div>
              </Col>

              <Col xs={12} md={6} lg={7}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: 'auto', minWidth: '120px', flex: '1 1 auto', borderRadius: '12px', height: '44px', backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', fontFamily: 'Cairo, sans-serif', fontSize: '0.85rem' }}>
                    {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </Form.Select>

                  <Button variant={hasActiveFilters ? 'primary' : 'outline-secondary'} onClick={() => setShowFilters(!showFilters)} style={{ borderRadius: '12px', height: '44px', padding: '0 18px', backgroundColor: hasActiveFilters ? 'var(--primary-orange)' : 'transparent', borderColor: hasActiveFilters ? 'var(--primary-orange)' : 'var(--border-color)', color: hasActiveFilters ? '#FFFFFF' : 'var(--text-secondary)', fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                    <FaFilter size={14} /> الفلاتر
                    {hasActiveFilters && <span style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '50%', padding: '0 6px', fontSize: '0.7rem', fontWeight: 700 }}>{[selectedGovernorate, selectedCity, selectedCategory, selectedType, selectedPriceType].filter(Boolean).length}</span>}
                    {showFilters ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                  </Button>

                  <div className="view-mode-toggle" style={{ display: 'flex', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', height: '44px' }}>
                    <button onClick={() => setViewMode('list')} style={{ padding: '0 14px', border: 'none', background: viewMode === 'list' ? 'var(--primary-orange)' : 'transparent', color: viewMode === 'list' ? '#FFFFFF' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center' }}><FaList size={16} /></button>
                    <button onClick={() => setViewMode('grid')} style={{ padding: '0 14px', border: 'none', background: viewMode === 'grid' ? 'var(--primary-orange)' : 'transparent', color: viewMode === 'grid' ? '#FFFFFF' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center' }}><FaThLarge size={16} /></button>
                  </div>
                </div>
              </Col>
            </Row>

            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                  <div style={{ paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <Row className="g-2">
                      <Col xs={12} sm={6} lg={3}>
                        <Form.Select value={selectedGovernorate} onChange={(e) => setSelectedGovernorate(e.target.value)} style={{ borderRadius: '10px', height: '42px', backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', fontFamily: 'Cairo, sans-serif', fontSize: '0.85rem' }}>
                          <option value="">جميع المحافظات</option>
                          {governorates.map(gov => <option key={gov.id} value={gov.id}>{gov.name}</option>)}
                        </Form.Select>
                      </Col>
                      <Col xs={12} sm={6} lg={3}>
                        <Form.Select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedGovernorate} style={{ borderRadius: '10px', height: '42px', backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', fontFamily: 'Cairo, sans-serif', fontSize: '0.85rem', opacity: selectedGovernorate ? 1 : 0.6 }}>
                          <option value="">جميع المدن</option>
                          {cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
                        </Form.Select>
                      </Col>
                      <Col xs={12} sm={6} lg={2}>
                        <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ borderRadius: '10px', height: '42px', backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', fontFamily: 'Cairo, sans-serif', fontSize: '0.85rem' }}>
                          {filterOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </Form.Select>
                      </Col>
                      <Col xs={12} sm={6} lg={2}>
                        <Form.Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={{ borderRadius: '10px', height: '42px', backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', fontFamily: 'Cairo, sans-serif', fontSize: '0.85rem' }}>
                          {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </Form.Select>
                      </Col>
                      <Col xs={12} sm={6} lg={2}>
                        <Form.Select value={selectedPriceType} onChange={(e) => setSelectedPriceType(e.target.value)} style={{ borderRadius: '10px', height: '42px', backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', fontFamily: 'Cairo, sans-serif', fontSize: '0.85rem' }}>
                          {priceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </Form.Select>
                      </Col>
                    </Row>
                    {hasActiveFilters && <div style={{ marginTop: '0.75rem', textAlign: 'center' }}><Button variant="link" onClick={handleClearFilters} style={{ color: 'var(--primary-orange)', textDecoration: 'none', fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '0.85rem' }}><FaTimes style={{ marginLeft: '6px' }} /> مسح جميع الفلاتر</Button></div>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 4px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'Cairo, sans-serif' }}>
              {!showSkeletons && <> عرض {announcements.length} من {total} إعلان {searchTerm && ` (نتائج البحث: "${searchTerm}")`}</>}
              {isSearching && searchTerm && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Spinner animation="border" size="sm" style={{ color: 'var(--primary-orange)', width: '14px', height: '14px' }} /> جاري البحث...</span>}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: viewMode === 'list' ? '1.25rem' : '0', maxWidth: viewMode === 'list' ? '820px' : '100%', margin: '0 auto' }}>
            {showSkeletons ? (
              renderSkeletons()
            ) : announcements.length > 0 ? (
              <>
                {renderAnnouncements()}
                <div ref={observerRef} style={{ height: '20px' }} />
                {loadingMore && <div style={{ textAlign: 'center', padding: '1.5rem' }}><Spinner animation="border" style={{ color: 'var(--primary-orange)', width: '2rem', height: '2rem' }} /><p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontFamily: 'Cairo, sans-serif', fontSize: '0.85rem' }}>جاري تحميل المزيد...</p></div>}
                {!hasMore && announcements.length > 0 && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontFamily: 'Cairo, sans-serif', fontSize: '0.9rem' }}><div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏁</div><p>لقد وصلت إلى نهاية الإعلانات</p></div>}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <h3 style={{ color: 'var(--text-secondary)', fontFamily: 'Cairo, sans-serif', marginBottom: '0.5rem' }}>لا توجد إعلانات</h3>
                <p style={{ color: 'var(--text-muted)', fontFamily: 'Cairo, sans-serif' }}>{searchTerm ? 'لم نعثر على إعلانات تطابق بحثك. حاول تغيير كلمات البحث.' : 'لا توجد إعلانات متاحة حالياً. تابعنا للمزيد!'}</p>
                {searchTerm && <Button onClick={() => setSearchTerm('')} style={{ backgroundColor: 'var(--primary-orange)', borderColor: 'var(--primary-orange)', color: '#FFFFFF', borderRadius: '12px', padding: '8px 24px', fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>مسح البحث</Button>}
              </div>
            )}
          </div>
        </Container>
      </div>

      <style>{`@media (max-width: 767px) { .view-mode-toggle { display: none !important; } }`}</style>
    </>
  );
};

export default AnnouncementsPage;
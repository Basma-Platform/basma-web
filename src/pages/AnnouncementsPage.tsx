import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { announcementService } from '../services/announcementService';
import { regionService } from '../services/regionService';
import AnnouncementPost from '../components/announcements/AnnouncementPost';
import AnnouncementPostSkeleton from '../components/announcements/AnnouncementPostSkeleton';
import AnnouncementCardSkeleton from '../components/announcements/AnnouncementCardSkeleton';
import SubCategorySelector from '../components/announcements/SubCategorySelector';
import AnnouncementFilters from '../components/announcements/AnnouncementFilters';
import SEO from '../components/SEO';
import type { Announcement, Governorate, City, SubCategory, UserContext } from '../types';
import { motion } from 'framer-motion';

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
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [privacyOptions, setPrivacyOptions] = useState<{ value: string; label: string; available: boolean }[]>([]);

  // Sub-category state
  const [subCategories, setSubCategories] = useState<{ goods: SubCategory[]; services: SubCategory[] }>({
    goods: [],
    services: [],
  });
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'goods' | 'services' | null>(null);

  // Filters
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPriceType, setSelectedPriceType] = useState('');
  const [selectedPrivacyType, setSelectedPrivacyType] = useState('');

  const observerRef = useRef<HTMLDivElement | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subCategoryDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLoggedIn = isAuthenticated;

  // ============================================
  // Fetch Filters (including sub-categories and user_context)
  // ============================================
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await announcementService.getFilters();
        if (response.success && response.data) {
          setSubCategories(response.data.sub_categories);
          setPrivacyOptions(response.data.privacy_types || []);
          if (response.user_context) {
            setUserContext(response.user_context);
          }
        }
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
  }, []);

  // ============================================
  // Fetch governorates
  // ============================================
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

  // ============================================
  // Fetch announcements
  // ============================================
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
        type: selectedType || undefined,
        payment_type: selectedPriceType || undefined,
        privacy_type: selectedPrivacyType || undefined,
        sort: sortBy,
      };

      // Add category filter if selected (from SubCategorySelector)
      if (selectedCategory) {
        params.category = selectedCategory;
      }

      // Add sub-category filter as array
      if (selectedSubCategories.length > 0) {
        params.sub_category_id = selectedSubCategories;
      }

      const response = await announcementService.getPublicAnnouncements(params);
      
      if (reset) {
        setAnnouncements(response.data);
      } else {
        setAnnouncements(prev => [...prev, ...response.data]);
      }
      
      setTotal(response.meta?.total || response.data.length);
      setHasMore(page < (response.meta?.last_page || 1));

      // Update sub-categories from response
      if (response.filters?.sub_categories) {
        setSubCategories(response.filters.sub_categories);
      }

      // Update user context from response
      if (response.user_context) {
        setUserContext(response.user_context);
      }

    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearchTerm, selectedGovernorate, selectedCity, selectedType, selectedPriceType, selectedPrivacyType, sortBy, selectedCategory, selectedSubCategories]);

  // ============================================
  // DEBOUNCED SUB-CATEGORY FETCH
  // ============================================
  const debouncedFetchAnnouncements = useCallback((page: number, reset: boolean = false) => {
    if (subCategoryDebounceRef.current) {
      clearTimeout(subCategoryDebounceRef.current);
    }

    subCategoryDebounceRef.current = setTimeout(() => {
      fetchAnnouncements(page, reset);
    }, 400);
  }, [fetchAnnouncements]);

  // ============================================
  // Effects that trigger fetches
  // ============================================

  // Initial fetch
  useEffect(() => {
    setCurrentPage(1);
    fetchAnnouncements(1, true);
  }, []);

  // Reset page when filters change (except sub-categories - handled separately)
  useEffect(() => {
    setCurrentPage(1);
    fetchAnnouncements(1, true);
  }, [selectedGovernorate, selectedCity, selectedType, selectedPriceType, selectedPrivacyType, sortBy, selectedCategory]);

  // ============================================
  // SUB-CATEGORY CHANGE - Uses debounced fetch
  // ============================================
  useEffect(() => {
    setCurrentPage(1);
    debouncedFetchAnnouncements(1, true);
  }, [selectedSubCategories, debouncedFetchAnnouncements]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (subCategoryDebounceRef.current) {
        clearTimeout(subCategoryDebounceRef.current);
      }
    };
  }, []);

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

  // ============================================
  // Handlers
  // ============================================

  const handleSubCategoryToggle = (id: number) => {
    setSelectedSubCategories((prev) =>
      prev.includes(id)
        ? prev.filter((subId) => subId !== id)
        : [...prev, id]
    );
  };

  // ✅ إصلاح: مسح الفئات الفرعية عند تغيير الفئة الرئيسية
  const handleCategorySelect = (category: 'goods' | 'services' | null) => {
    setSelectedCategory(category);
    setSelectedSubCategories([]); // ✅ مسح الفئات الفرعية
  };

  const handleClearFilters = () => {
    setSelectedGovernorate('');
    setSelectedCity('');
    setSelectedType('');
    setSelectedPriceType('');
    setSelectedPrivacyType('');
    setSelectedSubCategories([]);
    setSelectedCategory(null);
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSortBy('newest');
  };

  // ✅ إصلاح: إزالة selectedCategory و selectedSubCategories من hasActiveFilters
  // لأنها تعرض في SubCategorySelector وليس في زر الفلاتر
  const hasActiveFilters = Boolean(
    selectedGovernorate || 
    selectedCity || 
    selectedType || 
    selectedPriceType || 
    selectedPrivacyType
  );

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

          {/* ============================================ */}
          {/* SEARCH + FILTERS - مكون واحد */}
          {/* ============================================ */}
          <AnnouncementFilters
            // Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isSearching={isSearching}

            // Sort
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOptions={sortOptions}

            // View Mode
            viewMode={viewMode}
            setViewMode={setViewMode}

            // Filters
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            governorates={governorates}
            cities={cities}
            selectedGovernorate={selectedGovernorate}
            setSelectedGovernorate={setSelectedGovernorate}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedPriceType={selectedPriceType}
            setSelectedPriceType={setSelectedPriceType}
            selectedPrivacyType={selectedPrivacyType}
            setSelectedPrivacyType={setSelectedPrivacyType}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
            userContext={userContext}
            isLoggedIn={isLoggedIn}
            privacyOptions={privacyOptions}
          />

          {/* ============================================ */}
          {/* SUB-CATEGORY SELECTOR */}
          {/* ============================================ */}
          <SubCategorySelector
            subCategories={subCategories}
            selectedSubCategories={selectedSubCategories}
            onSubCategoryToggle={handleSubCategoryToggle}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            isLoading={subCategories.goods.length === 0 && subCategories.services.length === 0}
          />

          {/* ============================================ */}
          {/* RESULTS COUNT */}
          {/* ============================================ */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 4px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'Cairo, sans-serif' }}>
              {!showSkeletons && (
                <> عرض {announcements.length} من {total} إعلان {searchTerm && ` (نتائج البحث: "${searchTerm}")`}</>
              )}
              {isSearching && searchTerm && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Spinner animation="border" size="sm" style={{ color: 'var(--primary-orange)', width: '14px', height: '14px' }} /> جاري البحث...
                </span>
              )}
              {selectedCategory && (
                <span style={{ marginRight: '8px', color: 'var(--primary-orange)' }}>
                  📂 {selectedCategory === 'goods' ? 'سلع' : 'خدمات'}
                  {selectedSubCategories.length > 0 && ` + ${selectedSubCategories.length} فئة`}
                </span>
              )}
              {selectedSubCategories.length > 0 && !selectedCategory && (
                <span style={{ marginRight: '8px', color: 'var(--primary-orange)' }}>
                  🏷️ {selectedSubCategories.length} فئة محددة
                </span>
              )}
            </span>
          </div>

          {/* ============================================ */}
          {/* ANNOUNCEMENTS LIST */}
          {/* ============================================ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: viewMode === 'list' ? '1.25rem' : '0', maxWidth: viewMode === 'list' ? '820px' : '100%', margin: '0 auto' }}>
            {showSkeletons ? (
              renderSkeletons()
            ) : announcements.length > 0 ? (
              <>
                {renderAnnouncements()}
                <div ref={observerRef} style={{ height: '20px' }} />
                {loadingMore && (
                  <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <Spinner animation="border" style={{ color: 'var(--primary-orange)', width: '2rem', height: '2rem' }} />
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontFamily: 'Cairo, sans-serif', fontSize: '0.85rem' }}>جاري تحميل المزيد...</p>
                  </div>
                )}
                {!hasMore && announcements.length > 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontFamily: 'Cairo, sans-serif', fontSize: '0.9rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏁</div>
                    <p>لقد وصلت إلى نهاية الإعلانات</p>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <h3 style={{ color: 'var(--text-secondary)', fontFamily: 'Cairo, sans-serif', marginBottom: '0.5rem' }}>لا توجد إعلانات</h3>
                <p style={{ color: 'var(--text-muted)', fontFamily: 'Cairo, sans-serif' }}>
                  {searchTerm ? 'لم نعثر على إعلانات تطابق بحثك. حاول تغيير كلمات البحث.' : 'لا توجد إعلانات متاحة حالياً. تابعنا للمزيد!'}
                </p>
                {searchTerm && (
                  <Button
                    onClick={() => setSearchTerm('')}
                    style={{
                      backgroundColor: 'var(--primary-orange)',
                      borderColor: 'var(--primary-orange)',
                      color: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '8px 24px',
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--primary-orange-dark)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    مسح البحث
                  </Button>
                )}
              </div>
            )}
          </div>
        </Container>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .view-mode-toggle {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default AnnouncementsPage;
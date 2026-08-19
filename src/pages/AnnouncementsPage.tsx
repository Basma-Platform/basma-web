import { Container, Row, Col, Form } from 'react-bootstrap';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { announcementService } from '../services/announcementService';
import { regionService } from '../services/regionService';
import AnnouncementCard from '../components/announcements/AnnouncementCard';
import AnnouncementCardSkeleton from '../components/announcements/AnnouncementCardSkeleton';
import AnnouncementSearch from '../components/announcements/AnnouncementSearch';
import AnnouncementFilters from '../components/announcements/AnnouncementFilters';
import AnnouncementPagination from '../components/announcements/AnnouncementPagination';
import SEO from '../components/SEO';
import type { Announcement, Governorate, City } from '../types';
import { FaInbox } from 'react-icons/fa';

const AnnouncementsPage = () => {
  const { isDark } = useTheme();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('newest'); // ✅ Add sort state

  // Filters
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPriceType, setSelectedPriceType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const isLoggedIn = false; // Will be replaced with auth later

  // Fetch governorates on mount
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

  // ✅ Updated fetchAnnouncements with sort
  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        search: searchTerm || undefined,
        governorate_id: selectedGovernorate || undefined,
        city_id: selectedCity ? Number(selectedCity) : undefined,
        category: selectedCategory || undefined,
        type: selectedType || undefined,
        payment_type: selectedPriceType || undefined,
        sort: sortBy, // ✅ Add sort parameter
      };

      console.log('📤 Sending params:', params); // ← Debug

      const response = await announcementService.getPublicAnnouncements(params);
      setAnnouncements(response.data);
      setLastPage(response.last_page);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedGovernorate, selectedCity, selectedCategory, selectedType, selectedPriceType, sortBy]);

  // Fetch when filters change
  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGovernorate, selectedCity, selectedCategory, selectedType, selectedPriceType, sortBy]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSelectedGovernorate('');
    setSelectedCity('');
    setSelectedCategory('');
    setSelectedType('');
    setSelectedPriceType('');
    setSearchTerm('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  // ✅ Sort change handler
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <SEO title="الإعلانات" description="تصفح جميع الإعلانات على منصة بصمة" />
      <div
        style={{
          paddingTop: '100px',
          paddingBottom: '60px',
          backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
          minHeight: '100vh',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Container>
          {/* Page Header */}
          <div className="text-center mb-4">
            <div
              style={{
                width: '60px',
                height: '4px',
                backgroundColor: '#E87A20',
                borderRadius: '2px',
                margin: '0 auto 1rem',
              }}
            />
            <h1
              style={{
                color: isDark ? '#FDF5E6' : '#6B4226',
                fontSize: 'clamp(2rem, 3vw, 2.8rem)',
                fontWeight: 900,
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '0.5rem',
              }}
            >
              الإعلانات
            </h1>
            <p
              style={{
                color: isDark ? '#C49A6C' : '#8B5A2B',
                fontSize: '1rem',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              استعرض جميع الإعلانات المتاحة للتبادل
            </p>
          </div>

          {/* Search */}
          <Row className="justify-content-center mb-3">
            <Col xs={12} lg={8}>
              <AnnouncementSearch value={searchTerm} onChange={handleSearch} />
            </Col>
          </Row>

          {/* Filters */}
          <Row className="justify-content-center">
            <Col xs={12} lg={10}>
              <AnnouncementFilters
                governorates={governorates}
                cities={cities}
                selectedGovernorate={selectedGovernorate}
                selectedCity={selectedCity}
                selectedCategory={selectedCategory}
                selectedType={selectedType}
                selectedPriceType={selectedPriceType}
                onGovernorateChange={setSelectedGovernorate}
                onCityChange={setSelectedCity}
                onCategoryChange={setSelectedCategory}
                onTypeChange={setSelectedType}
                onPriceTypeChange={setSelectedPriceType}
                onClearFilters={handleClearFilters}
                showFilters={showFilters}
                onToggleFilters={() => setShowFilters(!showFilters)}
                isLoggedIn={isLoggedIn}
              />
            </Col>
          </Row>

          {/* ✅ Results Count + Sort Dropdown */}
          <Row className="justify-content-center">
            <Col xs={12} lg={10}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  color: isDark ? '#C49A6C' : '#8B5A2B',
                  fontSize: '0.95rem',
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '1rem',
                  padding: '0 4px',
                }}
              >
                <span>
                  {!loading && (
                    <>
                      عرض {announcements.length} من {total} إعلان
                      {searchTerm && ` (نتائج البحث: "${searchTerm}")`}
                    </>
                  )}
                </span>

                {/* ✅ Sort Dropdown */}
                <Form.Select
                  value={sortBy}
                  onChange={handleSortChange}
                  size="sm"
                  style={{
                    width: 'auto',
                    minWidth: '160px',
                    backgroundColor: isDark ? '#16213e' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)',
                    color: isDark ? '#FDF5E6' : '#6B4226',
                    borderRadius: '10px',
                    fontFamily: 'Cairo, sans-serif',
                    padding: '6px 14px',
                  }}
                >
                  <option value="newest">الأحدث أولاً</option>
                  <option value="oldest">الأقدم أولاً</option>
                  <option value="most_viewed">الأكثر مشاهدة</option>
                </Form.Select>
              </div>
            </Col>
          </Row>

          {/* Announcements Grid */}
          <Row className="g-4">
            {loading ? (
              <AnnouncementCardSkeleton count={12} />
            ) : announcements.length > 0 ? (
              announcements.map((announcement) => (
                <Col key={announcement.id} xs={12} sm={6} lg={4} xl={3}>
                  <AnnouncementCard
                    announcement={announcement}
                    isLoggedIn={isLoggedIn}
                  />
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    backgroundColor: isDark ? '#16213e' : '#FFFFFF',
                    borderRadius: '16px',
                    boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
                  }}
                >
                  <FaInbox
                    size={64}
                    color={isDark ? '#2a3a5a' : '#e0e0e0'}
                    style={{ marginBottom: '1rem' }}
                  />
                  <h3
                    style={{
                      color: isDark ? '#FDF5E6' : '#6B4226',
                      fontFamily: 'Cairo, sans-serif',
                      marginBottom: '0.5rem',
                    }}
                  >
                    لا توجد إعلانات
                  </h3>
                  <p
                    style={{
                      color: isDark ? '#C49A6C' : '#8B5A2B',
                      fontFamily: 'Cairo, sans-serif',
                    }}
                  >
                    {searchTerm
                      ? 'لم نعثر على إعلانات تطابق بحثك. حاول تغيير كلمات البحث.'
                      : 'لا توجد إعلانات متاحة حالياً. تابعنا للمزيد!'}
                  </p>
                </div>
              </Col>
            )}
          </Row>

          {/* Pagination */}
          {!loading && announcements.length > 0 && (
            <AnnouncementPagination
              currentPage={currentPage}
              lastPage={lastPage}
              onPageChange={handlePageChange}
            />
          )}
        </Container>
      </div>

      {/* Shimmer Animation Styles */}
      <style>{`
        .skeleton {
          position: relative;
          overflow: hidden;
        }

        .shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.05) 50%,
            transparent 100%
          );
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        [data-theme="dark"] .shimmer::after {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.03) 50%,
            transparent 100%
          );
        }
      `}</style>
    </>
  );
};

export default AnnouncementsPage;
import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { faqService } from '../services/faqService';
import FAQSearch from '../components/faq/FAQSearch';
import FAQCategoryFilter from '../components/faq/FAQCategoryFilter';
import FAQAccordion from '../components/faq/FAQAccordion';
import FAQPerPageDropdown from '../components/faq/FAQPerPageDropdown';
import FAQPagination from '../components/faq/FAQPaginations';
import type { FAQ } from '../types';
import SEO from '../components/SEO';

// Mock data fallback
const MOCK_FAQS: FAQ[] = [
  {
    id: 1,
    question: 'كيف يمكنني إنشاء حساب جديد؟',
    answer: 'يمكنك إنشاء حساب جديد بالنقر على زر "ابدأ الآن" في الصفحة الرئيسية...',
    category: 'الحساب',
    order: 1,
    is_active: true,
  },
  {
    id: 2,
    question: 'كيف يمكنني نشر إعلان؟',
    answer: 'بعد تسجيل الدخول، يمكنك النقر على زر "نشر إعلان" في لوحة التحكم...',
    category: 'الإعلانات',
    order: 1,
    is_active: true,
  },
  {
    id: 3,
    question: 'كيف يمكنني التواصل مع المعلن؟',
    answer: 'يمكنك التواصل مع المعلن عبر رقم واتساب الموجود في صفحة الإعلان...',
    category: 'الإعلانات',
    order: 2,
    is_active: true,
  },
  {
    id: 4,
    question: 'كيف يتم التحقق من هوية المستخدمين؟',
    answer: 'يمكن للمستخدمين رفع صورة بطاقة هويتهم من خلال صفحة الملف الشخصي...',
    category: 'الأمان والسلامة',
    order: 1,
    is_active: true,
  },
  {
    id: 5,
    question: 'هل المنصة مجانية؟',
    answer: 'نعم، منصة بصمة مجانية بالكامل...',
    category: 'الدفع والمقايضة',
    order: 1,
    is_active: true,
  },
  {
    id: 6,
    question: 'كيف يمكنني حذف حسابي؟',
    answer: 'يمكنك حذف حسابك من خلال إعدادات الملف الشخصي...',
    category: 'الحساب',
    order: 2,
    is_active: true,
  },
  {
    id: 7,
    question: 'ماذا أفعل إذا واجهت مشكلة مع مستخدم آخر؟',
    answer: 'يمكنك الإبلاغ عن أي مشكلة من خلال زر "تبليغ"...',
    category: 'الأمان والسلامة',
    order: 2,
    is_active: true,
  },
  {
    id: 8,
    question: 'ما هي أنواع الإعلانات المتاحة؟',
    answer: 'يمكنك نشر إعلانات من نوع "عرض" أو "طلب"...',
    category: 'الإعلانات',
    order: 3,
    is_active: true,
  },
  {
    id: 9,
    question: 'كيف يمكنني تغيير كلمة المرور؟',
    answer: 'يمكنك تغيير كلمة المرور من خلال إعدادات الملف الشخصي...',
    category: 'الحساب',
    order: 3,
    is_active: true,
  },
  {
    id: 10,
    question: 'هل يمكنني إلغاء الإعلان بعد نشره؟',
    answer: 'نعم، يمكنك إلغاء (تعطيل) الإعلان في أي وقت...',
    category: 'الإعلانات',
    order: 4,
    is_active: true,
  },
];

const FAQPage = () => {
  const { isDark } = useTheme();
  const [faqs, setFaqs] = useState<FAQ[]>(MOCK_FAQS);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>(MOCK_FAQS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [categories, setCategories] = useState<string[]>(['الكل']);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [isUsingMock, setIsUsingMock] = useState(true);

  // Fetch categories separately from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await faqService.getCategories();
        if (data && data.length > 0) {
          setCategories(['الكل', ...data]);
        }
      } catch (err) {
        const mockCategories = ['الكل', ...new Set(MOCK_FAQS.map((f) => f.category))];
        setCategories(mockCategories);
      }
    };
    fetchCategories();
  }, []);

  // Fetch FAQs from API with pagination
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);

        const params: any = {
          page: currentPage,
          per_page: perPage,
        };

        if (selectedCategory !== 'الكل') {
          params.category = selectedCategory;
        }

        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }

        const response = await faqService.getFAQs(params);

        if (response && response.data && response.data.length > 0) {
          setFaqs(response.data);
          setFilteredFaqs(response.data);
          setTotal(response.total || response.data.length);
          setLastPage(response.last_page || 1);
          setIsUsingMock(false);
        } else {
          setFaqs(MOCK_FAQS);
          setFilteredFaqs(MOCK_FAQS);
          setTotal(MOCK_FAQS.length);
          setLastPage(1);
          setIsUsingMock(true);
        }
      } catch (err) {
        setFaqs(MOCK_FAQS);
        setFilteredFaqs(MOCK_FAQS);
        setTotal(MOCK_FAQS.length);
        setLastPage(1);
        setIsUsingMock(true);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchFAQs();
    }, 300);

    return () => clearTimeout(timer);
  }, [currentPage, perPage, selectedCategory, searchTerm]);

  // Local search filter
  useEffect(() => {
    let result = faqs;

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.question.toLowerCase().includes(term) ||
          item.answer.toLowerCase().includes(term)
      );
    }

    setFilteredFaqs(result);
  }, [searchTerm, faqs]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <div
      style={{
        paddingTop: '100px',
        paddingBottom: '60px',
        backgroundColor: 'var(--bg-body)',
        minHeight: '100vh',
        transition: 'background-color 0.3s ease',
      }}
    >
      <SEO
        title="الأسئلة الشائعة"
        description="إجابات على أكثر الأسئلة التي يطرحها مستخدمونا حول منصة بصمة."
      />

      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-5">
            <div
              style={{
                width: '60px',
                height: '4px',
                backgroundColor: 'var(--primary-orange)',
                borderRadius: '2px',
                margin: '0 auto 1.5rem',
              }}
            />
            <h1
              style={{
                color: 'var(--text-secondary)',
                fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                fontWeight: 900,
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '1rem',
              }}
            >
              الأسئلة الشائعة
            </h1>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '1.1rem',
                fontFamily: 'Cairo, sans-serif',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              إجابات على أكثر الأسئلة التي يطرحها مستخدمونا
            </p>
          </div>
        </motion.div>

        {/* Search + PerPage Dropdown */}
        <Row className="justify-content-center mb-4">
          <Col xs={12} lg={8}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <FAQSearch onSearch={handleSearch} isDark={isDark} />
              </div>
              <div style={{ flexShrink: 0 }}>
                <FAQPerPageDropdown
                  perPage={perPage}
                  onPerPageChange={handlePerPageChange}
                  isDark={isDark}
                />
              </div>
            </div>
          </Col>
        </Row>

        {/* Category Filter */}
        <Row className="justify-content-center mb-4">
          <Col xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FAQCategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                isDark={isDark}
              />
            </motion.div>
          </Col>
        </Row>

        {/* Results Count */}
        <Row className="justify-content-center">
          <Col xs={12} lg={8}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '1rem',
                padding: '0 4px',
                flexWrap: 'wrap',
              }}
            >
              <span>
                {loading ? (
                  'جاري التحميل...'
                ) : (
                  <>
                    عرض {filteredFaqs.length} من {total} سؤال
                    {isUsingMock && ' (بيانات نموذجية)'}
                    {searchTerm && ` (نتائج البحث: "${searchTerm}")`}
                  </>
                )}
              </span>
              <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>
                {!loading && lastPage > 1 && `الصفحة ${currentPage} من ${lastPage}`}
              </span>
            </div>
          </Col>
        </Row>

        {/* FAQ Accordion */}
        <Row className="justify-content-center">
          <Col xs={12} lg={8}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <FAQAccordion
                faqs={filteredFaqs}
                loading={loading}
                isDark={isDark}
                itemVariants={itemVariants}
              />
            </motion.div>

            {/* No Results */}
            {!loading && filteredFaqs.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h3 style={{ color: 'var(--text-secondary)', fontFamily: 'Cairo, sans-serif' }}>
                  لا توجد نتائج
                </h3>
                <p>
                  {searchTerm
                    ? 'لم نعثر على أي أسئلة تطابق بحثك. حاول تغيير كلمات البحث.'
                    : 'لا توجد أسئلة في هذه الفئة حالياً.'}
                </p>
              </motion.div>
            )}

            {/* Pagination */}
            {!loading && lastPage > 1 && (
              <FAQPagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPageChange={handlePageChange}
                isDark={isDark}
              />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FAQPage;
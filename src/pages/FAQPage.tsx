import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { faqService } from '../services/faqService';
import FAQSearch from '../components/faq/FAQSearch';
import FAQCategoryFilter from '../components/faq/FAQCategoryFilter';
import FAQAccordion from '../components/faq/FAQAccordion';
import { FaQuestionCircle } from 'react-icons/fa';
import type { FAQ } from '../types';
import SEO from '../components/SEO';

const FAQPage = () => {
  const { isDark } = useTheme();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch FAQs from API
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const data = await faqService.getFAQs();
        setFaqs(data);
        setFilteredFaqs(data);
        
        // Extract unique categories
        const uniqueCategories = ['all', ...new Set(data.map((item) => item.category))];
        setCategories(uniqueCategories);
        setError(null);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError('حدث خطأ في تحميل الأسئلة. يرجى المحاولة مرة أخرى.');
        // Fallback mock data
        const mockData = getMockFAQs();
        setFaqs(mockData);
        setFilteredFaqs(mockData);
        const uniqueCategories = ['all', ...new Set(mockData.map((item) => item.category))];
        setCategories(uniqueCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  // Filter FAQs when search or category changes
  useEffect(() => {
    let result = faqs;

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.question.toLowerCase().includes(term) ||
          item.answer.toLowerCase().includes(term)
      );
    }

    setFilteredFaqs(result);
  }, [searchTerm, selectedCategory, faqs]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Mock data fallback
  const getMockFAQs = (): FAQ[] => {
    return [
      {
        id: 1,
        question: 'كيف يمكنني إنشاء حساب جديد؟',
        answer: 'يمكنك إنشاء حساب جديد بالنقر على زر "ابدأ الآن" في الصفحة الرئيسية، ثم ملء النموذج بالبيانات المطلوبة مثل الاسم والبريد الإلكتروني ورقم واتساب. ستتلقى رسالة تأكيد على بريدك الإلكتروني لتفعيل الحساب.',
        category: 'account',
        order: 1,
        is_active: true,
      },
      {
        id: 2,
        question: 'كيف يمكنني نشر إعلان؟',
        answer: 'بعد تسجيل الدخول، يمكنك النقر على زر "نشر إعلان" في لوحة التحكم. اختر نوع الإعلان (عرض أو طلب)، ثم اختر الفئة المناسبة، وأضف العنوان والوصف والسعر والصور. يمكنك أيضاً تحديد مستوى الخصوصية للإعلان.',
        category: 'announcements',
        order: 1,
        is_active: true,
      },
      {
        id: 3,
        question: 'كيف يمكنني التواصل مع المعلن؟',
        answer: 'يمكنك التواصل مع المعلن عبر رقم واتساب الموجود في صفحة الإعلان. اضغط على رقم واتساب لفتح المحادثة مباشرة. ملاحظة: رقم واتساب يظهر فقط للمستخدمين المسجلين.',
        category: 'announcements',
        order: 2,
        is_active: true,
      },
      {
        id: 4,
        question: 'كيف يتم التحقق من هوية المستخدمين؟',
        answer: 'يمكن للمستخدمين رفع صورة بطاقة هويتهم من خلال صفحة الملف الشخصي. يقوم فريق الإدارة بمراجعة الطلب وفي حال الموافقة، تظهر علامة "موثق" بجانب اسم المستخدم. هذا يزيد من مستوى الثقة في المنصة.',
        category: 'safety',
        order: 1,
        is_active: true,
      },
      {
        id: 5,
        question: 'هل المنصة مجانية؟',
        answer: 'نعم، منصة بصمة مجانية بالكامل. لا توجد أي رسوم للنشر أو التواصل أو التبادل. المنصة تهدف إلى تعزيز التكافل الاجتماعي وتسهيل التبادل بين أهالي غزة.',
        category: 'payment',
        order: 1,
        is_active: true,
      },
      {
        id: 6,
        question: 'كيف يمكنني حذف حسابي؟',
        answer: 'يمكنك حذف حسابك من خلال إعدادات الملف الشخصي. اضغط على "حذف الحساب" وتأكيد العملية. سيتم حذف جميع بياناتك بشكل نهائي خلال 30 يوماً.',
        category: 'account',
        order: 2,
        is_active: true,
      },
      {
        id: 7,
        question: 'ماذا أفعل إذا واجهت مشكلة مع مستخدم آخر؟',
        answer: 'يمكنك الإبلاغ عن أي مشكلة من خلال زر "تبليغ" الموجود في صفحة الإعلان أو الملف الشخصي. سيتم مراجعة البلاغ من قبل فريق الإدارة واتخاذ الإجراء المناسب.',
        category: 'safety',
        order: 2,
        is_active: true,
      },
      {
        id: 8,
        question: 'ما هي أنواع الإعلانات المتاحة؟',
        answer: 'يمكنك نشر إعلانات من نوع "عرض" (عندما تقدم سلعة أو خدمة) أو "طلب" (عندما تبحث عن سلعة أو خدمة). يمكنك أيضاً اختيار الفئة: بضائع، خدمات، أو مقايضة.',
        category: 'announcements',
        order: 3,
        is_active: true,
      },
    ];
  };

  // Animation variants
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
    visible: { opacity: 1, y: 0 },
  };

  if (error) {
    return (
      <div
        style={{
          paddingTop: '120px',
          minHeight: '100vh',
          backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={8} className="text-center">
              <div
                style={{
                  backgroundColor: isDark ? '#16213e' : '#FFFFFF',
                  borderRadius: '16px',
                  padding: '3rem',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                }}
              >
                <FaQuestionCircle size={48} color="#E87A20" />
                <h3
                  style={{
                    color: isDark ? '#FDF5E6' : '#6B4226',
                    marginTop: '1rem',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  {error}
                </h3>
                <p
                  style={{
                    color: isDark ? '#C49A6C' : '#8B5A2B',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  تم تحميل بعض الأسئلة النموذجية للمعاينة.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div
      style={{
        paddingTop: '100px',
        paddingBottom: '60px',
        backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
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
                backgroundColor: '#E87A20',
                borderRadius: '2px',
                margin: '0 auto 1.5rem',
              }}
            />
            <h1
              style={{
                color: isDark ? '#FDF5E6' : '#6B4226',
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
                color: isDark ? '#C49A6C' : '#8B5A2B',
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

        {/* Search & Filter */}
        <Row className="justify-content-center mb-4">
          <Col xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FAQSearch onSearch={handleSearch} isDark={isDark} />
            </motion.div>
          </Col>
        </Row>

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
                textAlign: 'right',
                color: isDark ? '#C49A6C' : '#8B5A2B',
                fontSize: '0.95rem',
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '1rem',
                padding: '0 4px',
              }}
            >
              {loading ? (
                'جاري التحميل...'
              ) : (
                <>
                  عرض {filteredFaqs.length} من {faqs.length} سؤال
                  {filteredFaqs.length !== faqs.length && ' (نتائج البحث)'}
                </>
              )}
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
                  color: isDark ? '#C49A6C' : '#8B5A2B',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                <div
                  style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                  }}
                >
                  🔍
                </div>
                <h3
                  style={{
                    color: isDark ? '#FDF5E6' : '#6B4226',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  لا توجد نتائج
                </h3>
                <p>
                  لم نعثر على أي أسئلة تطابق بحثك. حاول تغيير كلمات البحث أو تصفية الفئات.
                </p>
              </motion.div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FAQPage;
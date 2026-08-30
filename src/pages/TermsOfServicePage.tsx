/* eslint-disable react-hooks/set-state-in-effect */
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaGavel, FaBan, FaExclamationTriangle, FaFileContract,
  FaShieldAlt, FaCheckCircle, FaGlobe, FaServer,
  FaHandshake, FaWhatsapp
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const TermsOfServicePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sections = [
    {
      icon: <FaFileContract size={22} color="var(--primary-orange)" />,
      title: 'التزامات المستخدم',
      subtitle: 'ما هي مسؤولياتك كعضو في مجتمع بصمة؟',
      content: [
        'باستخدامك لمنصة بصمة، فإنك توافق على الالتزام بـ:',
        { type: 'list', items: [
          'تقديم معلومات صحيحة ودقيقة عند التسجيل',
          'الحفاظ على سرية حسابك وكلمة المرور',
          'أن تكون مسؤولاً عن جميع النشاطات التي تحدث من خلال حسابك',
          'الالتزام بآداب التعامل مع المستخدمين الآخرين',
          'عدم انتحال شخصية الآخرين أو استخدام حسابات وهمية',
        ]},
        '• يجب عليك إبلاغنا فوراً إذا اشتبهت في أي استخدام غير مصرح به لحسابك',
      ],
    },
    {
      icon: <FaGavel size={22} color="var(--primary-orange)" />,
      title: 'قواعد المنصة',
      subtitle: 'ما هي القواعد التي تحكم استخدام المنصة؟',
      content: [
        'لتوفير بيئة آمنة وموثوقة للجميع، نطلب منك الالتزام بـ:',
        { type: 'list', items: [
          'الإعلانات يجب أن تكون حقيقية ودقيقة',
          'احترام خصوصية المستخدمين الآخرين',
          'استخدام واتساب للتواصل هو الوسيلة المعتمدة',
          'التقييم يجب أن يكون عادلاً وموضوعياً',
          'الإبلاغ عن أي محتوى مخالف أو مشبوه',
          'الالتزام بالقوانين والأنظمة المحلية',
        ]},
        '• نقوم بمراجعة الإعلانات المخالفة واتخاذ الإجراء المناسب',
      ],
    },
    {
      icon: <FaBan size={22} color="var(--primary-orange)" />,
      title: 'الأنشطة المحظورة',
      subtitle: 'ما هي الأنشطة غير المسموح بها على المنصة؟',
      content: [
        'نحظر بشكل صارم الأنشطة التالية على منصة بصمة:',
        { type: 'list', items: [
          'نشر محتوى مسيء أو مخالف للقيم المجتمعية',
          'الاحتيال أو النصب على المستخدمين الآخرين',
          'نشر معلومات شخصية للآخرين دون موافقتهم',
          'إنشاء إعلانات وهمية أو مضللة',
          'التحرش أو المضايقة بأي شكل من الأشكال',
          'بيع أو ترويج منتجات أو خدمات غير قانونية',
          'محاولة اختراق المنصة أو تعطيل خدماتها',
        ]},
        '• المخالفات قد تؤدي إلى تعليق أو حظر الحساب بشكل دائم',
      ],
    },
    {
      icon: <FaHandshake size={22} color="var(--primary-orange)" />,
      title: 'آلية التبادل والتواصل',
      subtitle: 'كيف يتم التبادل والتواصل بين المستخدمين؟',
      content: [
        'نوفر بيئة آمنة للتواصل والتبادل بين المستخدمين:',
        { type: 'list', items: [
          'التواصل يتم عبر واتساب بشكل مباشر بين الأطراف',
          'جميع الصفقات تتم بين المستخدمين بشكل مباشر',
          'ننصح بالاجتماع في أماكن عامة وآمنة عند التبادل',
          'تحقق من تقييمات الطرف الآخر قبل التعامل',
          'أبلغ عن أي سلوك مشبوه فوراً',
        ]},
        '• بصمة هي منصة وسيطة للتواصل، وليست طرفاً في الصفقات',
        '• لا نتحمل مسؤولية جودة السلع أو الخدمات المتبادلة',
      ],
    },
    {
      icon: <FaWhatsapp size={22} color="var(--primary-orange)" />,
      title: 'استخدام واتساب للتواصل',
      subtitle: 'لماذا نعتمد على واتساب؟',
      content: [
        'نعتمد على واتساب كوسيلة أساسية للتواصل بين المستخدمين:',
        { type: 'list', items: [
          'واتساب هو التطبيق الأكثر استخداماً في غزة',
          'يوفر تواصلاً مباشراً وسريعاً بين الأطراف',
          'يدعم مكالمات الصوت والفيديو للتفاوض',
          'يمكن مشاركة الصور والملفات بسهولة',
        ]},
        '• رقم واتساب يظهر فقط للمستخدمين المسجلين',
        '• ننصح بالتواصل عبر واتساب لإتمام الصفقات',
      ],
    },
    {
      icon: <FaExclamationTriangle size={22} color="var(--primary-orange)" />,
      title: 'إخلاء المسؤولية',
      subtitle: 'ما هي حدود مسؤولية منصة بصمة؟',
      content: [
        'نوضح هنا حدود مسؤوليتنا تجاه المستخدمين:',
        { type: 'list', items: [
          'بصمة هي منصة وسيطة للتواصل بين المستخدمين',
          'لا نتحمل مسؤولية جودة السلع أو الخدمات المتبادلة',
          'جميع الصفقات تتم بين المستخدمين بشكل مباشر',
          'ننصح باتخاذ إجراءات الأمان اللازمة عند التبادل',
          'نوصي بالاجتماع في أماكن عامة وآمنة',
          'نقوم بمراجعة الإعلانات المخالفة واتخاذ الإجراء المناسب',
        ]},
        '• نحتفظ بالحق في تعديل هذه الشروط في أي وقت',
        '• أي تغييرات يتم إخطار المستخدمين بها عبر المنصة',
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // ✅ إصلاح itemVariants - إزالة ease: 'easeOut'
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
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
        title="شروط الخدمة"
        description="شروط الخدمة لمنصة بصمة. تعرف على التزاماتك وحقوقك عند استخدام المنصة."
      />

      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Row className="justify-content-center">
            <Col xs={12} lg={10}>
              {/* Breadcrumb */}
              <nav
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.5rem',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                <Link to="/" style={{ color: 'var(--primary-orange)', textDecoration: 'none' }}>
                  الرئيسية
                </Link>
                <span style={{ margin: '0 8px' }}>›</span>
                <span>شروط الخدمة</span>
              </nav>

              {/* Header Content */}
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
                    marginBottom: '0.5rem',
                  }}
                >
                  شروط الخدمة
                </h1>

                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '1.1rem',
                    fontFamily: 'Cairo, sans-serif',
                    maxWidth: '700px',
                    margin: '0 auto',
                  }}
                >
                  باستخدامك لمنصة بصمة، فإنك توافق على الالتزام بهذه الشروط والأحكام.
                  يرجى قراءتها بعناية.
                </p>

                <div
                  style={{
                    marginTop: '1.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      padding: '6px 16px',
                      backgroundColor: 'rgba(40,167,69,0.1)',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      color: '#28A745',
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <FaCheckCircle size={12} />
                    محدّث: يوليو ٢٠٢٦
                  </span>
                  <span
                    style={{
                      padding: '6px 16px',
                      backgroundColor: 'rgba(232,122,32,0.08)',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      color: 'var(--primary-orange)',
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <FaShieldAlt size={12} />
                    بيئة آمنة
                  </span>
                  <span
                    style={{
                      padding: '6px 16px',
                      backgroundColor: 'rgba(23,162,184,0.1)',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      color: '#17A2B8',
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <FaHandshake size={12} />
                    تبادل موثوق
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </motion.div>

        {/* Content Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <Row className="justify-content-center">
            <Col xs={12} lg={10}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                }}
              >
                {sections.map((section, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: '16px',
                      padding: '1.75rem 2rem',
                      boxShadow: '0 4px 16px var(--shadow-sm)',
                      border: '1px solid var(--border-color)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 32px var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 16px var(--shadow-sm)';
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(232,122,32,0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.15)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.08)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {section.icon}
                      </div>
                      <div>
                        <h2
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            fontFamily: 'Cairo, sans-serif',
                            margin: 0,
                          }}
                        >
                          {section.title}
                        </h2>
                        {section.subtitle && (
                          <p
                            style={{
                              color: 'var(--text-muted)',
                              fontSize: '0.8rem',
                              fontFamily: 'Cairo, sans-serif',
                              margin: '2px 0 0',
                              opacity: 0.7,
                            }}
                          >
                            {section.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        lineHeight: 1.9,
                        fontFamily: 'Cairo, sans-serif',
                        paddingRight: '4px',
                      }}
                    >
                      {section.content.map((item, i) => {
                        if (typeof item === 'string') {
                          return (
                            <p key={i} style={{ marginBottom: '0.5rem' }}>
                              {item}
                            </p>
                          );
                        }
                        if (item.type === 'list') {
                          return (
                            <ul
                              key={i}
                              style={{
                                listStyle: 'none',
                                padding: '0',
                                margin: '0 0 0.75rem 0',
                              }}
                            >
                              {item.items.map((listItem, li) => (
                                <li
                                  key={li}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '10px',
                                    marginBottom: '4px',
                                    padding: '4px 0',
                                  }}
                                >
                                  <span
                                    style={{
                                      color: 'var(--primary-orange)',
                                      fontSize: '1.2rem',
                                      lineHeight: 1.6,
                                      flexShrink: 0,
                                    }}
                                  >
                                    •
                                  </span>
                                  <span>{listItem}</span>
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Last Updated + Back to Top */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '2.5rem',
                  padding: '1rem 0',
                  borderTop: '1px solid var(--border-color)',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontFamily: 'Cairo, sans-serif',
                    opacity: 0.6,
                  }}
                >
                  <FaServer size={14} style={{ marginLeft: '6px' }} />
                  آخر تحديث: يوليو ٢٠٢٦
                  <span style={{ margin: '0 8px' }}>•</span>
                  <FaGlobe size={14} style={{ marginLeft: '6px' }} />
                  يسري على جميع مستخدمي المنصة
                </div>

                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  style={{
                    padding: '10px 28px',
                    borderRadius: '999px',
                    border: `2px solid var(--primary-orange)`,
                    backgroundColor: 'transparent',
                    color: 'var(--primary-orange)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Cairo, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(232,122,32,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--primary-orange)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  العودة إلى الأعلى ↑
                </button>
              </div>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </div>
  );
};

export default TermsOfServicePage;
/* eslint-disable react-hooks/set-state-in-effect */
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaDatabase, FaUserShield, FaShareAlt, FaTrashAlt, 
  FaCookieBite, FaShieldAlt, FaCheckCircle, FaGlobe,
  FaLock, FaServer
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const PrivacyPolicyPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sections = [
    {
      icon: <FaDatabase size={22} color="var(--primary-orange)" />,
      title: 'جمع البيانات',
      subtitle: 'ما هي المعلومات التي نجمعها؟',
      content: [
        'نقوم بجمع المعلومات التالية عند استخدامك لمنصة بصمة:',
        { type: 'list', items: [
          'الاسم الكامل والبريد الإلكتروني ورقم الهاتف',
          'الموقع الجغرافي (المحافظة والمدينة/الحي)',
          'الصور الشخصية والصور المرفقة بالإعلانات',
          'سجل نشاطك على المنصة (الإعلانات، التعليقات، التقييمات)',
        ]},
        'نقوم بجمع هذه البيانات لتقديم خدماتنا وتحسين تجربتك على المنصة.',
      ],
    },
    {
      icon: <FaShareAlt size={22} color="var(--primary-orange)" />,
      title: 'استخدام البيانات ومشاركتها',
      subtitle: 'كيف نستخدم بياناتك؟',
      content: [
        'نستخدم بياناتك للأغراض التالية:',
        { type: 'list', items: [
          'تقديم وتحسين خدمات المنصة',
          'التواصل معك بشأن إعلاناتك',
          'تعزيز الأمان والثقة بين المستخدمين',
        ]},
        '• لا نشارك بياناتك مع أطراف ثالثة دون موافقتك الصريحة',
        '• يتم عرض معلومات الاتصال (رقم واتساب) فقط للمستخدمين المسجلين',
      ],
    },
    {
      icon: <FaCookieBite size={22} color="var(--primary-orange)" />,
      title: 'ملفات تعريف الارتباط (الكوكيز)',
      subtitle: 'كيف نستخدم الكوكيز؟',
      content: [
        'نستخدم فقط ملفات تعريف ارتباط أساسية (Essential Cookies) لتشغيل المنصة بشكل آمن:',
        { type: 'list', items: [
          'كوكيز الجلسة (Session Cookies) - للحفاظ على تسجيل دخولك',
          'كوكيز CSRF - للحماية من الهجمات الإلكترونية',
          'كوكيز "تذكرني" - لتبقى مسجلاً دخولك (اختياري)',
        ]},
        '• هذه الكوكيز ضرورية لتشغيل المنصة ولا تستخدم للتتبع أو الإعلانات',
        '• يمكنك إدارة الكوكيز من خلال إعدادات متصفحك في أي وقت',
        '• لا نستخدم أي كوكيز تتبع أو إعلانات من جهات خارجية',
      ],
    },
    {
      icon: <FaUserShield size={22} color="var(--primary-orange)" />,
      title: 'حقوق المستخدمين',
      subtitle: 'ما هي حقوقك؟',
      content: [
        'لك الحق في:',
        { type: 'list', items: [
          'الوصول إلى بياناتك الشخصية وتعديلها',
          'حذف حسابك وبياناتك في أي وقت',
          'إلغاء الموافقة على معالجة بياناتك',
          'تقديم شكوى إذا كنت تعتقد أن بياناتك لم تتم معالجتها بشكل صحيح',
        ]},
        '• يتم الاحتفاظ ببياناتك فقط طالما أن حسابك نشط',
        '• يمكنك طلب حذف بياناتك بالكامل عبر إعدادات الملف الشخصي',
      ],
    },
    {
      icon: <FaTrashAlt size={22} color="var(--primary-orange)" />,
      title: 'حذف البيانات والاحتفاظ بها',
      subtitle: 'كم من الوقت نحتفظ ببياناتك؟',
      content: [
        '• يمكنك طلب حذف حسابك في أي وقت من خلال إعدادات الملف الشخصي',
        '• سيتم حذف جميع بياناتك بشكل دائم خلال 30 يوماً من طلب الحذف',
        '• قد نحتفظ ببعض البيانات لأغراض قانونية أو أمنية لفترة محدودة',
        '• يمكننا استخدام البيانات مجمعة وإحصائية دون تحديد هويتك',
        '• يتم حذف الكوكيز تلقائياً عند تسجيل الخروج أو انتهاء الجلسة',
      ],
    },
    {
      icon: <FaLock size={22} color="var(--primary-orange)" />,
      title: 'أمن البيانات',
      subtitle: 'كيف نحمي بياناتك؟',
      content: [
        'نتخذ إجراءات أمنية متقدمة لحماية بياناتك:',
        { type: 'list', items: [
          'تشفير جميع البيانات الحساسة باستخدام بروتوكول HTTPS',
          'تخزين كلمات المرور بشكل مشفر (bcrypt)',
          'استخدام كوكيز httpOnly و Secure لمنع سرقة الجلسات',
          'حماية من هجمات CSRF و XSS',
        ]},
        '• نقوم بمراجعة إجراءات الأمان بشكل دوري',
        '• نلتزم بأعلى معايير الأمان لحماية خصوصيتك',
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
        title="سياسة الخصوصية"
        description="سياسة الخصوصية لمنصة بصمة. تعرف على كيفية جمع بياناتك واستخدامها وحمايتها."
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
                <span>سياسة الخصوصية</span>
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
                  سياسة الخصوصية
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
                  نحن في بصمة نولي خصوصيتك أهمية بالغة. نوضح في هذه السياسة كيفية
                  جمع بياناتك واستخدامها وحمايتها.
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
                    آمن ومشفر
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
                    <FaCookieBite size={12} />
                    كوكيز أساسية فقط
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

export default PrivacyPolicyPage;
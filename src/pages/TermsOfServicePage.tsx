/* eslint-disable react-hooks/set-state-in-effect */
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FaGavel, FaBan, FaExclamationTriangle, FaFileContract } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import SEO from '../components/SEO';

const TermsOfServicePage = () => {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sections = [
    {
      icon: <FaFileContract size={24} color="#E87A20" />,
      title: 'التزامات المستخدم',
      content: [
        '• تقديم معلومات صحيحة ودقيقة عند التسجيل',
        '• الحفاظ على سرية حسابك وكلمة المرور',
        '• أن تكون مسؤولاً عن جميع النشاطات التي تحدث من خلال حسابك',
        '• الالتزام بآداب التعامل مع المستخدمين الآخرين',
        '• عدم انتحال شخصية الآخرين أو استخدام حسابات وهمية',
      ],
    },
    {
      icon: <FaGavel size={24} color="#E87A20" />,
      title: 'قواعد المنصة',
      content: [
        '• الإعلانات يجب أن تكون حقيقية ودقيقة',
        '• احترام خصوصية المستخدمين الآخرين',
        '• استخدام واتساب للتواصل هو الوسيلة المعتمدة',
        '• التقييم يجب أن يكون عادلاً وموضوعياً',
        '• الإبلاغ عن أي محتوى مخالف أو مشبوه',
        '• الالتزام بالقوانين والأنظمة المحلية',
      ],
    },
    {
      icon: <FaBan size={24} color="#E87A20" />,
      title: 'الأنشطة المحظورة',
      content: [
        '• نشر محتوى مسيء أو مخالف للقيم المجتمعية',
        '• الاحتيال أو النصب على المستخدمين الآخرين',
        '• نشر معلومات شخصية للآخرين دون موافقتهم',
        '• إنشاء إعلانات وهمية أو مضللة',
        '• التحرش أو المضايقة بأي شكل من الأشكال',
        '• بيع أو ترويج منتجات أو خدمات غير قانونية',
        '• محاولة اختراق المنصة أو تعطيل خدماتها',
      ],
    },
    {
      icon: <FaExclamationTriangle size={24} color="#E87A20" />,
      title: 'إخلاء المسؤولية',
      content: [
        '• بصمة هي منصة وسيطة للتواصل بين المستخدمين',
        '• لا نتحمل مسؤولية جودة السلع أو الخدمات المتبادلة',
        '• جميع الصفقات تتم بين المستخدمين بشكل مباشر',
        '• ننصح باتخاذ إجراءات الأمان اللازمة عند التبادل',
        '• نوصي بالاجتماع في أماكن عامة وآمنة',
        '• نقوم بمراجعة الإعلانات المخالفة واتخاذ الإجراء المناسب',
        '• نحتفظ بالحق في تعديل هذه الشروط في أي وقت',
      ],
    },
  ];

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
        title="شروط الخدمة"
        description="شروط الخدمة لمنصة بصمة. تعرف على التزاماتك وحقوقك عند استخدام المنصة."
      />

      <Container>
        {/* Header */}
        <Row className="justify-content-center">
          <Col xs={12} lg={10}>
            <div
              className={`fade-in-up ${isVisible ? 'visible' : ''}`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.6s ease',
              }}
            >
              {/* Breadcrumb */}
              <nav
                style={{
                  fontSize: '0.85rem',
                  color: isDark ? '#C49A6C' : '#8B5A2B',
                  marginBottom: '1.5rem',
                }}
              >
                <Link to="/" style={{ color: '#E87A20', textDecoration: 'none' }}>
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
                  شروط الخدمة
                </h1>

                <p
                  style={{
                    color: isDark ? '#C49A6C' : '#8B5A2B',
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
                    padding: '0.75rem 1.5rem',
                    backgroundColor: isDark ? 'rgba(232,122,32,0.1)' : 'rgba(232,122,32,0.06)',
                    borderRadius: '12px',
                    display: 'inline-block',
                    fontSize: '0.9rem',
                    color: isDark ? '#C49A6C' : '#6B4226',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  آخر تحديث: يوليو ٢٠٢٦
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Content Sections */}
        <Row className="justify-content-center">
          <Col xs={12} lg={10}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
              }}
            >
              {sections.map((section, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: isDark ? '#16213e' : '#FFFFFF',
                    borderRadius: '16px',
                    padding: '2rem',
                    boxShadow: isDark
                      ? '0 4px 16px rgba(0,0,0,0.2)'
                      : '0 4px 16px rgba(0,0,0,0.04)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.06)'}`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                    transitionDelay: `${index * 150}ms`,
                    transition: 'all 0.5s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = isDark
                      ? '0 8px 32px rgba(0,0,0,0.3)'
                      : '0 8px 32px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isDark
                      ? '0 4px 16px rgba(0,0,0,0.2)'
                      : '0 4px 16px rgba(0,0,0,0.04)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '1.2rem',
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(232,122,32,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {section.icon}
                    </div>
                    <h2
                      style={{
                        color: isDark ? '#FDF5E6' : '#6B4226',
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        fontFamily: 'Cairo, sans-serif',
                        margin: 0,
                      }}
                    >
                      {section.title}
                    </h2>
                  </div>

                  <div
                    style={{
                      color: isDark ? '#C49A6C' : '#6B4226',
                      fontSize: '0.95rem',
                      lineHeight: 1.9,
                      fontFamily: 'Cairo, sans-serif',
                    }}
                  >
                    {section.content.map((line, i) => (
                      <p key={i} style={{ marginBottom: '0.5rem' }}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Back to Top */}
            <div
              style={{
                textAlign: 'center',
                marginTop: '3rem',
              }}
            >
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                  padding: '12px 32px',
                  borderRadius: '999px',
                  border: `2px solid #E87A20`,
                  backgroundColor: 'transparent',
                  color: '#E87A20',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Cairo, sans-serif',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E87A20';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#E87A20';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                العودة إلى الأعلى ↑
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TermsOfServicePage;
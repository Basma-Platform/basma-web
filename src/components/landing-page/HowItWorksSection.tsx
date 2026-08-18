import { Container, Row, Col } from 'react-bootstrap';
import { FaUserPlus, FaBullhorn, FaWhatsapp, FaSearch, FaHandshake, FaCheckCircle } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const HowItWorksSection = () => {
  const { isDark } = useTheme();

  return (
    <section
      style={{
        padding: '5rem 0',
        backgroundColor: isDark ? '#16213e' : '#FFFFFF',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        {/* Section Title */}
        <div className="text-center mb-5">
          <h2
            style={{
              color: isDark ? '#FDF5E6' : '#6B4226',
              fontSize: 'clamp(2rem, 3vw, 2.8rem)',
              fontWeight: 700,
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            كيف تعمل المنصة؟
          </h2>
          <div
            style={{
              width: '60px',
              height: '4px',
              backgroundColor: '#E87A20',
              borderRadius: '2px',
              margin: '1rem auto 0',
            }}
          />
          <p
            style={{
              color: isDark ? '#C49A6C' : '#8B5A2B',
              fontSize: '1.1rem',
              marginTop: '1rem',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            اختر المسار المناسب لك
          </p>
        </div>

        {/* Two Flows Side by Side */}
        <Row className="g-4">
          {/* Flow 1: Offer (انشر عرضك) */}
          <Col xs={12} md={6}>
            <div
              style={{
                backgroundColor: isDark ? '#1e2a4a' : '#FDF5E6',
                borderRadius: '20px',
                padding: '2rem 1.5rem',
                height: '100%',
                border: '2px solid #E87A20',
                boxShadow: '0 4px 16px rgba(232, 122, 32, 0.08)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(232, 122, 32, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(232, 122, 32, 0.08)';
              }}
            >
              {/* Flow Title */}
              <div className="text-center mb-4">
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#E87A20',
                    color: 'white',
                    padding: '6px 24px',
                    borderRadius: '20px',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  لديّ خدمة أو سلعة
                </div>
              </div>

              {/* Steps */}
              <div style={{ position: 'relative' }}>
                {[
                  {
                    icon: <FaUserPlus size={24} color="#E87A20" />,
                    title: 'سجل حسابك',
                    desc: 'أنشئ حساب مجاني باستخدام بريدك الإلكتروني',
                  },
                  {
                    icon: <FaBullhorn size={24} color="#E87A20" />,
                    title: 'انشر إعلانك',
                    desc: 'أضف تفاصيل السلعة أو الخدمة التي تقدمها',
                  },
                  {
                    icon: <FaWhatsapp size={24} color="#25D366" />,
                    title: 'تواصل مع المهتمين',
                    desc: 'استقبل طلبات المهتمين وتواصل عبر واتساب',
                  },
                  {
                    icon: <FaHandshake size={24} color="#E87A20" />,
                    title: 'أتم الصفقة',
                    desc: 'التق بالطرف الآخر وأتم عملية التبادل',
                  },
                ].map((step, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                      paddingRight: '1rem',
                    }}
                  >
                    {/* Step Number */}
                    <div
                      style={{
                        minWidth: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: isDark ? '#1e2a4a' : '#FDF5E6',
                        border: '2px solid #E87A20',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#E87A20',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        fontFamily: 'Cairo, sans-serif',
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* Icon + Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {step.icon}
                        <span
                          style={{
                            color: isDark ? '#FDF5E6' : '#6B4226',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            fontFamily: 'Cairo, sans-serif',
                          }}
                        >
                          {step.title}
                        </span>
                      </div>
                      <p
                        style={{
                          color: isDark ? '#C49A6C' : '#8B5A2B',
                          fontSize: '0.9rem',
                          marginTop: '0.25rem',
                          marginRight: '2.5rem',
                          fontFamily: 'Cairo, sans-serif',
                        }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* Flow 2: Request (ابحث عن حاجتك) */}
          <Col xs={12} md={6}>
            <div
              style={{
                backgroundColor: isDark ? '#1e2a4a' : '#FDF5E6',
                borderRadius: '20px',
                padding: '2rem 1.5rem',
                height: '100%',
                border: '2px solid #8B5A2B',
                boxShadow: '0 4px 16px rgba(139, 90, 43, 0.08)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(139, 90, 43, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(139, 90, 43, 0.08)';
              }}
            >
              {/* Flow Title */}
              <div className="text-center mb-4">
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#8B5A2B',
                    color: 'white',
                    padding: '6px 24px',
                    borderRadius: '20px',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  أبحث عن خدمة أو سلعة
                </div>
              </div>

              {/* Steps */}
              <div style={{ position: 'relative' }}>
                {[
                  {
                    icon: <FaUserPlus size={24} color="#8B5A2B" />,
                    title: 'سجل حسابك',
                    desc: 'أنشئ حساب مجاني للوصول إلى جميع الإعلانات',
                  },
                  {
                    icon: <FaSearch size={24} color="#8B5A2B" />,
                    title: 'ابحث عن حاجتك',
                    desc: 'تصفح الإعلانات أو استخدم البحث للعثور على ما تريد',
                  },
                  {
                    icon: <FaWhatsapp size={24} color="#25D366" />,
                    title: 'تواصل مع المعلن',
                    desc: 'اطلع على رقم واتساب المعلن وتواصل معه مباشرة',
                  },
                  {
                    icon: <FaCheckCircle size={24} color="#28A745" />,
                    title: 'أتم الصفقة',
                    desc: 'التق بالطرف الآخر واحصل على ما تريد',
                  },
                ].map((step, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                      paddingRight: '1rem',
                    }}
                  >
                    {/* Step Number */}
                    <div
                      style={{
                        minWidth: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: isDark ? '#1e2a4a' : '#FDF5E6',
                        border: '2px solid #8B5A2B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isDark ? '#C49A6C' : '#8B5A2B',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        fontFamily: 'Cairo, sans-serif',
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* Icon + Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {step.icon}
                        <span
                          style={{
                            color: isDark ? '#FDF5E6' : '#6B4226',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            fontFamily: 'Cairo, sans-serif',
                          }}
                        >
                          {step.title}
                        </span>
                      </div>
                      <p
                        style={{
                          color: isDark ? '#C49A6C' : '#8B5A2B',
                          fontSize: '0.9rem',
                          marginTop: '0.25rem',
                          marginRight: '2.5rem',
                          fontFamily: 'Cairo, sans-serif',
                        }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HowItWorksSection;
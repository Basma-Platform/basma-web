import { Container, Row, Col } from 'react-bootstrap';
import { useTheme } from '../../context/ThemeContext';
import storyImage from '../../assets/Story.png';

const PlatformStory = () => {
  const { isDark } = useTheme();

  return (
    <section
      style={{
        padding: '4rem 0',
        backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        <Row className="align-items-center g-5">
          {/* Image Side */}
          <Col xs={12} lg={6}>
            <div
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.01)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <img
                src={storyImage}
                alt="قصة بصمة"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>
          </Col>

          {/* Text Side */}
          <Col xs={12} lg={6}>
            <div style={{ textAlign: 'right' }}>
              {/* Accent */}
              <div
                style={{
                  width: '50px',
                  height: '3px',
                  backgroundColor: '#E87A20',
                  borderRadius: '2px',
                  marginRight: 'auto',
                  marginLeft: 0,
                  marginBottom: '1.2rem',
                }}
              />

              <h2
                style={{
                  color: isDark ? '#e8e8e8' : '#6B4226',
                  fontSize: 'clamp(1.8rem, 2.5vw, 2.4rem)',
                  fontWeight: 700,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '1.2rem',
                }}
              >
                قصة بصمة
              </h2>

              <p
                style={{
                  color: isDark ? '#e8e8e8' : '#6B4226',
                  fontSize: '1rem',
                  lineHeight: 1.9,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '1rem',
                }}
              >
                لاحظنا من حاجة الأشخاص أنهم يتشتتون في نشر إعلاناتهم عند الحاجة 
                لطلب أو تقديم شيء، فيقومون بنشر إعلاناتهم وأرقام التواصل على 
                مواقع التواصل الاجتماعي المختلفة، مما يشتت الطلب ويصعّب عملية 
                البحث عن الفرص المناسبة.
              </p>

              <p
                style={{
                  color: isDark ? '#e8e8e8' : '#6B4226',
                  fontSize: '1rem',
                  lineHeight: 1.9,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '1rem',
                }}
              >
                كما أن التبادل عبر وسائل التواصل الاجتماعي يفتقر إلى معايير 
                الأمان والثقة، حيث لا توجد آليات للتحقق من هوية الأطراف أو 
                تقييم التجارب السابقة، مما يعرض المستخدمين لمخاطر التعامل مع 
                أشخاص غير موثوقين.
              </p>

              <p
                style={{
                  color: isDark ? '#e8e8e8' : '#6B4226',
                  fontSize: '1rem',
                  lineHeight: 1.9,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '1rem',
                }}
              >
                والمجتمع الغزاوي يزخر بالخير والكفاءات، وكل شخص لديه بصمة 
                يتركها في مجتمعه، سواء كان صاحب حرفة، أو مقدم خدمة، أو حتى 
                شخص يبحث عن فرصة لمساعدة غيره.
              </p>

              <p
                style={{
                  color: isDark ? '#C49A6C' : '#8B5A2B',
                  fontSize: '1rem',
                  lineHeight: 1.9,
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 600,
                  padding: '1rem 1.5rem',
                  backgroundColor: 'rgba(232, 122, 32, 0.06)',
                  borderRadius: '12px',
                  borderRight: '4px solid #E87A20',
                }}
              >
                من هنا وُلدت بصمة، لترسم طريقاً جديداً للتبادل المجتمعي،
                وتجمع شتات الإعلانات في مكان واحد، وتوفر بيئة آمنة وموثوقة 
                للتواصل والتبادل بروح التعاون والمحبة.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default PlatformStory;
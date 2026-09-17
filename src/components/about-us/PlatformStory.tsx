import { Container, Row, Col } from 'react-bootstrap';
import storyImage from '../../assets/Story.png';

const PlatformStory = () => {
  return (
    <section
      style={{
        padding: '5rem 0',
        backgroundColor: 'var(--bg-body)',
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
                boxShadow: '0 10px 30px var(--shadow-sm)',
                transition: 'all 0.4s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 18px 45px rgba(232, 122, 32, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px var(--shadow-sm)';
              }}
            >
              <img
                src={storyImage}
                alt="قصة بصمة"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  transition: 'transform 0.5s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
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
                  color: 'var(--text-secondary)',
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
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  lineHeight: 1.9,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '1rem',
                  textAlign: 'justify',
                  textJustify: 'inter-word',
                }}
              >
                لاحظنا من حاجة الأشخاص أنهم يتشتتون في نشر إعلاناتهم عند الحاجة 
                لطلب أو تقديم شيء، فيقومون بنشر إعلاناتهم وأرقام التواصل على 
                مواقع التواصل الاجتماعي المختلفة، مما يشتت الطلب ويصعّب عملية 
                البحث عن الفرص المناسبة.
              </p>

              <p
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  lineHeight: 1.9,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '1rem',
                  textAlign: 'justify',
                  textJustify: 'inter-word',
                }}
              >
                كما أن التبادل عبر وسائل التواصل الاجتماعي يفتقر إلى معايير 
                الأمان والثقة، حيث لا توجد آليات للتحقق من هوية الأطراف أو 
                تقييم التجارب السابقة، مما يعرض المستخدمين لمخاطر التعامل مع 
                أشخاص غير موثوقين.
              </p>

              <p
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  lineHeight: 1.9,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '1rem',
                  textAlign: 'justify',
                  textJustify: 'inter-word',
                }}
              >
                والمجتمع الغزاوي يزخر بالخير والكفاءات، وكل شخص لديه بصمة 
                يتركها في مجتمعه، سواء كان صاحب حرفة، أو مقدم خدمة، أو حتى 
                شخص يبحث عن فرصة لمساعدة غيره.
              </p>

              <div
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '1rem',
                  lineHeight: 1.9,
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 600,
                  padding: '1.2rem 1.5rem',
                  backgroundColor: 'rgba(232, 122, 32, 0.06)',
                  borderRadius: '12px',
                  borderRight: '4px solid #E87A20',
                  textAlign: 'justify',
                  textJustify: 'inter-word',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(232, 122, 32, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(232, 122, 32, 0.06)';
                }}
              >
                من هنا وُلدت بصمة، لترسم طريقاً جديداً للتبادل المجتمعي،
                وتجمع شتات الإعلانات في مكان واحد، وتوفر بيئة آمنة وموثوقة 
                للتواصل والتبادل بروح التعاون والمحبة.
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default PlatformStory;
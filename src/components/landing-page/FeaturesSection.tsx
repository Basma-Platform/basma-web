import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaShieldAlt, FaUsers, FaRocket } from 'react-icons/fa';

const FeaturesSection = () => {
  const features = [
    {
      icon: <FaShieldAlt size={40} color="#E87A20" />,
      title: 'تبادل آمن',
      description: 'جميع المستخدمين موثقون، يمكنك التبادل بثقة وأمان تام',
    },
    {
      icon: <FaUsers size={40} color="#E87A20" />,
      title: 'مجتمع موثوق',
      description: 'مجتمع من أهل غزة، يخدم بعضهم البعض بروح التعاون',
    },
    {
      icon: <FaRocket size={40} color="#E87A20" />,
      title: 'سهل وسريع',
      description: 'أنشر إعلانك في دقائق وتواصل مباشرة عبر واتساب',
    },
  ];

  return (
    <section
      style={{
        padding: '5rem 0',
        backgroundColor: 'var(--bg-white)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        <div className="text-center mb-5">
          <h2
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(2rem, 3vw, 2.8rem)',
              fontWeight: 700,
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            لماذا بصمة؟
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
        </div>

        <Row className="g-4">
          {features.map((feature, index) => (
            <Col key={index} xs={12} md={6} lg={4}>
              <Card
                className="h-100 text-center border-0 shadow-sm"
                style={{
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'var(--bg-card)',
                  padding: '2rem 1.5rem',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
                }}
              >
                <div className="mb-3">{feature.icon}</div>
                <Card.Title
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  {feature.title}
                </Card.Title>
                <Card.Text
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  {feature.description}
                </Card.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FeaturesSection;
import { Container, Row, Col } from 'react-bootstrap';
import { FaBullseye, FaEye, FaGem } from 'react-icons/fa';

const MissionVisionValues = () => {
  const items = [
    {
      icon: <FaBullseye size={36} color="#E87A20" />,
      title: 'رسالتنا',
      description:
        'تسهيل تبادل الموارد والخدمات بين أهالي غزة، وتعزيز روح التكافل والتعاون المجتمعي',
    },
    {
      icon: <FaEye size={36} color="#E87A20" />,
      title: 'رؤيتنا',
      description:
        'بناء مجتمع متكافل ومترابط، حيث يصبح التبادل أسلوب حياة يعزز القوة المجتمعية',
    },
    {
      icon: <FaGem size={36} color="#E87A20" />,
      title: 'قيمنا',
      description:
        'الثقة، التعاون، الشفافية، الأمان - هذه هي المبادئ التي نبني عليها منصتنا',
    },
  ];

  return (
    <section
      style={{
        padding: '4rem 0',
        backgroundColor: 'var(--bg-white)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        <Row className="g-4">
          {items.map((item, index) => (
            <Col key={index} xs={12} md={4}>
              <div
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '16px',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px var(--shadow-sm)',
                  border: '1px solid var(--border-color)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px var(--shadow-sm)';
                }}
              >
                <div className="mb-3">{item.icon}</div>

                <h3
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                    marginBottom: '0.75rem',
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.95rem',
                    lineHeight: 1.8,
                    fontFamily: 'Cairo, sans-serif',
                    marginBottom: 0,
                  }}
                >
                  {item.description}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default MissionVisionValues;
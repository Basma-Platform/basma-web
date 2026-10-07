import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  FaExchangeAlt,
  FaHandHoldingHeart,
  FaBullhorn,
} from 'react-icons/fa';

const AboutHero = () => {
  const pillars = [
    {
      Icon: FaExchangeAlt,
      label: 'تبادل الخدمات',
      color: '#E87A20',
    },
    {
      Icon: FaHandHoldingHeart,
      label: 'صندوق بصمة',
      color: '#17A2B8',
    },
    {
      Icon: FaBullhorn,
      label: 'منشورات المجتمع',
      color: '#9C27B0',
    },
  ];

  return (
    <section
      style={{
        padding: '5rem 0 3rem',
        backgroundColor: 'var(--bg-body)',
        textAlign: 'center',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={9}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
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
                  color: 'var(--text-secondary)',
                  fontSize: 'clamp(2.3rem, 4vw, 3.4rem)',
                  fontWeight: 900,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '1rem',
                  lineHeight: 1.2,
                }}
              >
                عن بصمة
              </h1>

              <h3
                style={{
                  color: 'var(--text-muted)',
                  fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)',
                  fontWeight: 600,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '1.75rem',
                  lineHeight: 1.5,
                }}
              >
                نبني مجتمعاً متكافلاً، حيث يجد كل فرد مكانه للتأثير
              </h3>

              {/* ============================================ */}
              {/* Body paragraph — CENTERED (not justified) */}
              {/* ============================================ */}
              <p
                style={{
                  color: 'var(--text-primary)',
                  fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
                  lineHeight: 2,
                  fontFamily: 'Cairo, sans-serif',
                  maxWidth: '720px',
                  margin: '0 auto 2rem',
                  textAlign: 'center',
                }}
              >
                بصمة منصة مجتمعية وُلدت من رحم الحاجة إلى التكافل الاجتماعي في
                غزة. نؤمن بأن قوة المجتمع تكمن في قدرة أفراده على مدّ يد
                العون لبعضهم البعض، وأن كل شخص قادر{' '}
                {/* ✨ Highlighted phrase */}
                <span
                  style={{
                    display: 'inline-block',
                    color: '#E87A20',
                    fontWeight: 900,
                    backgroundColor: 'rgba(232, 122, 32, 0.10)',
                    padding: '2px 10px',
                    borderRadius: '8px',
                    lineHeight: 1.6,
                    margin: '0 2px',
                  }}
                >
                  — بغض النظر عن حجم إمكانياته —
                </span>{' '}
                على ترك بصمة إيجابية في حياة الآخرين. من هنا جاءت فكرة بصمة:
                منصة واحدة تجمع ثلاث طرق للتأثير، فينسجم العطاء مع التعاون،
                ومعاً يصنعان مجتمعاً متماسكاً.
              </p>

              {/* ============================================ */}
              {/* Three pillar chips */}
              {/* ============================================ */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                  marginTop: '1.5rem',
                }}
              >
                {pillars.map((p) => {
                  const Icon = p.Icon;
                  return (
                    <motion.div
                      key={p.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      whileHover={{ y: -2 }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        borderRadius: '30px',
                        backgroundColor: 'var(--bg-card)',
                        border: `1.5px solid ${p.color}30`,
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: 'var(--text-secondary)',
                        boxShadow: '0 2px 12px var(--shadow-sm)',
                      }}
                    >
                      <span
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: `${p.color}15`,
                          color: p.color,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={12} />
                      </span>
                      {p.label}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutHero;
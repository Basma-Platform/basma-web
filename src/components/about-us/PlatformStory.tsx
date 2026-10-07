import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  FaExchangeAlt,
  FaHandHoldingHeart,
  FaBullhorn,
  FaQuoteRight,
  FaTimesCircle,
  FaCheckCircle,
  FaArrowLeft,
} from 'react-icons/fa';
import storyImage from '../../assets/Story.png';

const PlatformStory = () => {
  // ============================================
  // Three pillars (right side of the image)
  // ============================================
  const pillars = [
    {
      Icon: FaExchangeAlt,
      title: 'تبادل الخدمات',
      color: '#E87A20',
      text: 'لتتحوّل الحاجة إلى فرصة، ويعرض كل فرد ما يجيده، ويجد كل محتاج من يمدّ له يد العون.',
    },
    {
      Icon: FaHandHoldingHeart,
      title: 'صندوق بصمة',
      color: '#17A2B8',
      text: 'ليجد العطاء طريقه إلى من يستحقه، وتُوثَّق كل مساعدة كإنجاز مجتمعي يبقى خالداً.',
    },
    {
      Icon: FaBullhorn,
      title: 'منشورات المجتمع',
      color: '#9C27B0',
      text: 'لتصبح كلمة الحق حماية، ويجد المجتمع شبكة أمان تنقل الخبر وتحمي الأفراد.',
    },
  ];

  return (
    <section
      style={{
        padding: '4.5rem 0 5rem',
        backgroundColor: 'var(--bg-body)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        <Row className="align-items-center g-5">
          {/* ============================================ */}
          {/* Text side — the story */}
          {/* ============================================ */}
          <Col xs={12} lg={6}>
            <div style={{ textAlign: 'right' }}>
              {/* Section accent bar */}
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

              {/* Title */}
              <h2
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: 'clamp(1.8rem, 2.5vw, 2.4rem)',
                  fontWeight: 900,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '0.6rem',
                  lineHeight: 1.25,
                }}
              >
                قصة بصمة
              </h2>

              <p
                style={{
                  color: '#E87A20',
                  fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
                  fontWeight: 700,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '1.5rem',
                  lineHeight: 1.6,
                }}
              >
                من الفوضى إلى النظام، ومن التشتت إلى المجتمع
              </p>

              {/* --- Paragraph 1: the problem --- */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '0.6rem',
                }}
              >
                <span
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    color: '#DC3545',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FaTimesCircle size={13} />
                </span>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: '#DC3545',
                    fontFamily: 'Cairo, sans-serif',
                    letterSpacing: '0.3px',
                  }}
                >
                  الواقع قبل بصمة
                </span>
              </div>

              <p
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '0.98rem',
                  lineHeight: 1.95,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '1.25rem',
                  textAlign: 'justify',
                  textJustify: 'inter-word',
                }}
              >
                في غزة، حيث تتشابك الحاجة مع الكرامة، وُلدت بصمة من رحم تجربة
                واقعية. رأينا كيف يتشتّت الباحثون عن الخدمات بين عشرات
                المنشورات على مواقع التواصل الاجتماعي، وكيف يضيع وقتهم بين
                إعلانات غير منظّمة وثقة مفقودة، وكيف يبقى العطاء حبيس
                النوايا دون أن يصل إلى من يحتاجه فعلاً.
              </p>

              {/* --- Paragraph 2: the question --- */}
              <p
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '0.98rem',
                  lineHeight: 1.95,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '1.25rem',
                  textAlign: 'justify',
                  textJustify: 'inter-word',
                }}
              >
                من هذه الفجوة، جاء السؤال: كيف نجمع الأطراف الثلاثة في مكان
                واحد آمن وموثوق؟ من يبحث عن خدمة، ومن يقدّمها، ومن يريد أن
                يدعم دون أن يعرف كيف أو لمن. بصمة هي الجواب: منصة واحدة
                تُحوّل النوايا الطيبة إلى فعل منظّم وموثّق.
              </p>

              {/* --- Divider with pillar transition --- */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '0.6rem',
                  marginTop: '1.5rem',
                }}
              >
                <span
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(40, 167, 69, 0.12)',
                    color: '#28A745',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FaCheckCircle size={13} />
                </span>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: '#28A745',
                    fontFamily: 'Cairo, sans-serif',
                    letterSpacing: '0.3px',
                  }}
                >
                  الحل: ثلاث ركائز متكاملة
                </span>
              </div>

              {/* --- Pillar blocks --- */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginBottom: '1.5rem',
                }}
              >
                {pillars.map((p, index) => {
                  const Icon = p.Icon;
                  return (
                    <motion.div
                      key={p.title}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        padding: '14px 16px',
                        borderRadius: '14px',
                        backgroundColor: 'var(--bg-card)',
                        border: `1px solid ${p.color}25`,
                        transition: 'all 0.25s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = p.color;
                        e.currentTarget.style.transform = 'translateX(-4px)';
                        e.currentTarget.style.boxShadow = `0 6px 20px ${p.color}15`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${p.color}25`;
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <span
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          backgroundColor: `${p.color}15`,
                          color: p.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={16} />
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.92rem',
                            fontWeight: 800,
                            fontFamily: 'Cairo, sans-serif',
                            marginBottom: '4px',
                          }}
                        >
                          {p.title}
                        </div>
                        <div
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.82rem',
                            lineHeight: 1.7,
                            fontFamily: 'Cairo, sans-serif',
                            textAlign: 'justify',
                            textJustify: 'inter-word',
                          }}
                        >
                          {p.text}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* --- Closing quote --- */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{
                  position: 'relative',
                  padding: '1.25rem 1.5rem',
                  backgroundColor: 'rgba(232, 122, 32, 0.06)',
                  borderRadius: '14px',
                  borderRight: '4px solid #E87A20',
                  textAlign: 'justify',
                  textJustify: 'inter-word',
                }}
              >
                <FaQuoteRight
                  size={18}
                  color="#E87A20"
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '16px',
                    backgroundColor: 'var(--bg-body)',
                    padding: '4px',
                    borderRadius: '50%',
                    opacity: 0.5,
                  }}
                />
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.98rem',
                    lineHeight: 1.95,
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  بصمة ليست مجرّد منصة رقمية؛ إنها وعد بأن كل فرد في مجتمعنا
                  قادر على التأثير، وأن العطاء والتعاون يمكن أن يصبحا جزءاً
                  من نسيج حياتنا اليومية. سعينا نحو مجتمع متكامل ومترابط،
                  حيث يجد كل محتاج يداً ممدودة، وكل صاحب أثر مكاناً ليبصم.
                </p>
              </motion.div>
            </div>
          </Col>

          {/* ============================================ */}
          {/* Image side — story visual */}
          {/* ============================================ */}
          <Col xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px var(--shadow-md)',
                transition: 'all 0.4s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow =
                  '0 24px 70px rgba(232, 122, 32, 0.22)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 20px 60px var(--shadow-md)';
              }}
            >
              {/* Image */}
              <img
                src={storyImage}
                alt="قصة بصمة — من التشتت إلى المجتمع المترابط"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  transition: 'transform 0.6s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />

              {/* ============================================ */}
              {/* ✨ Caption pill — responsive, wraps on small screens */}
              {/* ============================================ */}
              <div className="story-caption-wrap">
                <div className="story-caption-pill">
                  <span className="story-caption-text">
                    من التشتت في مواقع التواصل
                  </span>

                  <span className="story-caption-arrow" aria-hidden="true">
                    <FaArrowLeft size={10} />
                  </span>

                  <span className="story-caption-text">
                    إلى مجتمع بصمة المترابط
                  </span>
                </div>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* ============================================ */}
      {/* Responsive styles for caption pill */}
      {/* ============================================ */}
      <style>{`
        .story-caption-wrap {
          position: absolute;
          bottom: 18px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 16px;
          pointer-events: none;
        }

        .story-caption-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 10px 22px;
          border-radius: 30px;
          background-color: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
          direction: rtl;
          max-width: 90%;
          text-align: center;
          transition: all 0.3s ease;
        }

        .story-caption-text {
          color: #FFFFFF;
          font-size: 0.82rem;
          font-family: 'Cairo', sans-serif;
          font-weight: 700;
          line-height: 1.5;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
          white-space: nowrap;
        }

        .story-caption-arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #E87A20;
          background-color: rgba(232, 122, 32, 0.18);
          width: 22px;
          height: 22px;
          border-radius: 50%;
          line-height: 1;
        }

        /* Tablet & below — allow wrap */
        @media (max-width: 991px) {
          .story-caption-pill {
            max-width: 92%;
            padding: 10px 18px;
            gap: 8px;
          }
        }

        /* Small phones — stack vertically, tighter padding */
        @media (max-width: 576px) {
          .story-caption-wrap {
            bottom: 12px;
            padding: 0 12px;
          }
          .story-caption-pill {
            flex-direction: column;
            gap: 6px;
            padding: 10px 16px;
            border-radius: 20px;
            max-width: 94%;
          }
          .story-caption-text {
            font-size: 0.74rem;
            white-space: normal;
            text-align: center;
            line-height: 1.4;
          }
          .story-caption-arrow {
            width: 20px;
            height: 20px;
            /* Rotate arrow to point down when stacked */
            transform: rotate(-90deg);
          }
        }

        /* Extra small phones */
        @media (max-width: 380px) {
          .story-caption-text {
            font-size: 0.7rem;
          }
          .story-caption-pill {
            padding: 8px 12px;
            gap: 4px;
          }
          .story-caption-arrow {
            width: 18px;
            height: 18px;
          }
        }
      `}</style>
    </section>
  );
};

export default PlatformStory;
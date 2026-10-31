import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  EXPLORE_COPY,
  EXPLORE_DESIGN,
  EXPLORE_POINTS,
} from '../../utils/exploreHelpers';
import { FaQuoteRight } from 'react-icons/fa';

const EASE = EXPLORE_DESIGN.ease_out_expo;

const ExploreMessage = () => {
  return (
    <section
      style={{
        paddingTop: 'clamp(3rem, 6vw, 4rem)',
        paddingBottom: 'clamp(3rem, 6vw, 4rem)',
        backgroundColor: 'var(--bg-body)',
        position: 'relative',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          {/* Eyebrow */}
          <span
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '999px',
              backgroundColor: 'rgba(232, 122, 32, 0.10)',
              border: '1px solid rgba(232, 122, 32, 0.25)',
              color: '#E87A20',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.76rem',
              fontWeight: 800,
              marginBottom: '1.25rem',
            }}
          >
            {EXPLORE_COPY.message_eyebrow}
          </span>

          {/* Title — block level so long lines wrap instead of overflowing */}
          <h2
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(1.6rem, 3.4vw, 2.5rem)',
              fontWeight: 900,
              fontFamily: 'Cairo, sans-serif',
              lineHeight: 1.35,
              margin: '0 auto 0.75rem',
              maxWidth: '100%',
            }}
          >
            {EXPLORE_COPY.message_title}
          </h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            style={{
              width: 'min(220px, 50%)',
              height: '3px',
              borderRadius: '2px',
              margin: '0 auto 2rem',
              background:
                'linear-gradient(90deg, transparent, #E87A20, transparent)',
            }}
          />

          <FaQuoteRight
            size={26}
            color="#E87A20"
            style={{
              opacity: 0.18,
              display: 'block',
              margin: '0 auto 1rem',
            }}
            aria-hidden="true"
          />

          {/* Body */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              maxWidth: '780px',
              margin: '0 auto',
            }}
          >
            {EXPLORE_COPY.message_body.map((paragraph, idx) => (
              <p
                key={idx}
                style={{
                  color: idx === 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: idx === 0 ? '1.05rem' : '0.97rem',
                  fontFamily: 'Cairo, sans-serif',
                  lineHeight: 2,
                  margin: 0,
                  fontWeight: idx === 0 ? 600 : 400,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Why-Basma points */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, 190px), 1fr))',
              gap: '14px',
              marginTop: '2.75rem',
            }}
          >
            {EXPLORE_POINTS.map(({ Icon, title, description }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: EASE }}
                style={{
                  padding: '1.1rem 1rem',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 4px 16px var(--shadow-sm)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    margin: '0 auto 0.7rem',
                    background: 'linear-gradient(135deg, #F5A623, #E87A20)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={18} />
                </div>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.95rem',
                    fontWeight: 900,
                    marginBottom: '4px',
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.8rem',
                    lineHeight: 1.7,
                  }}
                >
                  {description}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Lead-in to the pillars */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              gap: '14px',
              marginTop: '3rem',
              height: '44px',
            }}
            aria-hidden="true"
          >
            {[
              { h: 32, bg: 'linear-gradient(180deg, #F5A623, #E87A20)' },
              { h: 44, bg: 'linear-gradient(180deg, #20C9E0, #17A2B8)' },
              { h: 32, bg: 'linear-gradient(180deg, #BA68C8, #9C27B0)' },
            ].map((bar, i) => (
              <motion.div
                key={i}
                animate={{ scaleY: [1, 1.15, 1] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.25,
                }}
                style={{
                  width: '10px',
                  height: `${bar.h}px`,
                  borderRadius: '3px',
                  background: bar.bg,
                  originY: 1,
                }}
              />
            ))}
          </div>
          <p
            style={{
              color: 'var(--text-muted)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.8rem',
              fontWeight: 700,
              margin: '0.75rem 0 0',
              opacity: 0.75,
            }}
          >
            ↓ الأعمدة الثلاثة ↓
          </p>
        </motion.div>
      </Container>
    </section>
  );
};

export default ExploreMessage;

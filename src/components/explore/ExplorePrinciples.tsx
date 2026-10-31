import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  EXPLORE_COPY,
  EXPLORE_DESIGN,
  EXPLORE_PRINCIPLES,
} from '../../utils/exploreHelpers';
import SectionHeading from './SectionHeading';

const EASE = EXPLORE_DESIGN.ease_out_expo;

const ExplorePrinciples = () => {
  return (
    <section
      style={{
        paddingTop: 'clamp(3.5rem, 7vw, 5rem)',
        paddingBottom: 'clamp(3.5rem, 7vw, 5rem)',
        backgroundColor: 'var(--bg-white)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        <SectionHeading
          title={EXPLORE_COPY.principles_title}
          subtitle={EXPLORE_COPY.principles_subtitle}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: '18px',
            maxWidth: '1060px',
            margin: '0 auto',
          }}
        >
          {EXPLORE_PRINCIPLES.map(({ Icon, title, items }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: EASE }}
              style={{
                padding: '1.5rem 1.35rem',
                borderRadius: '18px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 4px 16px var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '13px',
                  marginBottom: '1rem',
                  background: 'linear-gradient(135deg, #E87A20, #8B5A2B)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 16px rgba(232,122,32,0.3)',
                }}
              >
                <Icon size={19} />
              </div>

              <h3
                style={{
                  color: 'var(--text-secondary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  margin: '0 0 0.75rem',
                }}
              >
                {title}
              </h3>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '9px',
                }}
              >
                {items.map((item) => (
                  <li
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '9px',
                      color: 'var(--text-muted)',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.85rem',
                      lineHeight: 1.7,
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: '6px',
                        height: '6px',
                        marginTop: '0.6em',
                        borderRadius: '50%',
                        backgroundColor: '#E87A20',
                      }}
                    />
                    <span style={{ minWidth: 0 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ExplorePrinciples;

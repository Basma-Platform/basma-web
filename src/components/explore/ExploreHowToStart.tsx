import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaUserPlus, FaCompass, FaHandsHelping } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { EXPLORE_COPY, EXPLORE_DESIGN } from '../../utils/exploreHelpers';
import SectionHeading from './SectionHeading';

const EASE = EXPLORE_DESIGN.ease_out_expo;

// Parallel to EXPLORE_COPY.howto_steps
const STEP_ICONS: IconType[] = [FaUserPlus, FaCompass, FaHandsHelping];

const ExploreHowToStart = () => {
  const steps = EXPLORE_COPY.howto_steps;

  return (
    <section
      style={{
        paddingTop: 'clamp(3.5rem, 7vw, 5rem)',
        paddingBottom: 'clamp(3.5rem, 7vw, 5rem)',
        backgroundColor: 'var(--bg-body)',
        position: 'relative',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        <SectionHeading title={EXPLORE_COPY.howto_title} />

        <div className="explore-steps-row">
          {/* Horizontal connecting line (desktop only) */}
          <motion.div
            className="explore-steps-line"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4, ease: EASE }}
          />

          {steps.map((step, idx) => {
            const Icon = STEP_ICONS[idx];

            return (
              <motion.div
                key={step.number}
                className="explore-step"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: idx * 0.15, ease: EASE }}
              >
                {/* Icon + number badge */}
                <div className="explore-step-icon-wrap">
                  <motion.div
                    className="explore-step-pulse"
                    animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: 'easeOut',
                      delay: idx * 0.4,
                    }}
                  />
                  <div className="explore-step-icon">
                    <Icon size={30} />
                  </div>
                  <div className="explore-step-badge">{step.number}</div>
                </div>

                <h3 className="explore-step-title">{step.title}</h3>
                <p className="explore-step-desc">{step.description}</p>

                {idx < steps.length - 1 && (
                  <span className="explore-step-connector" aria-hidden="true" />
                )}
              </motion.div>
            );
          })}
        </div>
      </Container>

      <style>{`
        .explore-steps-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.5rem;
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
        }

        .explore-steps-line {
          position: absolute;
          top: 42px;
          right: 16.66%;
          left: 16.66%;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #E87A20, #8B5A2B);
          opacity: 0.35;
          transform-origin: center;
          z-index: 0;
        }

        .explore-step {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .explore-step-icon-wrap {
          position: relative;
          width: 84px;
          height: 84px;
          margin-bottom: 1.25rem;
        }

        .explore-step-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid #E87A20;
          pointer-events: none;
        }

        .explore-step-icon {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          background: linear-gradient(135deg, #F5A623, #E87A20);
          box-shadow:
            0 8px 24px rgba(232, 122, 32, 0.35),
            inset 0 -4px 8px rgba(0, 0, 0, 0.15),
            inset 0 4px 8px rgba(255, 255, 255, 0.25);
        }

        .explore-step-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          z-index: 2;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-card);
          border: 2px solid #E87A20;
          color: #E87A20;
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
          font-size: 0.78rem;
          font-weight: 900;
          box-shadow: 0 2px 8px rgba(232, 122, 32, 0.3);
        }

        .explore-step-title {
          color: var(--text-secondary);
          font-family: 'Cairo', sans-serif;
          font-size: 1.12rem;
          font-weight: 900;
          line-height: 1.35;
          margin: 0 0 0.6rem;
        }

        .explore-step-desc {
          color: var(--text-muted);
          font-family: 'Cairo', sans-serif;
          font-size: 0.88rem;
          line-height: 1.85;
          max-width: 290px;
          margin: 0;
        }

        .explore-step-connector {
          display: none;
        }

        @media (max-width: 768px) {
          .explore-steps-row {
            grid-template-columns: minmax(0, 1fr);
            gap: 2.75rem;
          }
          .explore-steps-line {
            display: none;
          }
          .explore-step-connector {
            display: block;
            position: absolute;
            bottom: -2.1rem;
            left: 50%;
            width: 2px;
            height: 1.5rem;
            transform: translateX(-50%);
            border-radius: 1px;
            background: linear-gradient(180deg, #E87A20, #8B5A2B);
            opacity: 0.4;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .explore-step-pulse {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default ExploreHowToStart;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import type { FAQ } from '../../types';

interface FAQAccordionProps {
  faqs: FAQ[];
  loading: boolean;
  isDark: boolean;
  itemVariants: any;
}

const FAQAccordion = ({ faqs, loading, isDark, itemVariants }: FAQAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div
          className="spinner-border"
          style={{ color: '#E87A20', width: '3rem', height: '3rem' }}
        />
        <p
          style={{
            color: isDark ? '#C49A6C' : '#8B5A2B',
            marginTop: '1rem',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          جاري تحميل الأسئلة...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <motion.div
            key={faq.id}
            variants={itemVariants}
            style={{
              backgroundColor: isDark ? '#16213e' : '#FFFFFF',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: isDark
                ? '0 4px 16px rgba(0,0,0,0.2)'
                : '0 4px 16px rgba(0,0,0,0.04)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.06)'}`,
              transition: 'all 0.3s ease',
            }}
          >
            {/* Question */}
            <button
              onClick={() => toggleItem(index)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 24px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: isDark ? '#FDF5E6' : '#6B4226',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '1.05rem',
                fontWeight: 600,
                textAlign: 'right',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(139,90,43,0.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span style={{ flex: 1, paddingLeft: '12px' }}>{faq.question}</span>
              {isOpen ? (
                <FaChevronUp size={18} color="#E87A20" />
              ) : (
                <FaChevronDown size={18} color="#C49A6C" />
              )}
            </button>

            {/* Answer */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    style={{
                      padding: '0 24px 20px 24px',
                      color: isDark ? '#C49A6C' : '#6B4226',
                      fontSize: '0.98rem',
                      lineHeight: 1.8,
                      fontFamily: 'Cairo, sans-serif',
                      borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.06)'}`,
                      paddingTop: '16px',
                    }}
                  >
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FAQAccordion;
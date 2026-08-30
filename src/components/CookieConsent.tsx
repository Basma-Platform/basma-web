import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCookieBite, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const CONSENT_KEY = 'basma_cookie_notice_dismissed';

/**
 * This is a transparency notice, not a consent gate. The cookies involved
 * (Laravel's session cookie + the XSRF-TOKEN CSRF cookie) are strictly
 * necessary for the site to function — they're what keeps you logged in
 * securely — not tracking or advertising cookies. Most privacy frameworks
 * (GDPR included) exempt strictly-necessary cookies from requiring active
 * consent before use, which is why this doesn't block anything and doesn't
 * need an "accept/reject" choice — just an acknowledgment.
 */
const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(CONSENT_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(CONSENT_KEY, '1');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          role="region"
          aria-label="إشعار ملفات تعريف الارتباط"
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            right: '20px',
            zIndex: 2000,
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '16px 20px',
            boxShadow: '0 12px 48px var(--shadow-md)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            direction: 'rtl',
            maxWidth: '720px',
            margin: '0 auto',
          }}
        >
          {/* Left: Icon + Text */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flex: '1 1 300px',
              minWidth: '200px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(232,122,32,0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FaCookieBite size={18} color="var(--primary-orange)" />
            </div>

            <div style={{ flex: 1, minWidth: '120px' }}>
              <p
                style={{
                  margin: 0,
                  color: 'var(--text-secondary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  lineHeight: 1.6,
                }}
              >
                نستخدم فقط ملفات تعريف ارتباط أساسية لتأمين دخولك.
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {' '}
                  لا نستخدمها للتتبع أو الإعلانات.
                </span>
              </p>
              <Link
                to="/privacy-policy"
                style={{
                  color: 'var(--primary-orange)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textDecoration: 'none',
                  fontFamily: 'Cairo, sans-serif',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary-orange-dark)';
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--primary-orange)';
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                سياسة الخصوصية →
              </Link>
            </div>
          </div>

          {/* Right: Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
            }}
          >
            <motion.button
              onClick={dismiss}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                backgroundColor: 'var(--primary-orange)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '30px',
                padding: '8px 20px',
                fontWeight: 700,
                fontSize: '0.8rem',
                fontFamily: 'Cairo, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 16px rgba(232,122,32,0.2)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-orange-dark)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(232,122,32,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(232,122,32,0.2)';
              }}
            >
              حسناً
            </motion.button>

            <motion.button
              onClick={dismiss}
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.08)';
                e.currentTarget.style.color = '#DC3545';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
              aria-label="إغلاق الإشعار"
            >
              <FaTimes size={14} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
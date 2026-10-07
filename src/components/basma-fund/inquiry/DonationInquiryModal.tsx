import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaHandHoldingHeart,
  FaUser,
  FaWhatsapp,
  FaEnvelope,
  FaCommentDots,
  FaInfoCircle,
  FaTicketAlt,
  FaCheckCircle,
} from 'react-icons/fa';
import { useDonationInquiry } from '../../../hooks/useDonationInquiry';
import { useDonationContact } from '../../../hooks/useDonationContact';
import { FUND_THEME } from '../../../utils/helpRequestHelpers';
import {
  buildWhatsAppLink,
  buildMailtoLink,
} from '../../../utils/donationHelpers';
import type {
  HelpRequestPublic,
  DonationInquiryCreateResponse,
} from '../../../types';
import InquirySuccessCard from './InquirySuccessCard';

interface DonationInquiryModalProps {
  isOpen: boolean;
  request: HelpRequestPublic | null;
  onClose: () => void;
}

const MAX_MESSAGE = 1000;
const MAX_NAME = 100;

type ContactMethod = 'whatsapp' | 'email' | 'platform';

// ============================================
// Contact method options
// ============================================
interface ContactOption {
  value: ContactMethod;
  label: string;
  shortLabel: string;
  description: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
}

const CONTACT_OPTIONS: ContactOption[] = [
  {
    value: 'whatsapp',
    label: 'واتساب',
    shortLabel: 'عبر واتساب',
    description: 'أرسل رقمك وسنتواصل معك على واتساب',
    Icon: FaWhatsapp,
    color: '#25D366',
  },
  {
    value: 'email',
    label: 'بريد إلكتروني',
    shortLabel: 'عبر البريد',
    description: 'أرسل بريدك الإلكتروني وسنراسلك',
    Icon: FaEnvelope,
    color: '#17A2B8',
  },
  {
    value: 'platform',
    label: 'اتركها لنا',
    shortLabel: 'من خلال المنصة',
    description: 'أدخل واتساب أو بريدك — سنتواصل معك بالطريقة الأنسب',
    Icon: FaHandHoldingHeart,
    color: '#E87A20',
  },
];

const DonationInquiryModal = ({
  isOpen,
  request,
  onClose,
}: DonationInquiryModalProps) => {
  const {
    submitting,
    duplicateDetected,
    createInquiry,
    resetDuplicateFlag,
  } = useDonationInquiry();

  const { contact } = useDonationContact();

  // ── Form state ──
  const [donorName, setDonorName] = useState('');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('whatsapp');
  const [donorWhatsapp, setDonorWhatsapp] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');

  const [successResponse, setSuccessResponse] =
    useState<DonationInquiryCreateResponse['data'] | null>(null);

  // ── Reset on open ──
  useEffect(() => {
    if (isOpen) {
      setDonorName('');
      setContactMethod('whatsapp');
      setDonorWhatsapp('');
      setDonorEmail('');
      setMessage('');
      setSuccessResponse(null);
      resetDuplicateFlag();
    }
  }, [isOpen, resetDuplicateFlag]);

  // ── Validation ──
  const validation = useMemo(() => {
    const whatsappValid =
      contactMethod === 'whatsapp'
        ? donorWhatsapp.trim().length >= 9
        : true;
    const emailValid =
      contactMethod === 'email'
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail.trim())
        : true;
    const platformValid =
      contactMethod === 'platform'
        ? donorWhatsapp.trim().length > 0 ||
          donorEmail.trim().length > 0
        : true;

    return {
      whatsappValid,
      emailValid,
      platformValid,
      isValid: whatsappValid && emailValid && platformValid,
    };
  }, [contactMethod, donorWhatsapp, donorEmail]);

  if (!request) return null;

  // ── Handlers ──
  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid) return;

    try {
      const response = await createInquiry({
        help_request_id: request.id,
        donor_name: donorName.trim() || undefined,
        donor_whatsapp:
          contactMethod === 'email' ? undefined : donorWhatsapp.trim() || undefined,
        donor_email:
          contactMethod === 'whatsapp' ? undefined : donorEmail.trim() || undefined,
        message: message.trim() || undefined,
        contact_method: contactMethod,
      });
      setSuccessResponse(response.data);
    } catch {
      // handled in hook — duplicateDetected flag will be true for 409
    }
  };

  // ── Current view ──
  const view: 'form' | 'success' | 'duplicate' = successResponse
    ? 'success'
    : duplicateDetected
    ? 'duplicate'
    : 'form';

  // ── Current contact option ──
  const currentOption = CONTACT_OPTIONS.find(
    (o) => o.value === contactMethod
  )!;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="dim-backdrop"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="dim-modal"
            dir="rtl"
          >
            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              aria-label="إغلاق"
              className="dim-close"
            >
              <FaTimes size={12} />
            </button>

            <div className="dim-body">
              {/* ============================================ */}
              {/* SUCCESS VIEW */}
              {/* ============================================ */}
              {view === 'success' && successResponse && (
                <InquirySuccessCard
                  response={successResponse}
                  onClose={handleClose}
                />
              )}

              {/* ============================================ */}
              {/* DUPLICATE VIEW */}
              {/* ============================================ */}
              {view === 'duplicate' && (
                <div className="dim-duplicate">
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 240,
                      damping: 18,
                    }}
                    className="dim-duplicate__icon"
                  >
                    <FaTicketAlt size={30} />
                  </motion.div>

                  <h3 className="dim-duplicate__title">
                    لديك استفسار سابق لهذا الطلب
                  </h3>
                  <p className="dim-duplicate__text">
                    يبدو أنك قد أرسلت استفساراً حول هذا الطلب من قبل. لا حاجة
                    لإرسال استفسار آخر — سيتواصل معك فريق المنصة قريباً.
                  </p>

                  <div className="dim-duplicate__info">
                    <FaInfoCircle size={13} className="dim-duplicate__info-icon" />
                    <div className="dim-duplicate__info-text">
                      <strong>كود التتبع الخاص بك</strong> وصل إليك عند إرسال
                      الاستفسار الأول. إن فقدته، تواصل مع المنصة لاستعادته.
                    </div>
                  </div>

                  <div className="dim-duplicate__divider">
                    <span>تواصل معنا لاستعادة كود التتبع</span>
                  </div>

                  <div className="dim-duplicate__contacts">
                    {contact.whatsapp && (
                      <a
                        href={buildWhatsAppLink(
                          contact.whatsapp,
                          `مرحباً، أريد استعادة كود التتبع للاستفسار #${request.id}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dim-contact-chip dim-contact-chip--wa"
                      >
                        <FaWhatsapp size={13} />
                        واتساب المنصة
                      </a>
                    )}

                    {contact.email && (
                      <a
                        href={buildMailtoLink(
                          contact.email,
                          'استعادة كود التتبع - صندوق بصمة'
                        )}
                        className="dim-contact-chip dim-contact-chip--email"
                      >
                        <FaEnvelope size={12} />
                        بريد المنصة
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="dim-btn-close"
                  >
                    إغلاق
                  </button>
                </div>
              )}

              {/* ============================================ */}
              {/* FORM VIEW */}
              {/* ============================================ */}
              {view === 'form' && (
                <>
                  {/* Header */}
                  <div className="dim-header">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 240,
                        damping: 16,
                        delay: 0.1,
                      }}
                      className="dim-header__icon"
                    >
                      <FaHandHoldingHeart size={24} />
                    </motion.div>
                    <h3 className="dim-header__title">استفسار تبرع</h3>
                    <p className="dim-header__subtitle">
                      سجّل بياناتك للحصول على رابط مشاهدة الفيديو (مرة واحدة فقط).
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} noValidate>
                    {/* ─── 1. Name (optional) ─── */}
                    <div className="dim-field">
                      <label className="dim-label">
                        <FaUser size={10} color={FUND_THEME.accent} />
                        الاسم
                        <span className="dim-label__hint">(اختياري)</span>
                      </label>
                      <input
                        type="text"
                        value={donorName}
                        onChange={(e) =>
                          setDonorName(e.target.value.slice(0, MAX_NAME))
                        }
                        disabled={submitting}
                        placeholder="اسمك الكريم"
                        maxLength={MAX_NAME}
                        className="dim-input"
                      />
                    </div>

                    {/* ─── 2. Contact Method Picker ─── */}
                    <div className="dim-field">
                      <label className="dim-label">
                        <FaCommentDots size={11} color={FUND_THEME.accent} />
                        كيف تفضل أن نتواصل معك؟
                        <span className="dim-label__required">*</span>
                      </label>

                      <div className="dim-contact-grid">
                        {CONTACT_OPTIONS.map((opt) => {
                          const isActive = contactMethod === opt.value;
                          const Icon = opt.Icon;
                          return (
                            <motion.button
                              key={opt.value}
                              type="button"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setContactMethod(opt.value)}
                              disabled={submitting}
                              className={`dim-contact-card ${
                                isActive ? 'is-active' : ''
                              }`}
                              style={{
                                borderColor: isActive
                                  ? opt.color
                                  : 'var(--border-color)',
                                backgroundColor: isActive
                                  ? `${opt.color}10`
                                  : 'var(--bg-input)',
                              }}
                            >
                              <div
                                className="dim-contact-card__icon"
                                style={{
                                  backgroundColor: `${opt.color}18`,
                                  color: opt.color,
                                }}
                              >
                                <Icon size={14} />
                              </div>
                              <div className="dim-contact-card__label">
                                {opt.shortLabel}
                              </div>
                              {isActive && (
                                <div
                                  className="dim-contact-card__check"
                                  style={{ backgroundColor: opt.color }}
                                >
                                  <FaCheckCircle size={9} />
                                </div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>

                      <div className="dim-contact-hint">
                        <FaInfoCircle size={10} />
                        <span>{currentOption.description}</span>
                      </div>
                    </div>

                    {/* ─── 3. Dynamic Fields ─── */}
                    {/* WhatsApp input — shown for whatsapp + platform */}
                    {(contactMethod === 'whatsapp' ||
                      contactMethod === 'platform') && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="dim-field"
                      >
                        <label className="dim-label">
                          <FaWhatsapp size={11} color="#25D366" />
                          رقم الواتساب
                          {contactMethod === 'whatsapp' && (
                            <span className="dim-label__required">*</span>
                          )}
                          {contactMethod === 'platform' && (
                            <span className="dim-label__hint">(اختياري)</span>
                          )}
                        </label>
                        <input
                          type="tel"
                          value={donorWhatsapp}
                          onChange={(e) => setDonorWhatsapp(e.target.value)}
                          disabled={submitting}
                          placeholder="+970599123456"
                          dir="ltr"
                          className="dim-input dim-input--ltr"
                        />

                        {/* Platform WhatsApp CTA (only for whatsapp choice) */}
                        {contactMethod === 'whatsapp' && contact.whatsapp && (
                          <div className="dim-alt-contact dim-alt-contact--wa">
                            <FaWhatsapp size={11} />
                            <span>أو تواصل معنا مباشرة:</span>
                            <a
                              href={buildWhatsAppLink(
                                contact.whatsapp,
                                `مرحباً، لدي استفسار حول الطلب #${request.id}`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="dim-alt-contact__link"
                            >
                              {contact.whatsapp}
                            </a>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Email input — shown for email + platform */}
                    {(contactMethod === 'email' ||
                      contactMethod === 'platform') && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="dim-field"
                      >
                        <label className="dim-label">
                          <FaEnvelope size={11} color={FUND_THEME.accent} />
                          البريد الإلكتروني
                          {contactMethod === 'email' && (
                            <span className="dim-label__required">*</span>
                          )}
                          {contactMethod === 'platform' && (
                            <span className="dim-label__hint">(اختياري)</span>
                          )}
                        </label>
                        <input
                          type="email"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          disabled={submitting}
                          placeholder="donor@example.com"
                          dir="ltr"
                          className="dim-input dim-input--ltr"
                        />

                        {/* Platform Email CTA (only for email choice) */}
                        {contactMethod === 'email' && contact.email && (
                          <div className="dim-alt-contact dim-alt-contact--email">
                            <FaEnvelope size={11} />
                            <span>أو راسلنا مباشرة:</span>
                            <a
                              href={buildMailtoLink(
                                contact.email,
                                `استفسار حول الطلب #${request.id}`
                              )}
                              className="dim-alt-contact__link"
                            >
                              {contact.email}
                            </a>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Platform hint — both fields required */}
                    {contactMethod === 'platform' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="dim-platform-hint"
                      >
                        <FaInfoCircle size={11} />
                        <span>
                          أدخل رقم واتساب أو بريدك الإلكتروني على الأقل —
                          أحدهما إلزامي.
                        </span>
                      </motion.div>
                    )}

                    {/* ─── 4. Message ─── */}
                    <div className="dim-field">
                      <label className="dim-label">
                        <FaCommentDots size={11} color={FUND_THEME.accent} />
                        رسالة
                        <span className="dim-label__hint">(اختياري)</span>
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) =>
                          setMessage(e.target.value.slice(0, MAX_MESSAGE))
                        }
                        disabled={submitting}
                        placeholder="اكتب رسالتك للمنصة..."
                        rows={3}
                        maxLength={MAX_MESSAGE}
                        className="dim-textarea"
                      />
                      {message.length > 0 && (
                        <div className="dim-charcount">
                          {message.length}/{MAX_MESSAGE}
                        </div>
                      )}
                    </div>

                    {/* ─── Submit ─── */}
                    <motion.button
                      type="submit"
                      disabled={submitting || !validation.isValid}
                      whileHover={
                        !submitting && validation.isValid
                          ? { scale: 1.02, y: -1 }
                          : {}
                      }
                      whileTap={
                        !submitting && validation.isValid
                          ? { scale: 0.97 }
                          : {}
                      }
                      className="dim-submit"
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm dim-spinner" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <FaHandHoldingHeart size={14} />
                          تأكيد الاستفسار
                        </>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ============================================ */}
      {/* Scoped styles */}
      {/* ============================================ */}
      <style>{`
        /* ── Backdrop ── */
        .dim-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(0,0,0,0.65);
          backdrop-filter: blur(4px);
          z-index: 1090;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          direction: rtl;
        }

        @media (max-width: 480px) {
          .dim-backdrop {
            padding: 10px;
            align-items: flex-start;
            padding-top: 24px;
          }
        }

        /* ── Modal ── */
        .dim-modal {
          position: relative;
          width: 100%;
          max-width: 580px;
          background-color: var(--bg-card);
          border-radius: 20px;
          border: 1px solid var(--border-color);
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
          overflow: hidden;
          font-family: 'Cairo', sans-serif;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 480px) {
          .dim-modal {
            border-radius: 16px;
            max-height: 88vh;
          }
        }

        .dim-close {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background-color: var(--bg-input);
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
        }

        .dim-close:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .dim-body {
          padding: 1.75rem 1.5rem 1.5rem;
          overflow-y: auto;
          flex: 1;
        }

        @media (max-width: 380px) {
          .dim-body {
            padding: 1.5rem 1.1rem 1.25rem;
          }
        }

        /* ── Header ── */
        .dim-header {
          text-align: center;
          margin-bottom: 1.25rem;
        }

        .dim-header__icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: ${FUND_THEME.gradient};
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          margin: 0 auto 12px;
          box-shadow: 0 8px 24px ${FUND_THEME.shadow};
        }

        @media (max-width: 380px) {
          .dim-header__icon {
            width: 52px;
            height: 52px;
          }
          .dim-header__icon svg {
            width: 20px;
            height: 20px;
          }
        }

        .dim-header__title {
          color: var(--text-secondary);
          font-size: clamp(1.05rem, 3.5vw, 1.15rem);
          font-weight: 900;
          margin: 0 0 6px;
        }

        .dim-header__subtitle {
          color: var(--text-muted);
          font-size: clamp(0.75rem, 2.6vw, 0.8rem);
          margin: 0;
          line-height: 1.6;
        }

        /* ── Field ── */
        .dim-field {
          margin-bottom: 14px;
        }

        .dim-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 6px;
          flex-wrap: wrap;
        }

        .dim-label__hint {
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.72rem;
        }

        .dim-label__required {
          color: var(--error);
          font-weight: 900;
        }

        .dim-input,
        .dim-textarea {
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-input);
          color: var(--text-primary);
          font-family: 'Cairo', sans-serif;
          font-size: 0.85rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .dim-input:focus,
        .dim-textarea:focus {
          border-color: ${FUND_THEME.accent};
          box-shadow: 0 0 0 3px ${FUND_THEME.accent}15;
        }

        .dim-input--ltr {
          text-align: right;
          direction: ltr;
        }

        .dim-textarea {
          resize: none;
          line-height: 1.55;
        }

        .dim-charcount {
          text-align: left;
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-top: 4px;
          opacity: 0.7;
          font-family: system-ui, sans-serif;
        }

        /* ── Contact cards grid ── */
        .dim-contact-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }

        @media (max-width: 480px) {
          .dim-contact-grid {
            grid-template-columns: 1fr;
            gap: 6px;
          }
        }

        .dim-contact-card {
          position: relative;
          padding: 12px 10px;
          border-radius: 12px;
          border: 1.5px solid var(--border-color);
          background-color: var(--bg-input);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          text-align: center;
          min-width: 0;
        }

        .dim-contact-card:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .dim-contact-card__icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dim-contact-card__label {
          font-family: 'Cairo', sans-serif;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-secondary);
          line-height: 1.3;
        }

        .dim-contact-card.is-active .dim-contact-card__label {
          color: var(--text-primary);
        }

        .dim-contact-card__check {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          border: 2px solid var(--bg-card);
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        /* ── Contact hint ── */
        .dim-contact-hint {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          margin-top: 8px;
          padding: 8px 10px;
          border-radius: 9px;
          background-color: var(--notice-info-bg);
          border: 1px solid var(--notice-info-border);
          color: var(--notice-info-text);
          font-size: 0.72rem;
          line-height: 1.55;
        }

        .dim-contact-hint svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* ── Alt contact link ── */
        .dim-alt-contact {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
          padding: 7px 10px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 600;
          flex-wrap: wrap;
        }

        .dim-alt-contact--wa {
          background-color: rgba(37,211,102,0.08);
          border: 1px solid rgba(37,211,102,0.2);
          color: #25D366;
        }

        .dim-alt-contact--email {
          background-color: rgba(23,162,184,0.08);
          border: 1px solid rgba(23,162,184,0.2);
          color: ${FUND_THEME.accent};
        }

        .dim-alt-contact__link {
          color: inherit;
          font-weight: 800;
          text-decoration: underline;
          direction: ltr;
          word-break: break-all;
        }

        /* ── Platform hint ── */
        .dim-platform-hint {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          padding: 8px 10px;
          border-radius: 9px;
          background-color: var(--notice-warning-bg);
          border: 1px solid var(--notice-warning-border);
          color: var(--notice-warning-text);
          font-size: 0.72rem;
          line-height: 1.55;
          margin-bottom: 14px;
        }

        .dim-platform-hint svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* ── Submit button ── */
        .dim-submit {
          width: 100%;
          padding: 13px 20px;
          border-radius: 12px;
          border: none;
          background: ${FUND_THEME.gradient};
          color: #FFFFFF;
          font-family: 'Cairo', sans-serif;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 6px 18px ${FUND_THEME.shadow};
          transition: all 0.2s ease;
        }

        .dim-submit:disabled {
          background: var(--btn-disabled-bg);
          color: var(--btn-disabled-text);
          box-shadow: none;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .dim-spinner {
          width: 13px;
          height: 13px;
        }

        /* ── Duplicate view ── */
        .dim-duplicate {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-align: center;
          padding-top: 0.5rem;
        }

        .dim-duplicate__icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FFC107, #F5A623);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          margin: 0 auto;
          box-shadow: 0 8px 24px rgba(255,193,7,0.4);
        }

        .dim-duplicate__title {
          color: var(--text-secondary);
          font-size: clamp(1rem, 3.4vw, 1.15rem);
          font-weight: 900;
          margin: 0;
        }

        .dim-duplicate__text {
          color: var(--text-muted);
          font-size: clamp(0.78rem, 2.7vw, 0.85rem);
          margin: 0;
          line-height: 1.7;
          max-width: 420px;
          margin-inline: auto;
        }

        .dim-duplicate__info {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          background-color: rgba(23,162,184,0.08);
          border: 1px solid rgba(23,162,184,0.22);
          text-align: right;
        }

        .dim-duplicate__info-icon {
          flex-shrink: 0;
          margin-top: 3px;
          color: ${FUND_THEME.accent};
        }

        .dim-duplicate__info-text {
          color: var(--text-secondary);
          font-size: 0.78rem;
          line-height: 1.7;
        }

        .dim-duplicate__info-text strong {
          font-weight: 800;
        }

        .dim-duplicate__divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0.25rem 0;
        }

        .dim-duplicate__divider::before,
        .dim-duplicate__divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background-color: var(--border-color);
        }

        .dim-duplicate__divider span {
          color: var(--text-muted);
          font-size: 0.72rem;
          font-weight: 700;
          opacity: 0.75;
        }

        .dim-duplicate__contacts {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .dim-contact-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border-radius: 10px;
          text-decoration: none;
          font-family: 'Cairo', sans-serif;
          font-size: 0.8rem;
          font-weight: 800;
          transition: all 0.2s ease;
        }

        .dim-contact-chip--wa {
          background-color: rgba(37,211,102,0.12);
          color: #25D366;
          border: 1px solid rgba(37,211,102,0.25);
        }

        .dim-contact-chip--wa:hover {
          background-color: rgba(37,211,102,0.2);
          transform: translateY(-1px);
        }

        .dim-contact-chip--email {
          background-color: rgba(23,162,184,0.12);
          color: ${FUND_THEME.accent};
          border: 1px solid rgba(23,162,184,0.28);
        }

        .dim-contact-chip--email:hover {
          background-color: rgba(23,162,184,0.2);
          transform: translateY(-1px);
        }

        .dim-btn-close {
          padding: 11px 16px;
          border-radius: 11px;
          border: 1.5px solid var(--border-color);
          background-color: var(--bg-card);
          color: var(--text-secondary);
          font-family: 'Cairo', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 0.5rem;
        }

        @media (prefers-reduced-motion: reduce) {
          .dim-contact-card,
          .dim-submit,
          .dim-contact-chip {
            transition: none !important;
          }
        }
      `}</style>
    </AnimatePresence>
  );
};

export default DonationInquiryModal;
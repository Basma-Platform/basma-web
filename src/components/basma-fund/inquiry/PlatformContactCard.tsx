import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaExternalLinkAlt,
  FaCopy,
  FaCheck,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import type { PlatformContactInfo } from '../../../types';
import {
  buildWhatsAppLink,
  buildMailtoLink,
} from '../../../utils/donationHelpers';

interface PlatformContactCardProps {
  contact: PlatformContactInfo;
  whatsappPrefill?: string;
}

interface ContactItem {
  key: 'whatsapp' | 'email' | 'phone';
  icon: typeof FaWhatsapp;
  label: string;
  value: string;
  color: string;
  href: string;
}

const PlatformContactCard = ({
  contact,
  whatsappPrefill,
}: PlatformContactCardProps) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const items: ContactItem[] = [
    contact.whatsapp
      ? {
          key: 'whatsapp',
          icon: FaWhatsapp,
          label: 'واتساب',
          value: contact.whatsapp,
          color: '#25D366',
          href: buildWhatsAppLink(contact.whatsapp, whatsappPrefill),
        }
      : null,
    contact.email
      ? {
          key: 'email',
          icon: FaEnvelope,
          label: 'بريد إلكتروني',
          value: contact.email,
          color: '#17A2B8',
          href: buildMailtoLink(
            contact.email,
            'استفسار تبرع - صندوق بصمة'
          ),
        }
      : null,
    contact.phone
      ? {
          key: 'phone',
          icon: FaPhone,
          label: 'هاتف',
          value: contact.phone,
          color: '#E87A20',
          href: `tel:${contact.phone.replace(/[^\d+]/g, '')}`,
        }
      : null,
  ].filter(Boolean) as ContactItem[];

  const handleCopy = async (item: ContactItem) => {
    try {
      await navigator.clipboard.writeText(item.value);
      setCopiedKey(item.key);
      toast.success(`تم نسخ ${item.label}`);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      toast.error('تعذّر النسخ — انسخ يدوياً');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '18px',
        padding: '1.25rem 1.35rem',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      <h4
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
          fontWeight: 800,
          margin: '0 0 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <FaWhatsapp size={14} color="#25D366" />
        تواصل مع المنصة
      </h4>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isCopied = copiedKey === item.key;

          return (
            <div
              key={item.key}
              style={{
                display: 'flex',
                alignItems: 'stretch',
                gap: '6px',
              }}
            >
              {/* Main link row */}
              <a
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  item.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '11px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  minWidth: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = item.color;
                  e.currentTarget.style.backgroundColor = `${item.color}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-input)';
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: `${item.color}18`,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={14} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      marginBottom: '2px',
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      direction: 'ltr',
                      textAlign: 'right',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.value}
                  </div>
                </div>

                <FaExternalLinkAlt
                  size={10}
                  style={{ color: 'var(--text-muted)', opacity: 0.5 }}
                />
              </a>

              {/* ✅ Copy button */}
              <button
                type="button"
                onClick={() => handleCopy(item)}
                aria-label={`نسخ ${item.label}`}
                title={`نسخ ${item.label}`}
                style={{
                  width: '42px',
                  flexShrink: 0,
                  borderRadius: '11px',
                  border: `1px solid ${
                    isCopied ? 'rgba(40,167,69,0.5)' : 'var(--border-color)'
                  }`,
                  backgroundColor: isCopied
                    ? 'rgba(40,167,69,0.1)'
                    : 'var(--bg-input)',
                  color: isCopied ? '#28A745' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (isCopied) return;
                  e.currentTarget.style.borderColor = item.color;
                  e.currentTarget.style.color = item.color;
                  e.currentTarget.style.backgroundColor = `${item.color}10`;
                }}
                onMouseLeave={(e) => {
                  if (isCopied) return;
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-input)';
                }}
              >
                {isCopied ? <FaCheck size={12} /> : <FaCopy size={12} />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Working hours */}
      {contact.working_hours && (
        <div
          style={{
            marginTop: '12px',
            padding: '10px 12px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255,193,7,0.08)',
            border: '1px solid rgba(255,193,7,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-secondary)',
            fontSize: '0.76rem',
            fontWeight: 600,
          }}
        >
          <FaClock size={11} color="#FFC107" />
          <span>{contact.working_hours}</span>
        </div>
      )}
    </motion.div>
  );
};

export default PlatformContactCard;
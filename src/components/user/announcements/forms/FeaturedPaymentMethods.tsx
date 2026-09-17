import { motion } from 'framer-motion';
import {
  FaUniversity,
  FaMobileAlt,
  FaWallet,
  FaCopy,
  FaCheck,
  FaInfoCircle,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { useState } from 'react';
import { toast } from 'react-toastify';
import type { PlatformPaymentMethod } from '../../../../types';

interface FeaturedPaymentMethodsProps {
  methods: PlatformPaymentMethod[];
  selectedMethod: string;
  onSelect: (method: 'palpay' | 'jawwal_pay' | 'bop') => void;
  disabled?: boolean;
}

// ============================================
// Payment Method Icon Map
// ============================================
const METHOD_ICONS: Record<string, IconType> = {
  palpay: FaWallet,
  jawwal_pay: FaMobileAlt,
  bop: FaUniversity,
};

const METHOD_COLORS: Record<string, { accent: string; gradient: string }> = {
  palpay: {
    accent: '#E87A20',
    gradient: 'linear-gradient(135deg, #E87A20, #F5A623)',
  },
  jawwal_pay: {
    accent: '#28A745',
    gradient: 'linear-gradient(135deg, #28A745, #4FCB6E)',
  },
  bop: {
    accent: '#17A2B8',
    gradient: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
  },
};

const FeaturedPaymentMethods = ({
  methods,
  selectedMethod,
  onSelect,
  disabled = false,
}: FeaturedPaymentMethodsProps) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // ============================================
  // Copy Account Number
  // ============================================
  const handleCopy = async (id: number, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      toast.success('تم نسخ رقم الحساب بنجاح');
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      toast.error('فشل نسخ رقم الحساب');
    }
  };

  // ============================================
  // Empty State
  // ============================================
  if (methods.length === 0) {
    return (
      <div
        style={{
          padding: '1.25rem 0.85rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-card)',
          border: '1px dashed var(--border-color)',
          borderRadius: '12px',
          fontFamily: 'Cairo, sans-serif',
          boxSizing: 'border-box',
          width: '100%',
        }}
        dir="rtl"
      >
        <FaInfoCircle size={24} color="var(--text-muted)" opacity={0.4} />
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.78rem',
            marginTop: '6px',
            marginBottom: 0,
          }}
        >
          لا توجد طرق دفع متاحة حالياً. يرجى التواصل مع الدعم الفني.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: 'Cairo, sans-serif',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
      dir="rtl"
    >
      {/* Info Note */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '6px',
          padding: '8px 10px',
          marginBottom: '10px',
          backgroundColor: 'rgba(17,162,184,0.06)',
          border: '1px solid rgba(17,162,184,0.2)',
          borderRadius: '10px',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        <FaInfoCircle
          size={12}
          color="#17A2B8"
          style={{ flexShrink: 0, marginTop: '2px' }}
        />
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
          }}
        >
          اختر الطريقة المفضلة، قم بتحويل المبلغ، ثم ارفع صورة الإشعار بالأسفل.
        </div>
      </div>

      {/* Methods List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        {methods.map((method, index) => {
          let displayLabel = method.method_label;
          if (method.method_type === 'jawwal_pay') {
            displayLabel = 'جوال باي';
          } else if (method.method_type === 'palpay') {
            displayLabel = 'بال باي';
          } else if (method.method_type === 'bop') {
            displayLabel = 'بنك فلسطين';
          }

          const Icon = METHOD_ICONS[method.method_type] || FaWallet;
          const colors =
            METHOD_COLORS[method.method_type] || METHOD_COLORS.palpay;
          const isSelected = selectedMethod === method.method_type;
          const isCopied = copiedId === method.id;

          return (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.04 }}
              style={{
                position: 'relative',
                padding: '0.85rem',
                borderRadius: '12px',
                border: `2px solid ${
                  isSelected ? colors.accent : 'var(--border-color)'
                }`,
                backgroundColor: isSelected
                  ? `${colors.accent}08`
                  : 'var(--bg-card)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected
                  ? `0 4px 16px ${colors.accent}15`
                  : '0 2px 4px var(--shadow-sm)',
                opacity: disabled ? 0.6 : 1,
                boxSizing: 'border-box',
                width: '100%',
                maxWidth: '100%',
                overflow: 'visible', // Changed to visible so badge is never clipped
              }}
              onClick={() => !disabled && onSelect(method.method_type)}
            >
              {/* Header Row: Icon + Name + Radio */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  width: '100%',
                  minWidth: 0,
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: isSelected
                      ? colors.gradient
                      : `${colors.accent}15`,
                    color: isSelected ? '#FFFFFF' : colors.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} />
                </div>

                {/* Name */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      color: isSelected
                        ? colors.accent
                        : 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      marginBottom: '1px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {displayLabel}
                  </div>
                  <div
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.68rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {method.account_name}
                  </div>
                </div>

                {/* Radio Button */}
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: `2px solid ${
                      isSelected ? colors.accent : 'var(--border-color)'
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: colors.gradient,
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Account Number Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  marginBottom: method.instructions ? '6px' : 0,
                  boxSizing: 'border-box',
                  width: '100%',
                }}
              >
                <span
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  الحساب:
                </span>
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    color: 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    fontFamily:
                      "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                    direction: 'ltr',
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {method.account_number}
                </span>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(method.id, method.account_number);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: isCopied
                      ? 'rgba(40,167,69,0.15)'
                      : `${colors.accent}12`,
                    color: isCopied ? '#28A745' : colors.accent,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                  aria-label="نسخ رقم الحساب"
                >
                  {isCopied ? <FaCheck size={11} /> : <FaCopy size={11} />}
                </button>
              </div>

              {/* Instructions */}
              {method.instructions && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '5px',
                    padding: '5px 8px',
                    borderRadius: '6px',
                    backgroundColor: `${colors.accent}08`,
                    border: `1px dashed ${colors.accent}30`,
                  }}
                >
                  <FaInfoCircle
                    size={10}
                    color={colors.accent}
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  />
                  <span
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.68rem',
                      lineHeight: 1.45,
                    }}
                  >
                    {method.instructions}
                  </span>
                </div>
              )}

              {/* Selected Indicator Badge (Updated position & text) */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '14px',
                    padding: '3px 9px',
                    borderRadius: '6px',
                    background: colors.gradient,
                    color: '#FFFFFF',
                    fontSize: '0.65rem',
                    fontWeight: 900,
                    boxShadow: `0 3px 10px ${colors.accent}40`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    zIndex: 2,
                  }}
                >
                  <FaCheck size={7} />
                  تم التحديد
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedPaymentMethods;
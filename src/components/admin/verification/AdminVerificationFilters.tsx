import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaSearch,
  FaTimes,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaLayerGroup,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

export type AdminVerificationFilter =
  | 'all'
  | 'pending'
  | 'approved'
  | 'rejected';

interface AdminVerificationFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: AdminVerificationFilter;
  onStatusChange: (status: AdminVerificationFilter) => void;
  counts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  isSearching?: boolean;
}

const AdminVerificationFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  counts,
  isSearching = false,
}: AdminVerificationFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChange(localSearch);
    }, 450);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localSearch, onSearchChange]);

  // Sync external
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const tabs: {
    key: AdminVerificationFilter;
    label: string;
    Icon: IconType;
    color: string;
  }[] = [
    { key: 'all', label: 'الكل', Icon: FaLayerGroup, color: '#8B5A2B' },
    {
      key: 'pending',
      label: 'قيد المراجعة',
      Icon: FaHourglassHalf,
      color: '#FFC107',
    },
    {
      key: 'approved',
      label: 'تمت الموافقة',
      Icon: FaCheckCircle,
      color: '#28A745',
    },
    {
      key: 'rejected',
      label: 'مرفوضة',
      Icon: FaTimesCircle,
      color: '#DC3545',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1rem 1.1rem',
        marginBottom: '1.25rem',
        boxShadow: '0 2px 12px var(--shadow-sm)',
        fontFamily: 'Cairo, sans-serif',
      }}
      dir="rtl"
    >
      {/* Search Row */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <FaSearch
          size={13}
          style={{
            position: 'absolute',
            right: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            opacity: 0.6,
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          placeholder="ابحث بالاسم، البريد الإلكتروني، أو رقم واتساب..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 40px 12px 40px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-primary)',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.85rem',
            outline: 'none',
            transition: 'all 0.25s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary-orange)';
            e.currentTarget.style.boxShadow =
              '0 0 0 3px rgba(232,122,32,0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />

        {localSearch && (
          <button
            type="button"
            onClick={() => setLocalSearch('')}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="مسح"
          >
            <FaTimes size={11} />
          </button>
        )}

        {isSearching && localSearch && (
          <span
            className="spinner-border spinner-border-sm"
            style={{
              position: 'absolute',
              left: '36px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--primary-orange)',
              width: '13px',
              height: '13px',
              borderWidth: '1.5px',
            }}
          />
        )}
      </div>

      {/* Tabs Row */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          backgroundColor: 'var(--bg-input)',
          padding: '4px',
          borderRadius: '11px',
          border: '1px solid var(--border-color)',
          flexWrap: 'wrap',
        }}
      >
        {tabs.map((tab) => {
          const active = status === tab.key;
          const Icon = tab.Icon;
          const count = counts?.[tab.key] ?? 0;

          return (
            <motion.button
              key={tab.key}
              type="button"
              onClick={() => onStatusChange(tab.key)}
              whileTap={{ scale: 0.96 }}
              style={{
                position: 'relative',
                flex: '1 1 auto',
                minWidth: 'fit-content',
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: active ? 'var(--bg-card)' : 'transparent',
                color: active ? tab.color : 'var(--text-muted)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.78rem',
                fontWeight: active ? 700 : 600,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: active ? '0 2px 8px var(--shadow-sm)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={11} />
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  style={{
                    padding: '1px 7px',
                    borderRadius: '6px',
                    backgroundColor: active
                      ? `${tab.color}20`
                      : 'rgba(0,0,0,0.05)',
                    color: active ? tab.color : 'var(--text-muted)',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    fontFamily: 'system-ui, sans-serif',
                    minWidth: '20px',
                    textAlign: 'center',
                  }}
                >
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AdminVerificationFilters;
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaLock,
  FaGlobe,
} from 'react-icons/fa';
import type {
  ActivityEventCategory,
  ActivityActorRole,
} from '../../../../types';

export interface ActivityFilterState {
  category: ActivityEventCategory | null;
  actor_role: ActivityActorRole | null;
  sensitive: boolean;
}

interface ActivityFiltersProps {
  filters: ActivityFilterState;
  onChange: (filters: ActivityFilterState) => void;
  onClear: () => void;
}

const CATEGORY_OPTIONS: {
  value: ActivityEventCategory;
  label: string;
}[] = [
  { value: 'user', label: 'المستخدمون' },
  { value: 'announcement', label: 'الإعلانات' },
  { value: 'interaction', label: 'التفاعلات' },
  { value: 'report', label: 'البلاغات' },
  { value: 'moderation', label: 'الإشراف' },
  { value: 'verification', label: 'التوثيق' },
  { value: 'featured', label: 'التمييز' },
  { value: 'system', label: 'النظام' },
];

const ROLE_OPTIONS: { value: ActivityActorRole; label: string }[] = [
  { value: 'user', label: 'مستخدمون' },
  { value: 'admin', label: 'أدمن' },
  { value: 'system', label: 'نظام' },
];

/**
 * Filters for Activity Feed
 * - Category dropdown
 * - Actor role dropdown
 * - Sensitive toggle
 */
const ActivityFilters = ({
  filters,
  onChange,
  onClear,
}: ActivityFiltersProps) => {
  const [openDropdown, setOpenDropdown] = useState<
    'category' | 'role' | null
  >(null);

  const categoryRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (categoryRef.current && !categoryRef.current.contains(target)) {
        if (openDropdown === 'category') setOpenDropdown(null);
      }
      if (roleRef.current && !roleRef.current.contains(target)) {
        if (openDropdown === 'role') setOpenDropdown(null);
      }
    };
    if (openDropdown) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openDropdown]);

  const hasActiveFilters =
    filters.category !== null ||
    filters.actor_role !== null ||
    filters.sensitive;

  const activeCount =
    (filters.category ? 1 : 0) +
    (filters.actor_role ? 1 : 0) +
    (filters.sensitive ? 1 : 0);

  return (
    <div
      dir="rtl"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexWrap: 'wrap',
        marginBottom: '1rem',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      {/* Filter Icon */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 10px',
          borderRadius: '10px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
        }}
      >
        <FaFilter size={11} />
        فلترة
        {activeCount > 0 && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '16px',
              height: '16px',
              padding: '0 5px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-orange)',
              color: '#FFFFFF',
              fontSize: '0.6rem',
              fontWeight: 800,
              fontFamily: 'system-ui, sans-serif',
              direction: 'ltr',
            }}
          >
            {activeCount}
          </span>
        )}
      </div>

      {/* Category Dropdown */}
      <DropdownButton
        ref={categoryRef}
        label={
          filters.category
            ? CATEGORY_OPTIONS.find((c) => c.value === filters.category)?.label ||
              'الفئة'
            : 'الفئة'
        }
        active={!!filters.category}
        isOpen={openDropdown === 'category'}
        onToggle={() =>
          setOpenDropdown(openDropdown === 'category' ? null : 'category')
        }
      >
        <DropdownItem
          label="الكل"
          active={filters.category === null}
          onClick={() => {
            onChange({ ...filters, category: null });
            setOpenDropdown(null);
          }}
        />
        {CATEGORY_OPTIONS.map((opt) => (
          <DropdownItem
            key={opt.value}
            label={opt.label}
            active={filters.category === opt.value}
            onClick={() => {
              onChange({ ...filters, category: opt.value });
              setOpenDropdown(null);
            }}
          />
        ))}
      </DropdownButton>

      {/* Role Dropdown */}
      <DropdownButton
        ref={roleRef}
        label={
          filters.actor_role
            ? ROLE_OPTIONS.find((r) => r.value === filters.actor_role)?.label ||
              'الدور'
            : 'الدور'
        }
        active={!!filters.actor_role}
        isOpen={openDropdown === 'role'}
        onToggle={() =>
          setOpenDropdown(openDropdown === 'role' ? null : 'role')
        }
      >
        <DropdownItem
          label="الكل"
          active={filters.actor_role === null}
          onClick={() => {
            onChange({ ...filters, actor_role: null });
            setOpenDropdown(null);
          }}
        />
        {ROLE_OPTIONS.map((opt) => (
          <DropdownItem
            key={opt.value}
            label={opt.label}
            active={filters.actor_role === opt.value}
            onClick={() => {
              onChange({ ...filters, actor_role: opt.value });
              setOpenDropdown(null);
            }}
          />
        ))}
      </DropdownButton>

      {/* Sensitive Toggle */}
      <button
        onClick={() =>
          onChange({ ...filters, sensitive: !filters.sensitive })
        }
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '10px',
          border: `1px solid ${
            filters.sensitive
              ? 'rgba(220,53,69,0.4)'
              : 'var(--border-color)'
          }`,
          backgroundColor: filters.sensitive
            ? 'rgba(220,53,69,0.08)'
            : 'var(--bg-input)',
          color: filters.sensitive ? '#DC3545' : 'var(--text-muted)',
          fontSize: '0.72rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        {filters.sensitive ? <FaLock size={10} /> : <FaGlobe size={10} />}
        {filters.sensitive ? 'الأحداث الحساسة' : 'الأحداث العامة'}
      </button>

      {/* Clear All */}
      {hasActiveFilters && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClear}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(220,53,69,0.3)',
            backgroundColor: 'rgba(220,53,69,0.06)',
            color: '#DC3545',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          <FaTimes size={10} />
          مسح
        </motion.button>
      )}
    </div>
  );
};

// ============================================
// Sub-components
// ============================================

import { forwardRef } from 'react';

const DropdownButton = forwardRef<
  HTMLDivElement,
  {
    label: string;
    active: boolean;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }
>(({ label, active, isOpen, onToggle, children }, ref) => (
  <div ref={ref} style={{ position: 'relative' }}>
    <button
      onClick={onToggle}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '10px',
        border: `1px solid ${
          active ? 'var(--primary-orange)' : 'var(--border-color)'
        }`,
        backgroundColor: active
          ? 'rgba(232,122,32,0.08)'
          : 'var(--bg-input)',
        color: active ? 'var(--primary-orange)' : 'var(--text-muted)',
        fontSize: '0.72rem',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'Cairo, sans-serif',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ display: 'inline-flex' }}
      >
        <FaChevronDown size={9} />
      </motion.span>
    </button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: '150px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            boxShadow: '0 12px 32px var(--shadow-md)',
            padding: '6px',
            zIndex: 50,
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
));
DropdownButton.displayName = 'DropdownButton';

const DropdownItem = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      padding: '8px 12px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: active ? 'rgba(232,122,32,0.08)' : 'transparent',
      color: active ? 'var(--primary-orange)' : 'var(--text-secondary)',
      fontFamily: 'Cairo, sans-serif',
      fontSize: '0.75rem',
      fontWeight: active ? 700 : 500,
      cursor: 'pointer',
      textAlign: 'right',
      transition: 'all 0.15s ease',
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.05)';
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.backgroundColor = 'transparent';
      }
    }}
  >
    {label}
  </button>
);

export default ActivityFilters;
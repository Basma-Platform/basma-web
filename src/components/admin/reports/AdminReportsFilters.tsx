import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaSearch,
  FaTimes,
  FaSortAmountDown,
  FaHourglassHalf,
  FaCheckCircle,
  FaFlag,
  FaLayerGroup,
  FaUser,
  FaBullhorn,
  FaExclamationTriangle,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import {
  REPORT_SORT_OPTIONS,
  REPORT_PRIORITY_OPTIONS,
  REPORT_TARGET_TYPE_OPTIONS,
} from '../../../utils/reportHelpers';

export type AdminReportsStatusFilter =
  | 'all'
  | 'pending'
  | 'reviewed'
  | 'rejected';

export type AdminReportsTargetFilter =
  | 'all'
  | 'user'
  | 'announcement';

export type AdminReportsPriorityFilter =
  | 'all'
  | 'low'
  | 'medium'
  | 'high';

export type AdminReportsSort = 'newest' | 'oldest' | 'priority';

interface AdminReportsFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;

  status: AdminReportsStatusFilter;
  onStatusChange: (v: AdminReportsStatusFilter) => void;

  targetType: AdminReportsTargetFilter;
  onTargetTypeChange: (v: AdminReportsTargetFilter) => void;

  priority: AdminReportsPriorityFilter;
  onPriorityChange: (v: AdminReportsPriorityFilter) => void;

  sort: AdminReportsSort;
  onSortChange: (v: AdminReportsSort) => void;

  onClear: () => void;
  isSearching?: boolean;
  resultsCount?: number;
}

const AdminReportsFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  targetType,
  onTargetTypeChange,
  priority,
  onPriorityChange,
  sort,
  onSortChange,
  onClear,
  isSearching = false,
  resultsCount,
}: AdminReportsFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [showSort, setShowSort] = useState(false);
  const [showTarget, setShowTarget] = useState(false);
  const [showPriority, setShowPriority] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const priorityRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearchChange(localSearch), 450);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localSearch, onSearchChange]);

  useEffect(() => setLocalSearch(search), [search]);

  // Close dropdowns on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSort(false);
      }
      if (
        targetRef.current &&
        !targetRef.current.contains(e.target as Node)
      ) {
        setShowTarget(false);
      }
      if (
        priorityRef.current &&
        !priorityRef.current.contains(e.target as Node)
      ) {
        setShowPriority(false);
      }
    };
    if (showSort || showTarget || showPriority) {
      document.addEventListener('mousedown', onClick);
    }
    return () => document.removeEventListener('mousedown', onClick);
  }, [showSort, showTarget, showPriority]);

  const statusTabs: {
    key: AdminReportsStatusFilter;
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
      key: 'reviewed',
      label: 'تمت المعالجة',
      Icon: FaCheckCircle,
      color: '#28A745',
    },
    {
      key: 'rejected',
      label: 'مرفوضة',
      Icon: FaTimes,
      color: '#6C757D',
    },
  ];

  const currentSortLabel =
    REPORT_SORT_OPTIONS.find((o) => o.value === sort)?.label ||
    'الأحدث أولاً';

  const currentTargetLabel =
    REPORT_TARGET_TYPE_OPTIONS.find((o) => o.value === targetType)?.label ||
    'الكل';

  const currentPriorityLabel =
    REPORT_PRIORITY_OPTIONS.find((o) => o.value === priority)?.label ||
    'الكل';

  const hasFilters =
    status !== 'all' ||
    targetType !== 'all' ||
    priority !== 'all' ||
    sort !== 'newest' ||
    search.trim() !== '';

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
      {/* ============================================
          Row 1: Search + Target + Priority + Sort
          ============================================ */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div
          style={{ position: 'relative', flex: '1 1 240px', minWidth: 0 }}
        >
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
            placeholder="ابحث بالاسم أو البريد الإلكتروني..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 40px 10px 40px',
              borderRadius: '11px',
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

        {/* Target type dropdown */}
        <div
          ref={targetRef}
          style={{
            position: 'relative',
            flex: '0 0 auto',
            minWidth: '140px',
          }}
        >
          <button
            type="button"
            onClick={() => setShowTarget((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '11px',
              border: `1px solid ${
                targetType !== 'all'
                  ? 'var(--primary-orange)'
                  : 'var(--border-color)'
              }`,
              backgroundColor:
                targetType !== 'all'
                  ? 'rgba(232,122,32,0.06)'
                  : 'var(--bg-input)',
              color:
                targetType !== 'all'
                  ? 'var(--primary-orange)'
                  : 'var(--text-secondary)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                minWidth: 0,
              }}
            >
              <FaFlag size={11} />
              <span
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {currentTargetLabel}
              </span>
            </span>
          </button>

          {showTarget && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                left: 0,
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                boxShadow: '0 12px 32px var(--shadow-md)',
                padding: '6px',
                zIndex: 100,
                minWidth: '180px',
              }}
            >
              {REPORT_TARGET_TYPE_OPTIONS.map((opt) => {
                const active = opt.value === targetType;
                const Icon =
                  opt.value === 'user'
                    ? FaUser
                    : opt.value === 'announcement'
                      ? FaBullhorn
                      : FaLayerGroup;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onTargetTypeChange(
                        opt.value as AdminReportsTargetFilter
                      );
                      setShowTarget(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'right',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: active
                        ? 'rgba(232,122,32,0.08)'
                        : 'transparent',
                      color: active
                        ? 'var(--primary-orange)'
                        : 'var(--text-secondary)',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Icon size={11} />
                    {opt.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Priority dropdown */}
        <div
          ref={priorityRef}
          style={{
            position: 'relative',
            flex: '0 0 auto',
            minWidth: '140px',
          }}
        >
          <button
            type="button"
            onClick={() => setShowPriority((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '11px',
              border: `1px solid ${
                priority !== 'all'
                  ? 'var(--primary-orange)'
                  : 'var(--border-color)'
              }`,
              backgroundColor:
                priority !== 'all'
                  ? 'rgba(232,122,32,0.06)'
                  : 'var(--bg-input)',
              color:
                priority !== 'all'
                  ? 'var(--primary-orange)'
                  : 'var(--text-secondary)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                minWidth: 0,
              }}
            >
              <FaExclamationTriangle size={11} />
              <span
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {currentPriorityLabel}
              </span>
            </span>
          </button>

          {showPriority && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                left: 0,
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                boxShadow: '0 12px 32px var(--shadow-md)',
                padding: '6px',
                zIndex: 100,
              }}
            >
              {REPORT_PRIORITY_OPTIONS.map((opt) => {
                const active = opt.value === priority;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onPriorityChange(
                        opt.value as AdminReportsPriorityFilter
                      );
                      setShowPriority(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'right',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: active
                        ? 'rgba(232,122,32,0.08)'
                        : 'transparent',
                      color: active
                        ? 'var(--primary-orange)'
                        : 'var(--text-secondary)',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Sort dropdown */}
        <div
          ref={sortRef}
          style={{
            position: 'relative',
            flex: '0 0 auto',
            minWidth: '150px',
          }}
        >
          <button
            type="button"
            onClick={() => setShowSort((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '11px',
              border: `1px solid ${
                showSort ? 'var(--primary-orange)' : 'var(--border-color)'
              }`,
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-secondary)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                minWidth: 0,
              }}
            >
              <FaSortAmountDown size={11} color="var(--primary-orange)" />
              <span
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {currentSortLabel}
              </span>
            </span>
          </button>

          {showSort && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                left: 0,
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                boxShadow: '0 12px 32px var(--shadow-md)',
                padding: '6px',
                zIndex: 100,
              }}
            >
              {REPORT_SORT_OPTIONS.map((opt) => {
                const active = opt.value === sort;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSortChange(opt.value as AdminReportsSort);
                      setShowSort(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'right',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: active
                        ? 'rgba(232,122,32,0.08)'
                        : 'transparent',
                      color: active
                        ? 'var(--primary-orange)'
                        : 'var(--text-secondary)',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      {/* ============================================
          Row 2: Status tabs + results + clear
          ============================================ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '6px',
            backgroundColor: 'var(--bg-input)',
            padding: '4px',
            borderRadius: '11px',
            border: '1px solid var(--border-color)',
            flexWrap: 'wrap',
            flex: '1 1 auto',
          }}
        >
          {statusTabs.map((tab) => {
            const active = status === tab.key;
            const Icon = tab.Icon;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onStatusChange(tab.key)}
                style={{
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
                  boxShadow: active ? '0 2px 8px var(--shadow-sm)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={11} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flex: '0 1 auto',
          }}
        >
          {typeof resultsCount === 'number' && (
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
              }}
            >
              {resultsCount} نتيجة
            </span>
          )}

          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                onClear();
                setLocalSearch('');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(220,53,69,0.3)',
                backgroundColor: 'rgba(220,53,69,0.06)',
                color: '#DC3545',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <FaTimes size={10} />
              مسح الفلاتر
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminReportsFilters;
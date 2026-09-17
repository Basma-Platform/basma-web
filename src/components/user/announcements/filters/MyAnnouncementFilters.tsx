import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaSortAmountDown,
} from 'react-icons/fa';

export type AnnouncementStatusFilter = 'all' | 'active' | 'disabled' | 'featured';
export type AnnouncementSortOption = 'newest' | 'oldest' | 'most_viewed';

interface MyAnnouncementFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: AnnouncementStatusFilter;
  onStatusChange: (status: AnnouncementStatusFilter) => void;
  sort: AnnouncementSortOption;
  onSortChange: (sort: AnnouncementSortOption) => void;
  onClear: () => void;
  isSearching?: boolean;
  resultsCount?: number;
}

const MyAnnouncementFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  onClear,
  isSearching = false,
  resultsCount,
}: MyAnnouncementFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ✅ Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChange(localSearch);
    }, 450);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localSearch, onSearchChange]);

  // Sync external search changes
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target as Node)
      ) {
        setShowSortDropdown(false);
      }
    };
    if (showSortDropdown) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSortDropdown]);

  const statusTabs: { value: AnnouncementStatusFilter; label: string }[] = [
    { value: 'all', label: 'الكل' },
    { value: 'active', label: 'نشط' },
    { value: 'disabled', label: 'معطل' },
    { value: 'featured', label: 'مميز' },
  ];

  const sortOptions: { value: AnnouncementSortOption; label: string }[] = [
    { value: 'newest', label: 'الأحدث أولاً' },
    { value: 'oldest', label: 'الأقدم أولاً' },
    { value: 'most_viewed', label: 'الأكثر مشاهدة' },
  ];

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === sort)?.label || 'الأحدث أولاً';

  const hasActiveFilters = status !== 'all' || sort !== 'newest' || search;

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
      {/* Row 1: Search + Sort */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 0 }}>
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
            placeholder="ابحث في إعلاناتي..."
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
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,122,32,0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />

          {/* Clear button */}
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
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '22px',
                height: '22px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'rgba(220,53,69,0.1)';
                e.currentTarget.style.color = '#DC3545';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
              aria-label="مسح البحث"
            >
              <FaTimes size={10} />
            </button>
          )}

          {/* Searching indicator */}
          {isSearching && localSearch && (
            <span
              style={{
                position: 'absolute',
                left: '36px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span
                className="spinner-border spinner-border-sm"
                style={{
                  width: '13px',
                  height: '13px',
                  color: 'var(--primary-orange)',
                  borderWidth: '1.5px',
                }}
              />
            </span>
          )}
        </div>

        {/* Sort Dropdown */}
        <div
          ref={sortDropdownRef}
          style={{
            position: 'relative',
            flex: '0 1 auto',
            minWidth: '150px',
          }}
        >
          <button
            type="button"
            onClick={() => setShowSortDropdown((v) => !v)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '11px',
              border: `1px solid ${
                showSortDropdown ? 'var(--primary-orange)' : 'var(--border-color)'
              }`,
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-secondary)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              if (!showSortDropdown) {
                e.currentTarget.style.borderColor = 'var(--primary-orange)';
              }
            }}
            onMouseLeave={(e) => {
              if (!showSortDropdown) {
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                minWidth: 0,
                flex: 1,
              }}
            >
              <FaSortAmountDown size={12} color="var(--primary-orange)" />
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
            <motion.span
              animate={{ rotate: showSortDropdown ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'inline-flex',
                opacity: 0.6,
              }}
            >
              <FaChevronDown size={10} />
            </motion.span>
          </button>

          <AnimatePresence>
            {showSortDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
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
                {sortOptions.map((opt) => {
                  const active = opt.value === sort;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onSortChange(opt.value);
                        setShowSortDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: active
                          ? 'rgba(232,122,32,0.08)'
                          : 'transparent',
                        color: active
                          ? 'var(--primary-orange)'
                          : 'var(--text-secondary)',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '0.82rem',
                        fontWeight: active ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'right',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.backgroundColor =
                            'rgba(232,122,32,0.06)';
                          e.currentTarget.style.color = 'var(--primary-orange)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: active
                            ? 'var(--primary-orange)'
                            : 'transparent',
                          border: active
                            ? 'none'
                            : '1px solid var(--border-color)',
                          flexShrink: 0,
                        }}
                      />
                      {opt.label}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Row 2: Status Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        {/* Tabs */}
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
            minWidth: 0,
          }}
        >
          {statusTabs.map((tab) => {
            const active = tab.value === status;
            return (
              <motion.button
                key={tab.value}
                type="button"
                onClick={() => onStatusChange(tab.value)}
                whileTap={{ scale: 0.96 }}
                style={{
                  position: 'relative',
                  padding: '7px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: active
                    ? 'var(--bg-card)'
                    : 'transparent',
                  color: active
                    ? 'var(--primary-orange)'
                    : 'var(--text-muted)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: active ? 700 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: active ? '0 2px 8px var(--shadow-sm)' : 'none',
                  whiteSpace: 'nowrap',
                  flex: '1 1 auto',
                  minWidth: 'fit-content',
                }}
              >
                {tab.label}
                {active && (
                  <motion.div
                    layoutId="announcement-filter-active"
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: '25%',
                      right: '25%',
                      height: '3px',
                      borderRadius: '3px',
                      backgroundColor: 'var(--primary-orange)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Results Count + Clear */}
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
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              {resultsCount}{' '}
              {resultsCount === 1 ? 'نتيجة' : 'نتيجة'}
            </span>
          )}

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={onClear}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex',
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
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'rgba(220,53,69,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'rgba(220,53,69,0.06)';
                }}
              >
                <FaTimes size={10} />
                مسح الفلاتر
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default MyAnnouncementFilters;
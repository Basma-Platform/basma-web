import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FaSearch,
  FaTimes,
  FaSortAmountDown,
  FaCreditCard,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaLayerGroup,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import {
  FEATURED_SORT_OPTIONS,
  FEATURED_PAYMENT_OPTIONS,
} from '../../../utils/featuredHelpers';

export type AdminFeaturedStatusFilter =
  | 'all'
  | 'pending'
  | 'approved'
  | 'rejected';

export type AdminFeaturedSort =
  | 'newest'
  | 'oldest'
  | 'amount_high'
  | 'amount_low';

export type AdminFeaturedPaymentFilter =
  | 'all'
  | 'palpay'
  | 'jawwal_pay'
  | 'bop';

interface AdminFeaturedFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: AdminFeaturedStatusFilter;
  onStatusChange: (v: AdminFeaturedStatusFilter) => void;
  paymentMethod: AdminFeaturedPaymentFilter;
  onPaymentMethodChange: (v: AdminFeaturedPaymentFilter) => void;
  sort: AdminFeaturedSort;
  onSortChange: (v: AdminFeaturedSort) => void;
  isSearching?: boolean;
}

const AdminFeaturedFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  paymentMethod,
  onPaymentMethodChange,
  sort,
  onSortChange,
  isSearching = false,
}: AdminFeaturedFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [showSort, setShowSort] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ✅ Stable ref to onSearchChange so the debounce effect doesn't restart
  const onSearchChangeRef = useRef(onSearchChange);
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  // ============================================
  // Debounce search → call latest onSearchChange
  // ============================================
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChangeRef.current(localSearch);
    }, 450);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localSearch]);

  // Sync from parent when it changes externally
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // ============================================
  // Close dropdowns on outside click
  // ============================================
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSort(false);
      }
      if (
        paymentRef.current &&
        !paymentRef.current.contains(e.target as Node)
      ) {
        setShowPayment(false);
      }
    };
    if (showSort || showPayment) {
      document.addEventListener('mousedown', onClick);
    }
    return () => document.removeEventListener('mousedown', onClick);
  }, [showSort, showPayment]);

  // ============================================
  // Stable handlers
  // ============================================
  const handleClearSearch = useCallback(() => setLocalSearch(''), []);

  const handlePickSort = useCallback(
    (value: AdminFeaturedSort) => {
      onSortChange(value);
      setShowSort(false);
    },
    [onSortChange]
  );

  const handlePickPayment = useCallback(
    (value: AdminFeaturedPaymentFilter) => {
      onPaymentMethodChange(value);
      setShowPayment(false);
    },
    [onPaymentMethodChange]
  );

  // ============================================
  // Status tabs
  // ============================================
  const statusTabs: {
    key: AdminFeaturedStatusFilter;
    label: string;
    Icon: IconType;
    color: string;
  }[] = [
    { key: 'all', label: 'الكل', Icon: FaLayerGroup, color: '#8B5A2B' },
    {
      key: 'pending',
      label: 'قيد المراجعة',
      Icon: FaHourglassHalf,
      color: '#FFB800',
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

  const currentSortLabel =
    FEATURED_SORT_OPTIONS.find((o) => o.value === sort)?.label ||
    'الأحدث أولاً';

  const currentPaymentLabel =
    FEATURED_PAYMENT_OPTIONS.find((o) => o.value === paymentMethod)?.label ||
    'الكل';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="admin-featured-filters"
      dir="rtl"
    >
      {/* ============================================
          Row 1: Search + Payment + Sort
          ============================================ */}
      <div className="admin-featured-filters__row1">
        {/* Search */}
        <div className="admin-featured-filters__search">
          <FaSearch size={13} className="admin-featured-filters__search-icon" />
          <input
            type="text"
            placeholder="ابحث بالاسم، البريد، أو عنوان الإعلان..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="admin-featured-filters__search-input"
          />
          {localSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="admin-featured-filters__search-clear"
              aria-label="مسح"
            >
              <FaTimes size={11} />
            </button>
          )}
          {isSearching && localSearch && (
            <span className="admin-featured-filters__search-spinner spinner-border spinner-border-sm" />
          )}
        </div>

        {/* Payment dropdown */}
        <div ref={paymentRef} className="admin-featured-filters__dropdown">
          <button
            type="button"
            onClick={() => setShowPayment((v) => !v)}
            className={`admin-featured-filters__dropdown-btn ${
              paymentMethod !== 'all' ? 'is-active' : ''
            } ${showPayment ? 'is-open' : ''}`}
          >
            <span className="admin-featured-filters__dropdown-content">
              <FaCreditCard size={11} />
              <span className="admin-featured-filters__dropdown-label">
                {currentPaymentLabel}
              </span>
            </span>
          </button>

          {showPayment && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="admin-featured-filters__menu"
            >
              {FEATURED_PAYMENT_OPTIONS.map((opt) => {
                const active = opt.value === paymentMethod;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      handlePickPayment(
                        opt.value as AdminFeaturedPaymentFilter
                      )
                    }
                    className={`admin-featured-filters__menu-item ${
                      active ? 'is-active' : ''
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Sort dropdown */}
        <div ref={sortRef} className="admin-featured-filters__dropdown">
          <button
            type="button"
            onClick={() => setShowSort((v) => !v)}
            className={`admin-featured-filters__dropdown-btn ${
              showSort ? 'is-open' : ''
            }`}
          >
            <span className="admin-featured-filters__dropdown-content">
              <FaSortAmountDown size={11} color="var(--primary-orange)" />
              <span className="admin-featured-filters__dropdown-label">
                {currentSortLabel}
              </span>
            </span>
          </button>

          {showSort && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="admin-featured-filters__menu"
            >
              {FEATURED_SORT_OPTIONS.map((opt) => {
                const active = opt.value === sort;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      handlePickSort(opt.value as AdminFeaturedSort)
                    }
                    className={`admin-featured-filters__menu-item ${
                      active ? 'is-active' : ''
                    }`}
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
          Row 2: Status tabs (full width)
          ============================================ */}
      <div className="admin-featured-filters__tabs" role="tablist">
        {statusTabs.map((tab) => {
          const active = status === tab.key;
          const Icon = tab.Icon;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onStatusChange(tab.key)}
              className="admin-featured-filters__tab"
              style={{ color: active ? tab.color : 'var(--text-muted)' }}
            >
              <Icon size={11} />
              <span className="admin-featured-filters__tab-label">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Responsive styles */}
      <style>{`
        .admin-featured-filters {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 1rem 1.1rem;
          margin-bottom: 1.25rem;
          box-shadow: 0 2px 12px var(--shadow-sm);
          font-family: 'Cairo', sans-serif;
          width: 100%;
          box-sizing: border-box;
        }

        .admin-featured-filters__row1 {
          display: flex;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
          width: 100%;
          box-sizing: border-box;
        }

        .admin-featured-filters__search {
          position: relative;
          flex: 1 1 240px;
          min-width: 0;
          width: 100%;
        }

        .admin-featured-filters__search-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          opacity: 0.6;
          pointer-events: none;
        }

        .admin-featured-filters__search-input {
          width: 100%;
          padding: 10px 40px 10px 40px;
          border-radius: 11px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-input);
          color: var(--text-primary);
          font-family: 'Cairo', sans-serif;
          font-size: 0.85rem;
          outline: none;
          transition: all 0.25s ease;
          box-sizing: border-box;
        }

        .admin-featured-filters__search-input:focus {
          border-color: var(--primary-orange);
          box-shadow: 0 0 0 3px rgba(232,122,32,0.1);
        }

        .admin-featured-filters__search-clear {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-featured-filters__search-spinner {
          position: absolute;
          left: 36px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--primary-orange);
          width: 13px;
          height: 13px;
          border-width: 1.5px;
        }

        .admin-featured-filters__dropdown {
          position: relative;
          flex: 0 0 auto;
          min-width: 150px;
        }

        .admin-featured-filters__dropdown-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          width: 100%;
          padding: 10px 14px;
          border-radius: 11px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-input);
          color: var(--text-secondary);
          font-family: 'Cairo', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .admin-featured-filters__dropdown-btn.is-active,
        .admin-featured-filters__dropdown-btn.is-open {
          border-color: var(--primary-orange);
          background-color: rgba(232,122,32,0.06);
          color: var(--primary-orange);
        }

        .admin-featured-filters__dropdown-content {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
          flex: 1;
        }

        .admin-featured-filters__dropdown-label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-featured-filters__menu {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          left: 0;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          box-shadow: 0 12px 32px var(--shadow-md);
          padding: 6px;
          z-index: 100;
          min-width: 180px;
        }

        .admin-featured-filters__menu-item {
          width: 100%;
          text-align: right;
          padding: 8px 12px;
          border-radius: 8px;
          border: none;
          background-color: transparent;
          color: var(--text-secondary);
          font-family: 'Cairo', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .admin-featured-filters__menu-item.is-active {
          background-color: rgba(232,122,32,0.08);
          color: var(--primary-orange);
          font-weight: 700;
        }

        .admin-featured-filters__menu-item:hover:not(.is-active) {
          background-color: rgba(232,122,32,0.06);
          color: var(--primary-orange);
        }

        /* ============================================
           Tabs — full width row
           ============================================ */
        .admin-featured-filters__tabs {
          display: flex;
          gap: 4px;
          padding: 4px;
          background-color: var(--bg-input);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          width: 100%;
          box-sizing: border-box;
        }

        .admin-featured-filters__tab {
          flex: 1 1 0;
          min-width: 0;
          padding: 9px 6px;
          border-radius: 9px;
          border: none;
          background-color: transparent;
          font-family: 'Cairo', sans-serif;
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 5px;
          justify-content: center;
          white-space: nowrap;
          overflow: hidden;
          box-sizing: border-box;
        }

        .admin-featured-filters__tab-label {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ============================================
           Responsive
           ============================================ */
        @media (max-width: 480px) {
          .admin-featured-filters {
            padding: 0.85rem;
            border-radius: 14px;
          }
          .admin-featured-filters__row1 {
            gap: 8px;
          }
          .admin-featured-filters__dropdown {
            flex: 1 1 calc(50% - 4px);
            min-width: 0;
          }
          .admin-featured-filters__tab {
            font-size: 0.7rem;
            padding: 8px 4px;
            gap: 3px;
          }
        }

        @media (max-width: 380px) {
          .admin-featured-filters__dropdown {
            flex: 1 1 100%;
          }
          .admin-featured-filters__tabs {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 4px;
          }
          .admin-featured-filters__tab {
            padding: 8px 6px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default AdminFeaturedFilters;
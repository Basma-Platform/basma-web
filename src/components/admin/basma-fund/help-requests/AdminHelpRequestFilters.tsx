import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FaSearch,
  FaTimes,
  FaSortAmountDown,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaArchive,
  FaLayerGroup,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { FUND_THEME } from '../../../../utils/helpRequestHelpers';

export type AdminHelpRequestStatusFilter =
  | 'all'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'archived';

export type AdminHelpRequestSort =
  | 'newest'
  | 'oldest'
  | 'most_viewed';

interface AdminHelpRequestFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: AdminHelpRequestStatusFilter;
  onStatusChange: (v: AdminHelpRequestStatusFilter) => void;
  sort: AdminHelpRequestSort;
  onSortChange: (v: AdminHelpRequestSort) => void;
  isSearching?: boolean;
}

const SORT_OPTIONS: { value: AdminHelpRequestSort; label: string }[] = [
  { value: 'newest', label: 'الأحدث أولاً' },
  { value: 'oldest', label: 'الأقدم أولاً' },
  { value: 'most_viewed', label: 'الأكثر مشاهدة' },
];

const STATUS_TABS: {
  key: AdminHelpRequestStatusFilter;
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
    label: 'منشور',
    Icon: FaCheckCircle,
    color: '#28A745',
  },
  {
    key: 'rejected',
    label: 'مرفوض',
    Icon: FaTimesCircle,
    color: '#DC3545',
  },
  {
    key: 'archived',
    label: 'مؤرشف',
    Icon: FaArchive,
    color: '#6B4226',
  },
];

const AdminHelpRequestFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  isSearching = false,
}: AdminHelpRequestFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [showSort, setShowSort] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSearchChangeRef = useRef(onSearchChange);

  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChangeRef.current(localSearch);
    }, 450);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localSearch]);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSort(false);
      }
    };
    if (showSort) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [showSort]);

  const handleClear = useCallback(() => setLocalSearch(''), []);

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label || 'الأحدث أولاً';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="admin-hr-filters"
      dir="rtl"
    >
      {/* Row 1: Search + Sort */}
      <div className="admin-hr-filters__row1">
        <div className="admin-hr-filters__search">
          <FaSearch size={13} className="admin-hr-filters__search-icon" />
          <input
            type="text"
            placeholder="ابحث بعنوان الطلب، اسم المستخدم..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="admin-hr-filters__search-input"
          />
          {localSearch && (
            <button
              type="button"
              onClick={handleClear}
              className="admin-hr-filters__search-clear"
              aria-label="مسح"
            >
              <FaTimes size={11} />
            </button>
          )}
          {isSearching && localSearch && (
            <span className="admin-hr-filters__search-spinner spinner-border spinner-border-sm" />
          )}
        </div>

        <div ref={sortRef} className="admin-hr-filters__dropdown">
          <button
            type="button"
            onClick={() => setShowSort((v) => !v)}
            className={`admin-hr-filters__dropdown-btn ${
              showSort ? 'is-open' : ''
            }`}
          >
            <span className="admin-hr-filters__dropdown-content">
              <FaSortAmountDown size={11} color={FUND_THEME.accent} />
              <span className="admin-hr-filters__dropdown-label">
                {currentSortLabel}
              </span>
            </span>
          </button>

          {showSort && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="admin-hr-filters__menu"
            >
              {SORT_OPTIONS.map((opt) => {
                const active = opt.value === sort;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSortChange(opt.value);
                      setShowSort(false);
                    }}
                    className={`admin-hr-filters__menu-item ${
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

      {/* Row 2: Tabs */}
      <div className="admin-hr-filters__tabs" role="tablist">
        {STATUS_TABS.map((tab) => {
          const active = status === tab.key;
          const Icon = tab.Icon;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onStatusChange(tab.key)}
              className="admin-hr-filters__tab"
              style={{ color: active ? tab.color : 'var(--text-muted)' }}
            >
              <Icon size={11} />
              <span className="admin-hr-filters__tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        .admin-hr-filters {
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

        .admin-hr-filters__row1 {
          display: flex;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
          width: 100%;
          box-sizing: border-box;
        }

        .admin-hr-filters__search {
          position: relative;
          flex: 1 1 240px;
          min-width: 0;
        }

        .admin-hr-filters__search-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          opacity: 0.6;
          pointer-events: none;
        }

        .admin-hr-filters__search-input {
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

        .admin-hr-filters__search-input:focus {
          border-color: ${FUND_THEME.accent};
          box-shadow: 0 0 0 3px ${FUND_THEME.accent}20;
        }

        .admin-hr-filters__search-clear {
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

        .admin-hr-filters__search-spinner {
          position: absolute;
          left: 36px;
          top: 50%;
          transform: translateY(-50%);
          color: ${FUND_THEME.accent};
          width: 13px;
          height: 13px;
          border-width: 1.5px;
        }

        .admin-hr-filters__dropdown {
          position: relative;
          flex: 0 0 auto;
          min-width: 160px;
        }

        .admin-hr-filters__dropdown-btn {
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

        .admin-hr-filters__dropdown-btn.is-open {
          border-color: ${FUND_THEME.accent};
          color: ${FUND_THEME.accent};
        }

        .admin-hr-filters__dropdown-content {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
          flex: 1;
        }

        .admin-hr-filters__dropdown-label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-hr-filters__menu {
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

        .admin-hr-filters__menu-item {
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

        .admin-hr-filters__menu-item.is-active {
          background-color: ${FUND_THEME.accent}12;
          color: ${FUND_THEME.accent};
          font-weight: 700;
        }

        .admin-hr-filters__menu-item:hover:not(.is-active) {
          background-color: ${FUND_THEME.accent}08;
          color: ${FUND_THEME.accent};
        }

        /* ---------- Tabs ---------- */
        .admin-hr-filters__tabs {
          display: flex;
          gap: 4px;
          padding: 4px;
          background-color: var(--bg-input);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          width: 100%;
          box-sizing: border-box;
        }

        .admin-hr-filters__tab {
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

        .admin-hr-filters__tab-label {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 480px) {
          .admin-hr-filters {
            padding: 0.85rem;
            border-radius: 14px;
          }
          .admin-hr-filters__dropdown {
            flex: 1 1 calc(50% - 4px);
            min-width: 0;
          }
          .admin-hr-filters__tab {
            font-size: 0.7rem;
            padding: 8px 4px;
            gap: 3px;
          }
        }

        @media (max-width: 380px) {
          .admin-hr-filters__dropdown {
            flex: 1 1 100%;
          }
          .admin-hr-filters__tabs {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 4px;
          }
          .admin-hr-filters__tab {
            padding: 8px 6px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default AdminHelpRequestFilters;
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FaSearch,
  FaTimes,
  FaLayerGroup,
  FaInbox,
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { FUND_THEME } from '../../../../utils/helpRequestHelpers';

export type AdminInquiryStatusFilter =
  | 'all'
  | 'new'
  | 'contacted'
  | 'completed'
  | 'cancelled';

interface AdminInquiryFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: AdminInquiryStatusFilter;
  onStatusChange: (v: AdminInquiryStatusFilter) => void;
  isSearching?: boolean;
}

const STATUS_TABS: {
  key: AdminInquiryStatusFilter;
  label: string;
  Icon: IconType;
  color: string;
}[] = [
  { key: 'all', label: 'الكل', Icon: FaLayerGroup, color: '#8B5A2B' },
  { key: 'new', label: 'جديد', Icon: FaInbox, color: FUND_THEME.accent },
  { key: 'contacted', label: 'تم التواصل', Icon: FaPhone, color: '#FFB800' },
  {
    key: 'completed',
    label: 'مكتمل',
    Icon: FaCheckCircle,
    color: '#28A745',
  },
  {
    key: 'cancelled',
    label: 'ملغي',
    Icon: FaTimesCircle,
    color: '#6C757D',
  },
];

const AdminInquiryFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  isSearching = false,
}: AdminInquiryFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(search);
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

  const handleClear = useCallback(() => setLocalSearch(''), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="admin-inq-filters"
      dir="rtl"
    >
      <div className="admin-inq-filters__search">
        <FaSearch size={13} className="admin-inq-filters__search-icon" />
        <input
          type="text"
          placeholder="ابحث بكود التتبع، اسم المتبرع، عنوان الطلب..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="admin-inq-filters__search-input"
        />
        {localSearch && (
          <button
            type="button"
            onClick={handleClear}
            className="admin-inq-filters__search-clear"
            aria-label="مسح"
          >
            <FaTimes size={11} />
          </button>
        )}
        {isSearching && localSearch && (
          <span className="admin-inq-filters__search-spinner spinner-border spinner-border-sm" />
        )}
      </div>

      <div className="admin-inq-filters__tabs" role="tablist">
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
              className="admin-inq-filters__tab"
              style={{ color: active ? tab.color : 'var(--text-muted)' }}
            >
              <Icon size={11} />
              <span className="admin-inq-filters__tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        .admin-inq-filters {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 1rem 1.1rem;
          margin-bottom: 1.25rem;
          box-shadow: 0 2px 12px var(--shadow-sm);
          font-family: 'Cairo', sans-serif;
        }

        .admin-inq-filters__search {
          position: relative;
          margin-bottom: 12px;
        }

        .admin-inq-filters__search-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          opacity: 0.6;
          pointer-events: none;
        }

        .admin-inq-filters__search-input {
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

        .admin-inq-filters__search-input:focus {
          border-color: ${FUND_THEME.accent};
          box-shadow: 0 0 0 3px ${FUND_THEME.accent}20;
        }

        .admin-inq-filters__search-clear {
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

        .admin-inq-filters__search-spinner {
          position: absolute;
          left: 36px;
          top: 50%;
          transform: translateY(-50%);
          color: ${FUND_THEME.accent};
          width: 13px;
          height: 13px;
          border-width: 1.5px;
        }

        .admin-inq-filters__tabs {
          display: flex;
          gap: 4px;
          padding: 4px;
          background-color: var(--bg-input);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          width: 100%;
          box-sizing: border-box;
        }

        .admin-inq-filters__tab {
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

        .admin-inq-filters__tab-label {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 640px) {
          .admin-inq-filters__tabs {
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
          }
          .admin-inq-filters__tabs::-webkit-scrollbar {
            display: none;
          }
          .admin-inq-filters__tab {
            flex: 0 0 auto;
            min-width: 110px;
            scroll-snap-align: start;
          }
        }

        @media (max-width: 380px) {
          .admin-inq-filters__tab {
            min-width: 60px;
            padding: 10px 12px;
          }
          .admin-inq-filters__tab-label {
            display: none;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default AdminInquiryFilters;
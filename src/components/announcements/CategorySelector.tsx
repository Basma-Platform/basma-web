import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
  FaFilter,
} from 'react-icons/fa';
import { BiFolder } from 'react-icons/bi';
import type { Category } from '../../types';
import { getCategoryColor, getCategoryIcon } from '../../utils/categoryHelpers';
import CategorySelectorSkeleton from './CategorySelectorSkeleton';

const MAX_SELECTION = 5;

interface CategorySelectorProps {
  categories: Category[];
  /** ✨ Multi-select: array of selected IDs */
  selectedCategoryIds: number[];
  onSelectionChange: (ids: number[]) => void;
  isLoading?: boolean;
  /** Optional: category image URLs already loaded? */
  imagesLoaded?: boolean;
}

const CategorySelector = ({
  categories,
  selectedCategoryIds,
  onSelectionChange,
  isLoading = false,
}: CategorySelectorProps) => {
  // Collapsible state (default: collapsed on mobile, expanded on desktop handled via CSS, but keep default open for clarity)
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return <CategorySelectorSkeleton />;
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  const selectedCount = selectedCategoryIds.length;

  // ============================================
  // Toggle a category
  // ============================================
  const handleToggle = (id: number) => {
    const isSelected = selectedCategoryIds.includes(id);

    if (isSelected) {
      onSelectionChange(selectedCategoryIds.filter((x) => x !== id));
      return;
    }

    if (selectedCategoryIds.length >= MAX_SELECTION) {
      // Backend silently truncates beyond 5 — better to block in UI
      // (Also could show a toast — left to the parent to decide)
      return;
    }

    onSelectionChange([...selectedCategoryIds, id]);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange([]);
  };

  // ============================================
  // Selected categories (for the header chips)
  // ============================================
  const selectedCategories = categories.filter((c) =>
    selectedCategoryIds.includes(c.id)
  );

  return (
    <div className="category-selector-collapsible">
      {/* ============================================ */}
      {/* Header — always visible */}
      {/* ============================================ */}
      <button
        type="button"
        onClick={() => setIsExpanded((v) => !v)}
        aria-expanded={isExpanded}
        aria-controls="category-grid-content"
        className="category-selector-collapsible__header"
      >
        <div className="category-selector-collapsible__header-left">
          <span className="category-selector-collapsible__icon">
            <BiFolder size={16} />
          </span>
          <span className="category-selector-collapsible__title">
            تصفية حسب الفئة
          </span>

          {selectedCount > 0 && (
            <span className="category-selector-collapsible__badge">
              {selectedCount}
            </span>
          )}
        </div>

        <div className="category-selector-collapsible__header-right">
          {selectedCount > 0 && (
            <span
              onClick={handleClearAll}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClearAll(e as any);
                }
              }}
              className="category-selector-collapsible__clear"
              aria-label="مسح كل الفئات"
            >
              <FaTimes size={11} />
              مسح
            </span>
          )}

          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="category-selector-collapsible__arrow"
          >
            {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </motion.span>
        </div>
      </button>

      {/* ============================================ */}
      {/* Selected chips (visible even when collapsed) */}
      {/* ============================================ */}
      <AnimatePresence initial={false}>
        {!isExpanded && selectedCategories.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="category-selector-collapsible__selected-chips">
              {selectedCategories.map((cat) => {
                const color = getCategoryColor(cat.slug);
                return (
                  <motion.button
                    key={cat.id}
                    type="button"
                    onClick={() => handleToggle(cat.id)}
                    className="category-selector-collapsible__chip"
                    style={{
                      ['--chip-color' as any]: color,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="category-selector-collapsible__chip-dot" />
                    <span className="category-selector-collapsible__chip-label">
                      {cat.name}
                    </span>
                    <FaTimes size={9} className="category-selector-collapsible__chip-x" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* Expandable grid */}
      {/* ============================================ */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="category-grid-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="category-selector-collapsible__hint">
              <FaFilter size={10} />
              <span>
                يمكنك اختيار {MAX_SELECTION} فئات كحد أقصى لتصفية النتائج
              </span>
            </div>

            <div className="category-selector-collapsible__grid">
              {categories.map((cat) => {
                const isSelected = selectedCategoryIds.includes(cat.id);
                const Icon = getCategoryIcon(cat.slug);
                const color = getCategoryColor(cat.slug);

                return (
                  <motion.button
                    key={cat.id}
                    type="button"
                    onClick={() => handleToggle(cat.id)}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`category-card-collapsible ${
                      isSelected ? 'is-selected' : ''
                    }`}
                    style={{
                      ['--cat-color' as any]: color,
                    }}
                  >
                    {/* Image / Icon */}
                    <div className="category-card-collapsible__image-wrap">
                      {cat.image_url ? (
                        <img
                          src={cat.image_url}
                          alt={cat.name}
                          className="category-card-collapsible__image"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className =
                                'category-card-collapsible__placeholder';
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <div className="category-card-collapsible__placeholder" />
                      )}

                      <div className="category-card-collapsible__icon-badge">
                        <Icon size={12} color={color} />
                      </div>
                    </div>

                    {/* Name */}
                    <span className="category-card-collapsible__name">
                      {cat.name}
                    </span>

                    {/* High-Risk Badge */}
                    {cat.is_high_risk && (
                      <span
                        className="category-card-collapsible__high-risk"
                        title="يتطلب توثيق الهوية"
                      >
                        <FaExclamationTriangle size={9} />
                      </span>
                    )}

                    {/* Selected Checkmark */}
                    {isSelected && (
                      <span className="category-card-collapsible__check">
                        <FaCheck size={10} />
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .category-selector-collapsible {
          width: 100%;
          max-width: 900px;
          margin: 0 auto 1.5rem;
          background: var(--bg-card);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          overflow: hidden;
          box-shadow: 0 2px 12px var(--shadow-sm);
          transition: all 0.3s ease;
        }

        /* ============================================ */
        /* Header */
        /* ============================================ */
        .category-selector-collapsible__header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 12px 16px;
          background: var(--bg-input);
          border: none;
          cursor: pointer;
          font-family: 'Cairo', sans-serif;
          transition: background 0.2s ease;
          text-align: right;
        }
        .category-selector-collapsible__header:hover {
          background: var(--bg-card-hover);
        }

        .category-selector-collapsible__header-left {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }
        .category-selector-collapsible__icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(232, 122, 32, 0.12);
          color: var(--primary-orange);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .category-selector-collapsible__title {
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 700;
          white-space: nowrap;
        }
        .category-selector-collapsible__badge {
          background: var(--primary-orange);
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 10px;
          font-family: system-ui, sans-serif;
          min-width: 18px;
          text-align: center;
        }

        .category-selector-collapsible__header-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .category-selector-collapsible__clear {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(220, 53, 69, 0.08);
          color: #DC3545;
          font-family: 'Cairo', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .category-selector-collapsible__clear:hover {
          background: rgba(220, 53, 69, 0.15);
        }
        .category-selector-collapsible__arrow {
          display: inline-flex;
          align-items: center;
          color: var(--text-muted);
          opacity: 0.7;
        }

        /* ============================================ */
        /* Selected chips row (shown when collapsed) */
        /* ============================================ */
        .category-selector-collapsible__selected-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 10px 16px 12px;
          border-top: 1px dashed var(--border-color);
        }

        .category-selector-collapsible__chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid color-mix(in srgb, var(--chip-color, #E87A20) 40%, transparent);
          background: color-mix(in srgb, var(--chip-color, #E87A20) 10%, transparent);
          color: var(--chip-color, #E87A20);
          font-family: 'Cairo', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .category-selector-collapsible__chip:hover {
          background: color-mix(in srgb, var(--chip-color, #E87A20) 18%, transparent);
        }
        .category-selector-collapsible__chip-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--chip-color, #E87A20);
          flex-shrink: 0;
        }
        .category-selector-collapsible__chip-label {
          white-space: nowrap;
        }
        .category-selector-collapsible__chip-x {
          opacity: 0.7;
        }

        /* ============================================ */
        /* Grid */
        /* ============================================ */
        .category-selector-collapsible__hint {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px 6px;
          color: var(--text-muted);
          font-family: 'Cairo', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          opacity: 0.85;
        }

        .category-selector-collapsible__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          gap: 12px;
          padding: 6px 16px 16px;
        }

        /* ============================================ */
        /* Category card (compact) */
        /* ============================================ */
        .category-card-collapsible {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 12px 8px;
          border-radius: 14px;
          background: var(--bg-card);
          border: 2.5px solid var(--border-color);
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'Cairo', sans-serif;
          min-height: 108px;
          user-select: none;
        }

        .category-card-collapsible:hover {
          border-color: var(--cat-color, var(--primary-orange));
          box-shadow: 0 6px 20px var(--shadow-md);
        }

        .category-card-collapsible.is-selected {
          border-color: var(--cat-color, var(--primary-orange));
          background: color-mix(in srgb, var(--cat-color, #E87A20) 8%, var(--bg-card));
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--cat-color, #E87A20) 18%, transparent);
        }

        .category-card-collapsible__image-wrap {
          position: relative;
          width: 54px;
          height: 54px;
          border-radius: 12px;
          overflow: hidden;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          flex-shrink: 0;
        }
        .category-card-collapsible__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .category-card-collapsible__placeholder {
          width: 100%;
          height: 100%;
          background: var(--bg-input);
        }
        .category-card-collapsible__icon-badge {
          position: absolute;
          bottom: -3px;
          right: -3px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--bg-card);
          border: 2px solid var(--bg-card);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
        .category-card-collapsible__name {
          font-size: 0.73rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-align: center;
          line-height: 1.3;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-word;
        }
        .category-card-collapsible__high-risk {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #ffc107;
          color: #212529;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-card);
          box-shadow: 0 2px 8px rgba(255, 193, 7, 0.4);
        }
        .category-card-collapsible__check {
          position: absolute;
          bottom: -6px;
          right: -6px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--cat-color, var(--primary-orange));
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-card);
          box-shadow: 0 2px 8px rgba(232, 122, 32, 0.4);
        }

        /* ============================================ */
        /* Responsive */
        /* ============================================ */
        @media (max-width: 576px) {
          .category-selector-collapsible__grid {
            grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
            gap: 10px;
            padding: 6px 12px 12px;
          }
          .category-card-collapsible {
            min-height: 100px;
            padding: 10px 6px;
          }
          .category-card-collapsible__image-wrap {
            width: 48px;
            height: 48px;
          }
          .category-card-collapsible__name {
            font-size: 0.68rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CategorySelector;
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBox, 
  FaTools 
} from 'react-icons/fa';
import { 
  BiTag, 
  BiError, 
  BiCheck, 
  BiX, 
  BiFolder, 
  BiPointer 
} from 'react-icons/bi';
import type { SubCategory } from '../../types';
import SubCategorySelectorSkeleton from './SubCategorySelectorSkeleton';

interface SubCategorySelectorProps {
  subCategories: {
    goods: SubCategory[];
    services: SubCategory[];
  };
  selectedSubCategories: number[];
  onSubCategoryToggle: (id: number) => void;
  selectedCategory: 'goods' | 'services' | null;
  onCategorySelect: (category: 'goods' | 'services' | null) => void;
  isLoading?: boolean;
}

const SubCategorySelector = ({
  subCategories,
  selectedSubCategories,
  onSubCategoryToggle,
  selectedCategory,
  onCategorySelect,
  isLoading = false,
}: SubCategorySelectorProps) => {
  const allSubCategories = selectedCategory ? subCategories[selectedCategory] || [] : [];
  const isSelected = (id: number) => selectedSubCategories.includes(id);

  const hasGoods = subCategories.goods.length > 0;
  const hasServices = subCategories.services.length > 0;

  const handleCategoryClick = (category: 'goods' | 'services') => {
    if (selectedCategory === category) {
      onCategorySelect(null);
    } else {
      onCategorySelect(category);
    }
  };

  const clearAll = () => {
    allSubCategories.forEach((sub) => {
      if (isSelected(sub.id)) {
        onSubCategoryToggle(sub.id);
      }
    });
  };

  if (isLoading) {
    return <SubCategorySelectorSkeleton />;
  }

  if (!hasGoods && !hasServices) {
    return null;
  }

  const getCategoryCount = (cat: 'goods' | 'services') => {
    return subCategories[cat]?.length || 0;
  };

  const getCategoryLabel = (cat: 'goods' | 'services') => {
    return cat === 'goods' ? 'سلع' : 'خدمات';
  };

  const getCategoryIcon = (cat: 'goods' | 'services') => {
    return cat === 'goods' ? <FaBox size={16} /> : <FaTools size={16} />;
  };

  return (
    <div className="sub-category-selector">
      {/* ============================================ */}
      {/* MAIN CATEGORIES - Always visible */}
      {/* ============================================ */}
      <div className="category-main-row">
        <div className="category-main-buttons">
          {hasGoods && (
            <button
              className={`category-main-btn ${selectedCategory === 'goods' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('goods')}
            >
              <span className="category-main-icon">{getCategoryIcon('goods')}</span>
              <span className="category-main-label">{getCategoryLabel('goods')}</span>
              <span className="category-main-count">({getCategoryCount('goods')})</span>
            </button>
          )}
          {hasServices && (
            <button
              className={`category-main-btn ${selectedCategory === 'services' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('services')}
            >
              <span className="category-main-icon">{getCategoryIcon('services')}</span>
              <span className="category-main-label">{getCategoryLabel('services')}</span>
              <span className="category-main-count">({getCategoryCount('services')})</span>
            </button>
          )}
        </div>

        {/* Selected count badge */}
        {selectedSubCategories.length > 0 && (
          <span className="category-selected-badge">
            <BiTag size={14} className="me-1" /> {selectedSubCategories.length} فئة محددة
          </span>
        )}
      </div>

      {/* ============================================ */}
      {/* SUB-CATEGORY CONTENT */}
      {/* ============================================ */}
      <div className="sub-category-content-wrapper">
        <AnimatePresence mode="wait">
          {selectedCategory && allSubCategories.length > 0 ? (
            <motion.div
              key={selectedCategory}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="sub-category-content"
            >
              <div className="sub-category-grid">
                {allSubCategories.map((sub) => {
                  const selected = isSelected(sub.id);
                  return (
                    <motion.div
                      key={sub.id}
                      whileHover={{ y: -4, scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      className={`sub-category-card ${selected ? 'selected' : ''} ${sub.is_high_risk ? 'high-risk' : ''}`}
                      onClick={() => onSubCategoryToggle(sub.id)}
                    >
                      {/* Image */}
                      <div className="sub-category-image-wrapper">
                        {sub.image_url ? (
                          <img
                            src={sub.image_url}
                            alt={sub.name}
                            className="sub-category-image"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const placeholder = document.createElement('div');
                                placeholder.className = 'sub-category-placeholder';
                                parent.appendChild(placeholder);
                              }
                            }}
                          />
                        ) : (
                          <div className="sub-category-placeholder">
                            <BiFolder size={26} />
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <span className="sub-category-name">{sub.name}</span>

                      {/* High Risk Badge */}
                      {sub.is_high_risk && (
                        <span className="high-risk-badge" title="يتطلب توثيق الهوية">
                          <BiError size={13} />
                        </span>
                      )}

                      {/* Selected Checkmark */}
                      {selected && (
                        <span className="selected-check">
                          <BiCheck size={14} strokeWidth={1} />
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Clear all button */}
              {selectedSubCategories.length > 1 && (
                <div className="clear-all-row">
                  <button className="clear-all-btn d-inline-flex align-items-center gap-1" onClick={clearAll}>
                    <span>إلغاء تحديد الكل</span>
                    <BiX size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          ) : selectedCategory && allSubCategories.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sub-category-empty"
            >
              <span className="empty-icon text-muted mb-2">
                <FaBox size={42} />
              </span>
              <p>لا توجد فئات فرعية في هذا القسم</p>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sub-category-placeholder-box"
            >
              <span className="placeholder-icon text-muted mb-2">
                <BiPointer size={42} />
              </span>
              <p>اختر فئة أساسية لتحميل الفئات الفرعية</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .sub-category-selector {
          width: 100%;
          max-width: 820px;
          margin: 0 auto 1.5rem;
          background: var(--bg-card);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          overflow: hidden;
          box-shadow: 0 2px 12px var(--shadow-sm);
          transition: all 0.3s ease;
        }

        .category-main-row {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 16px;
          background: var(--bg-input);
          border-bottom: 1px solid var(--border-color);
          gap: 16px;
          flex-wrap: wrap;
        }

        .category-main-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .category-main-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 28px;
          border-radius: 30px;
          border: 2px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-muted);
          font-family: 'Cairo', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 100px;
          justify-content: center;
        }

        .category-main-btn:hover {
          border-color: var(--primary-orange);
          color: var(--primary-orange);
          transform: translateY(-2px);
        }

        .category-main-btn.active {
          background: var(--primary-orange);
          border-color: var(--primary-orange);
          color: #ffffff;
          box-shadow: 0 4px 16px rgba(232, 122, 32, 0.35);
          transform: translateY(-2px);
        }

        .category-main-btn .category-main-icon {
          display: flex;
          align-items: center;
        }

        .category-main-btn .category-main-label {
          font-weight: 700;
        }

        .category-main-btn .category-main-count {
          font-size: 0.7rem;
          opacity: 0.6;
          font-weight: 400;
        }

        .category-main-btn.active .category-main-count {
          opacity: 0.8;
          color: rgba(255, 255, 255, 0.8);
        }

        .category-selected-badge {
          display: inline-flex;
          align-items: center;
          font-family: 'Cairo', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--primary-orange);
          background: rgba(232, 122, 32, 0.08);
          padding: 4px 14px;
          border-radius: 20px;
          border: 1px solid rgba(232, 122, 32, 0.15);
          white-space: nowrap;
        }

        .sub-category-content-wrapper {
          min-height: 80px;
          background: var(--bg-card);
        }

        .sub-category-content {
          padding: 16px;
          overflow: hidden;
        }

        .sub-category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          gap: 14px;
        }

        .sub-category-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 14px 10px;
          border-radius: 14px;
          background: var(--bg-card);
          border: 2.5px solid var(--border-color);
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          min-height: 120px;
          gap: 6px;
          user-select: none;
        }

        .sub-category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px var(--shadow-md);
          border-color: var(--primary-orange);
        }

        .sub-category-card.selected {
          border-color: var(--primary-orange);
          background: rgba(232, 122, 32, 0.08);
          box-shadow: 0 0 0 3px rgba(232, 122, 32, 0.15), 0 4px 16px rgba(232, 122, 32, 0.1);
        }

        .sub-category-card.selected:hover {
          box-shadow: 0 0 0 4px rgba(232, 122, 32, 0.2), 0 8px 24px rgba(232, 122, 32, 0.15);
        }

        .sub-category-card.high-risk {
          border-color: #ffc10760;
        }

        .sub-category-card.high-risk.selected {
          border-color: #ffc107;
          background: rgba(255, 193, 7, 0.08);
          box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.15);
        }

        .sub-category-image-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
        }

        .sub-category-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sub-category-placeholder {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: var(--bg-input);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
        }

        .sub-category-name {
          font-family: 'Cairo', sans-serif;
          font-weight: 600;
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-align: center;
          line-height: 1.3;
        }

        .high-risk-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #ffc107;
          color: #212529;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(255, 193, 7, 0.4);
          border: 2px solid var(--bg-card);
        }

        .selected-check {
          position: absolute;
          bottom: -6px;
          right: -6px;
          background: var(--primary-orange);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(232, 122, 32, 0.4);
          border: 2px solid var(--bg-card);
        }

        .clear-all-row {
          text-align: center;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }

        .clear-all-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-family: 'Cairo', sans-serif;
          font-size: 0.8rem;
          cursor: pointer;
          padding: 4px 16px;
          border-radius: 20px;
          transition: all 0.2s ease;
        }

        .clear-all-btn:hover {
          background: rgba(220, 53, 69, 0.08);
          color: #dc3545;
        }

        .sub-category-placeholder-box,
        .sub-category-empty {
          text-align: center;
          padding: 2rem 1rem;
          background: var(--bg-card);
        }

        .sub-category-placeholder-box p,
        .sub-category-empty p {
          color: var(--text-muted);
          font-family: 'Cairo', sans-serif;
          font-size: 0.95rem;
          margin: 0;
        }

        @media (max-width: 576px) {
          .sub-category-grid {
            grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));
            gap: 10px;
          }

          .sub-category-card {
            min-height: 100px;
            padding: 10px 6px;
          }

          .sub-category-image-wrapper {
            width: 48px;
            height: 48px;
          }

          .sub-category-placeholder {
            width: 48px;
            height: 48px;
          }

          .sub-category-name {
            font-size: 0.7rem;
          }

          .category-main-btn {
            padding: 8px 16px;
            font-size: 0.8rem;
            min-width: 70px;
          }

          .category-main-row {
            padding: 10px 12px;
            gap: 10px;
          }

          .category-selected-badge {
            font-size: 0.7rem;
            padding: 2px 10px;
          }
        }

        @media (min-width: 577px) and (max-width: 768px) {
          .sub-category-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default SubCategorySelector;
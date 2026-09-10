const SubCategorySelectorSkeleton = () => {
  return (
    <div className="sub-category-selector-skeleton">
      {/* ============================================ */}
      {/* MAIN CATEGORIES - Skeleton */}
      {/* ============================================ */}
      <div className="category-main-row-skeleton">
        <div className="category-main-buttons-skeleton">
          <div className="category-main-btn-skeleton shimmer"></div>
          <div className="category-main-btn-skeleton shimmer"></div>
        </div>
      </div>

      {/* ============================================ */}
      {/* SUB-CATEGORY CONTENT - Skeleton */}
      {/* ============================================ */}
      <div className="sub-category-content-skeleton">
        <div className="sub-category-grid-skeleton">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="sub-category-card-skeleton shimmer">
              <div className="sub-category-image-skeleton shimmer"></div>
              <div className="sub-category-name-skeleton shimmer"></div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .sub-category-selector-skeleton {
          width: 100%;
          max-width: 820px;
          margin: 0 auto 1.5rem;
          background: var(--bg-card);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          overflow: hidden;
          box-shadow: 0 2px 12px var(--shadow-sm);
        }

        .category-main-row-skeleton {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 16px;
          background: var(--bg-input);
          border-bottom: 1px solid var(--border-color);
          gap: 16px;
        }

        .category-main-buttons-skeleton {
          display: flex;
          gap: 12px;
        }

        .category-main-btn-skeleton {
          width: 100px;
          height: 42px;
          border-radius: 30px;
          background-color: #e8e0d8;
        }

        .sub-category-content-skeleton {
          padding: 16px;
          background: var(--bg-card);
        }

        .sub-category-grid-skeleton {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          gap: 14px;
        }

        .sub-category-card-skeleton {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 14px 10px;
          border-radius: 14px;
          background: var(--bg-card);
          border: 2.5px solid var(--border-color);
          min-height: 120px;
          gap: 8px;
          background-color: var(--bg-input);
        }

        .sub-category-image-skeleton {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background-color: #e0d8d0;
        }

        .sub-category-name-skeleton {
          width: 50px;
          height: 12px;
          border-radius: 6px;
          background-color: #e0d8d0;
        }

        /* ============================================ */
        /* SHIMMER ANIMATION */
        /* ============================================ */
        .shimmer {
          position: relative;
          overflow: hidden;
        }

        .shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.5) 50%,
            transparent 100%
          );
          animation: shimmer 1.8s infinite;
        }

        [data-theme="dark"] .category-main-btn-skeleton {
          background-color: #5a4432 !important;
        }

        [data-theme="dark"] .sub-category-card-skeleton {
          background-color: #5a4432 !important;
        }

        [data-theme="dark"] .sub-category-image-skeleton {
          background-color: #4a3626 !important;
        }

        [data-theme="dark"] .sub-category-name-skeleton {
          background-color: #4a3626 !important;
        }

        [data-theme="dark"] .shimmer::after {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.08) 50%,
            transparent 100%
          );
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @media (max-width: 576px) {
          .sub-category-grid-skeleton {
            grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));
            gap: 10px;
          }

          .sub-category-card-skeleton {
            min-height: 100px;
            padding: 10px 6px;
          }

          .sub-category-image-skeleton {
            width: 48px;
            height: 48px;
          }

          .sub-category-name-skeleton {
            width: 40px;
            height: 10px;
          }

          .category-main-btn-skeleton {
            width: 70px;
            height: 36px;
          }
        }
      `}</style>
    </div>
  );
};

export default SubCategorySelectorSkeleton;
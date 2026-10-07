const CategorySelectorSkeleton = () => {
  return (
    <div className="category-selector-collapsible-skeleton">
      {/* Header */}
      <div className="cs-skeleton__header">
        <div className="cs-skeleton__header-left">
          <div className="cs-skeleton__icon shimmer" />
          <div className="cs-skeleton__title shimmer" />
        </div>
        <div className="cs-skeleton__arrow shimmer" />
      </div>

      <style>{`
        .category-selector-collapsible-skeleton {
          width: 100%;
          max-width: 900px;
          margin: 0 auto 1.5rem;
          background: var(--bg-card);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          overflow: hidden;
          box-shadow: 0 2px 12px var(--shadow-sm);
        }

        .cs-skeleton__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: var(--bg-input);
        }
        .cs-skeleton__header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cs-skeleton__icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background-color: #e8e0d8;
        }
        .cs-skeleton__title {
          width: 130px;
          height: 12px;
          border-radius: 6px;
          background-color: #e8e0d8;
        }
        .cs-skeleton__arrow {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          background-color: #e8e0d8;
        }

        /* Shimmer */
        .shimmer {
          position: relative;
          overflow: hidden;
          background-color: #e8e0d8;
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
          animation: cs-shimmer 1.8s infinite;
        }

        /* Dark mode */
        [data-theme='dark'] .cs-skeleton__icon,
        [data-theme='dark'] .cs-skeleton__title,
        [data-theme='dark'] .cs-skeleton__arrow,
        [data-theme='dark'] .shimmer {
          background-color: #5a4432 !important;
        }
        [data-theme='dark'] .shimmer::after {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.08) 50%,
            transparent 100%
          );
        }

        @keyframes cs-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default CategorySelectorSkeleton;
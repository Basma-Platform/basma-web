import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getRatingLabel } from '../../utils/ratingHelpers';

interface StarRatingInputProps {
  value: number;                    // 0–5
  onChange: (value: number) => void;
  size?: number;                    // default 36
  disabled?: boolean;
  error?: string;
}

const StarRatingInput = ({
  value,
  onChange,
  size = 36,
  disabled = false,
  error,
}: StarRatingInputProps) => {
  const [hovered, setHovered] = useState(0);

  const displayValue = hovered || value;

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          direction: 'ltr',
          marginBottom: '8px',
        }}
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = displayValue >= star;
          const isHovered = hovered >= star;

          return (
            <motion.button
              key={star}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onChange(star)}
              onMouseEnter={() => !disabled && setHovered(star)}
              whileHover={!disabled ? { scale: 1.15 } : {}}
              whileTap={!disabled ? { scale: 0.9 } : {}}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                color: isFilled ? '#FFC107' : 'var(--border-color)',
                transition: 'color 0.15s ease, transform 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: disabled ? 0.5 : 1,
                filter: isHovered
                  ? 'drop-shadow(0 4px 12px rgba(255,193,7,0.45))'
                  : 'none',
              }}
              aria-label={`${star} نجوم`}
            >
              <FaStar size={size} />
            </motion.button>
          );
        })}
      </div>

      {/* Label / Value */}
      <div
        style={{
          minHeight: '22px',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        {displayValue > 0 ? (
          <motion.span
            key={displayValue}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              color: '#F5A623',
              fontSize: '0.9rem',
              fontWeight: 800,
            }}
          >
            {getRatingLabel(displayValue)}
          </motion.span>
        ) : (
          <span
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 500,
            }}
          >
            اختر تقييمك
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            marginTop: '6px',
            color: 'var(--error)',
            fontSize: '0.75rem',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default StarRatingInput;
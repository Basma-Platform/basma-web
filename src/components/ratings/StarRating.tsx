import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;             // 0 – 5 (can be decimal)
  size?: number;              // px (default 14)
  color?: string;             // default gold
  showValue?: boolean;        // show "4.5" next to stars
  valueColor?: string;
  gap?: number;               // gap between stars in px (default 2)
  className?: string;
}

const StarRating = ({
  rating,
  size = 14,
  color = '#FFC107',
  showValue = false,
  valueColor,
  gap = 2,
  className,
}: StarRatingProps) => {
  const clamped = Math.max(0, Math.min(5, rating));

  // Build 5 star states: full / half / empty
  const stars: Array<'full' | 'half' | 'empty'> = [];
  for (let i = 1; i <= 5; i++) {
    if (clamped >= i) {
      stars.push('full');
    } else if (clamped >= i - 0.5) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${gap}px`,
        direction: 'ltr',
      }}
      aria-label={`تقييم ${clamped.toFixed(1)} من 5`}
    >
      {stars.map((state, idx) => {
        if (state === 'full') {
          return <FaStar key={idx} size={size} color={color} />;
        }
        if (state === 'half') {
          return <FaStarHalfAlt key={idx} size={size} color={color} />;
        }
        return (
          <FaRegStar
            key={idx}
            size={size}
            color={color}
            style={{ opacity: 0.35 }}
          />
        );
      })}

      {showValue && (
        <span
          style={{
            color: valueColor || 'var(--text-secondary)',
            fontSize: `${Math.max(size - 2, 10)}px`,
            fontWeight: 700,
            fontFamily:
              "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
            fontVariantNumeric: 'lining-nums tabular-nums',
            marginLeft: '4px',
          }}
        >
          {clamped.toFixed(1)}
        </span>
      )}
    </span>
  );
};

export default StarRating;
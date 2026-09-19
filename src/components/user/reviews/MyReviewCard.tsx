import RatingCard from '../../ratings/RatingCard';
import type { Rating } from '../../../types';

interface MyReviewCardProps {
  rating: Rating;
  variant: 'received' | 'given';
  onEdit?: (rating: Rating) => void;
  onDelete?: (rating: Rating) => void;
}

const MyReviewCard = ({
  rating,
  variant,
  onEdit,
  onDelete,
}: MyReviewCardProps) => {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        minWidth: '0px',
        boxSizing: 'border-box',
        marginBottom: '12px',
        overflow: 'hidden',
        wordBreak: 'break-word',
      }}
      dir="rtl"
    >
      <RatingCard
        rating={rating}
        variant={variant}
        onEdit={onEdit}
        onDelete={onDelete}
        showAnnouncement={true}
      />
    </div>
  );
};

export default MyReviewCard;
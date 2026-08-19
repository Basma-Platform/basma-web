import { Button } from 'react-bootstrap';
import { motion } from 'framer-motion';

interface FAQCategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isDark: boolean;
}

const categoryLabels: Record<string, string> = {
  all: 'الكل',
  account: 'الحساب',
  announcements: 'الإعلانات',
  payment: 'الدفع والمقايضة',
  safety: 'الأمان',
};

const FAQCategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  isDark,
}: FAQCategoryFilterProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
      }}
    >
      {categories.map((category) => (
        <motion.div
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={selectedCategory === category ? 'primary' : 'outline-secondary'}
            size="sm"
            onClick={() => onCategoryChange(category)}
            style={{
              backgroundColor:
                selectedCategory === category
                  ? '#E87A20'
                  : isDark
                  ? 'rgba(255,255,255,0.05)'
                  : '#FFFFFF',
              borderColor:
                selectedCategory === category
                  ? '#E87A20'
                  : isDark
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(139,90,43,0.15)',
              color:
                selectedCategory === category
                  ? '#FFFFFF'
                  : isDark
                  ? '#C49A6C'
                  : '#6B4226',
              borderRadius: '20px',
              padding: '8px 20px',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.9rem',
              fontWeight: selectedCategory === category ? 700 : 500,
              transition: 'all 0.3s ease',
            }}
          >
            {categoryLabels[category] || category}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default FAQCategoryFilter;
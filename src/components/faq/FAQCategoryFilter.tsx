import { Button } from 'react-bootstrap';
import { motion } from 'framer-motion';

interface FAQCategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isDark: boolean;
}

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
                  ? 'var(--primary-orange)'
                  : isDark
                  ? 'rgba(255,255,255,0.05)'
                  : 'var(--bg-white)',
              borderColor:
                selectedCategory === category
                  ? 'var(--primary-orange)'
                  : isDark
                  ? 'rgba(255,255,255,0.1)'
                  : 'var(--border-color)',
              color:
                selectedCategory === category
                  ? 'var(--text-light)'
                  : isDark
                  ? 'var(--text-muted)'
                  : 'var(--text-secondary)',
              borderRadius: '20px',
              padding: '8px 20px',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.9rem',
              fontWeight: selectedCategory === category ? 700 : 500,
              transition: 'all 0.3s ease',
            }}
          >
            {category}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default FAQCategoryFilter;
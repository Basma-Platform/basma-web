import { Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

interface FAQSearchProps {
  onSearch: (term: string) => void;
  isDark: boolean;
}

const FAQSearch = ({ onSearch, isDark }: FAQSearchProps) => {
  return (
    <InputGroup
      style={{
        boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.08)'}`,
        transition: 'all 0.3s ease',
      }}
    >
      <InputGroup.Text
        style={{
          backgroundColor: isDark ? '#16213e' : '#FFFFFF',
          border: 'none',
          color: isDark ? '#C49A6C' : '#8B5A2B',
          padding: '12px 16px',
        }}
      >
        <FaSearch />
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder="ابحث في الأسئلة الشائعة..."
        onChange={(e) => onSearch(e.target.value)}
        style={{
          backgroundColor: isDark ? '#16213e' : '#FFFFFF',
          border: 'none',
          color: isDark ? '#FDF5E6' : '#6B4226',
          padding: '12px 16px',
          fontFamily: 'Cairo, sans-serif',
          fontSize: '1rem',
          outline: 'none',
        }}
      />
    </InputGroup>
  );
};

export default FAQSearch;
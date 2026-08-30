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
        boxShadow: isDark ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid var(--border-color)`,
        transition: 'all 0.3s ease',
        backgroundColor: 'var(--bg-white)',
      }}
    >
      <InputGroup.Text
        style={{
          backgroundColor: 'var(--bg-white)',
          border: 'none',
          color: 'var(--text-muted)',
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
          backgroundColor: 'var(--bg-white)',
          border: 'none',
          color: 'var(--text-primary)',
          padding: '12px 16px',
          fontFamily: 'Cairo, sans-serif',
          fontSize: '1rem',
          outline: 'none',
          flex: 1,
        }}
      />
    </InputGroup>
  );
};

export default FAQSearch;
import { Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

interface AnnouncementSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const AnnouncementSearch = ({
  value,
  onChange,
  placeholder = 'ابحث في الإعلانات... (العنوان، الوصف)',
}: AnnouncementSearchProps) => {
  const { isDark } = useTheme();

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
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          backgroundColor: isDark ? '#16213e' : '#FFFFFF',
          border: 'none',
          color: isDark ? '#FDF5E6' : '#6B4226',
          padding: '12px 16px',
          fontFamily: 'Cairo, sans-serif',
          fontSize: '1rem',
          outline: 'none',
        }}
        // ✅ Fix placeholder color for dark mode
        onFocus={(e) => {
          e.currentTarget.style.backgroundColor = isDark ? '#1a1a2e' : '#FFFFFF';
        }}
        onBlur={(e) => {
          e.currentTarget.style.backgroundColor = isDark ? '#16213e' : '#FFFFFF';
        }}
      />
      {/* ✅ Fix placeholder color with CSS */}
      <style>{`
        .form-control::placeholder {
          color: ${isDark ? '#6a7a8a' : '#a09080'} !important;
          opacity: 1 !important;
          font-family: 'Cairo', sans-serif;
        }
        .form-control:focus::placeholder {
          color: ${isDark ? '#8a9aaa' : '#b0a090'} !important;
        }
      `}</style>
    </InputGroup>
  );
};

export default AnnouncementSearch;
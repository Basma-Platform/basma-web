import { Form } from 'react-bootstrap';

interface FAQPerPageDropdownProps {
  perPage: number;
  onPerPageChange: (value: number) => void;
  isDark: boolean;
}

const FAQPerPageDropdown = ({ perPage, onPerPageChange }: FAQPerPageDropdownProps) => {
  const options = [5, 10, 20, 50];

  return (
    <Form.Select
      value={perPage}
      onChange={(e) => onPerPageChange(Number(e.target.value))}
      size="sm"
      style={{
        width: 'auto',
        minWidth: '80px',
        backgroundColor: 'var(--bg-white)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-secondary)',
        borderRadius: '10px',
        fontFamily: 'Cairo, sans-serif',
        padding: '6px 12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </Form.Select>
  );
};

export default FAQPerPageDropdown;
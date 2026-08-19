import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../context/ThemeContext';
import { contactService } from '../services/contactService';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const ContactPage = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [_success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactService.sendMessage(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      toast.success('✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          width: '500px',
          maxWidth: '90vw',
          fontSize: '1.1rem',
          fontFamily: 'Cairo, sans-serif',
          textAlign: 'center',
          padding: '16px 24px',
          borderRadius: '12px',
        },
      });
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'حدث خطأ، يرجى المحاولة مرة أخرى.';
      
      toast.error(`❌ ${errorMessage}`, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          width: '500px',
          maxWidth: '90vw',
          fontSize: '1.1rem',
          fontFamily: 'Cairo, sans-serif',
          textAlign: 'center',
          padding: '16px 24px',
          borderRadius: '12px',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaEnvelope size={24} color="#E87A20" />,
      title: 'البريد الإلكتروني',
      details: 'info@basma.ps',
      sub: 'نحن هنا للإجابة على استفساراتك',
    },
    {
      icon: <FaPhone size={24} color="#E87A20" />,
      title: 'رقم الهاتف',
      details: '+970 123 456 789',
      sub: 'متاح من الأحد إلى الخميس',
    },
    {
      icon: <FaMapMarkerAlt size={24} color="#E87A20" />,
      title: 'العنوان',
      details: 'غزة، فلسطين',
      sub: 'نخدم مجتمعنا في كل مكان',
    },
    {
      icon: <FaClock size={24} color="#E87A20" />,
      title: 'ساعات العمل',
      details: 'الأحد - الخميس',
      sub: '9:00 صباحاً - 5:00 مساءً',
    },
  ];

  return (  
    <div
      style={{
        paddingTop: '100px',
        paddingBottom: '60px',
        backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
        minHeight: '100vh',
        transition: 'background-color 0.3s ease',
      }}
    >
      <SEO 
        title="اتصل بنا"
        description="تواصل مع فريق بصمة. نرحب بأسئلتك وملاحظاتك واستفساراتك."
      />
      
      <ToastContainer
        rtl
        theme={isDark ? 'dark' : 'light'}
        style={{
          fontFamily: 'Cairo, sans-serif',
          width: 'auto',
          maxWidth: '90vw',
        }}
        toastStyle={{
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        }}
      />

      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={10}>
            <div className="text-center mb-5">
              <div
                style={{
                  width: '60px',
                  height: '4px',
                  backgroundColor: '#E87A20',
                  borderRadius: '2px',
                  margin: '0 auto 1.5rem',
                }}
              />
              <h1
                style={{
                  color: isDark ? '#FDF5E6' : '#6B4226',
                  fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                  fontWeight: 900,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '1rem',
                }}
              >
                تواصل معنا
              </h1>
              <p
                style={{
                  color: isDark ? '#C49A6C' : '#8B5A2B',
                  fontSize: '1.1rem',
                  fontFamily: 'Cairo, sans-serif',
                  maxWidth: '600px',
                  margin: '0 auto',
                }}
              >
                نسعد بتواصلك معنا. فريق بصمة هنا للإجابة على جميع استفساراتك
                وملاحظاتك.
              </p>
            </div>
          </Col>
        </Row>

        <Row className="g-4">
          <Col xs={12} lg={5}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
              }}
            >
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    backgroundColor: isDark ? '#16213e' : '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: isDark
                      ? '0 4px 16px rgba(0,0,0,0.2)'
                      : '0 4px 16px rgba(0,0,0,0.04)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.06)'}`,
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.transform = 'translateX(-6px)';
                    e.currentTarget.style.boxShadow = isDark
                      ? '0 8px 32px rgba(0,0,0,0.3)'
                      : '0 8px 32px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = isDark
                      ? '0 4px 16px rgba(0,0,0,0.2)'
                      : '0 4px 16px rgba(0,0,0,0.04)';
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(232,122,32,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h3
                      style={{
                        color: isDark ? '#FDF5E6' : '#6B4226',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        fontFamily: 'Cairo, sans-serif',
                        margin: 0,
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        color: isDark ? '#C49A6C' : '#6B4226',
                        fontSize: '0.9rem',
                        fontFamily: 'Cairo, sans-serif',
                        margin: 0,
                        fontWeight: 600,
                      }}
                    >
                      {item.details}
                    </p>
                    <p
                      style={{
                        color: isDark ? '#C49A6C' : '#8B5A2B',
                        fontSize: '0.8rem',
                        fontFamily: 'Cairo, sans-serif',
                        margin: 0,
                        opacity: 0.7,
                      }}
                    >
                      {item.sub}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Col>

          <Col xs={12} lg={7}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                backgroundColor: isDark ? '#16213e' : '#FFFFFF',
                borderRadius: '20px',
                padding: '2.5rem',
                boxShadow: isDark
                  ? '0 4px 16px rgba(0,0,0,0.2)'
                  : '0 4px 16px rgba(0,0,0,0.04)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.06)'}`,
              }}
            >
              <h2
                style={{
                  color: isDark ? '#FDF5E6' : '#6B4226',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '0.5rem',
                }}
              >
                أرسل لنا رسالة
              </h2>
              <p
                style={{
                  color: isDark ? '#C49A6C' : '#8B5A2B',
                  fontSize: '0.95rem',
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '1.5rem',
                }}
              >
                سنرد عليك في أقرب وقت ممكن
              </p>

              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          color: isDark ? '#FDF5E6' : '#6B4226',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                        }}
                      >
                        الاسم الكامل *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="أدخل اسمك الكامل"
                        style={{
                          backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
                          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)',
                          color: isDark ? '#FDF5E6' : '#6B4226',
                          borderRadius: '10px',
                          padding: '12px 16px',
                          fontFamily: 'Cairo, sans-serif',
                          transition: 'all 0.3s ease',
                        }}
                        onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                          e.currentTarget.style.borderColor = '#E87A20';
                          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(232,122,32,0.1)';
                        }}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                          e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          color: isDark ? '#FDF5E6' : '#6B4226',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                        }}
                      >
                        البريد الإلكتروني *
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="أدخل بريدك الإلكتروني"
                        style={{
                          backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
                          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)',
                          color: isDark ? '#FDF5E6' : '#6B4226',
                          borderRadius: '10px',
                          padding: '12px 16px',
                          fontFamily: 'Cairo, sans-serif',
                          transition: 'all 0.3s ease',
                        }}
                        onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                          e.currentTarget.style.borderColor = '#E87A20';
                          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(232,122,32,0.1)';
                        }}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                          e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          color: isDark ? '#FDF5E6' : '#6B4226',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                        }}
                      >
                        الموضوع *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="أدخل موضوع رسالتك"
                        style={{
                          backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
                          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)',
                          color: isDark ? '#FDF5E6' : '#6B4226',
                          borderRadius: '10px',
                          padding: '12px 16px',
                          fontFamily: 'Cairo, sans-serif',
                          transition: 'all 0.3s ease',
                        }}
                        onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                          e.currentTarget.style.borderColor = '#E87A20';
                          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(232,122,32,0.1)';
                        }}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                          e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          color: isDark ? '#FDF5E6' : '#6B4226',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                        }}
                      >
                        الرسالة *
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="اكتب رسالتك هنا..."
                        style={{
                          backgroundColor: isDark ? '#1a1a2e' : '#FDF5E6',
                          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)',
                          color: isDark ? '#FDF5E6' : '#6B4226',
                          borderRadius: '10px',
                          padding: '12px 16px',
                          fontFamily: 'Cairo, sans-serif',
                          transition: 'all 0.3s ease',
                          resize: 'vertical',
                          minHeight: '120px',
                        }}
                        onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                          e.currentTarget.style.borderColor = '#E87A20';
                          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(232,122,32,0.1)';
                        }}
                        onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                          e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,90,43,0.12)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="rounded-pill fw-bold w-100 w-md-auto"
                      style={{
                        backgroundColor: '#E87A20',
                        borderColor: '#E87A20',
                        color: 'white',
                        padding: '14px 48px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 16px rgba(232,122,32,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                      }}
                      onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.currentTarget.style.backgroundColor = '#D46A1A';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 24px rgba(232,122,32,0.4)';
                      }}
                      onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.currentTarget.style.backgroundColor = '#E87A20';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(232,122,32,0.3)';
                      }}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            style={{ width: '1.2rem', height: '1.2rem' }}
                          />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane />
                          إرسال الرسالة
                        </>
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactPage;
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../context/ThemeContext';
import { contactService } from '../services/contactService';
import { FaMapMarkerAlt, FaPaperPlane, FaWhatsapp } from 'react-icons/fa';
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
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  // Show WhatsApp button after scrolling
  useEffect(() => {
    const handleScroll = () => {
      setShowWhatsApp(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <div
      style={{
        paddingTop: '100px',
        paddingBottom: '60px',
        backgroundColor: 'var(--bg-body)',
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
          <Col xs={12} lg={8} xl={7}>
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-5"
            >
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
                  color: 'var(--text-secondary)',
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
                  color: 'var(--text-muted)',
                  fontSize: '1.1rem',
                  fontFamily: 'Cairo, sans-serif',
                  maxWidth: '600px',
                  margin: '0 auto',
                }}
              >
                نسعد بتواصلك معنا. فريق بصمة هنا للإجابة على جميع استفساراتك
                وملاحظاتك.
              </p>
            </motion.div>

            {/* Contact Form - Centered */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '20px',
                padding: '2.5rem',
                boxShadow: isDark
                  ? '0 8px 32px rgba(0,0,0,0.3)'
                  : '0 8px 32px rgba(0,0,0,0.06)',
                border: `1px solid var(--border-color)`,
              }}
            >
              <h2
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '0.5rem',
                  textAlign: 'center',
                }}
              >
                أرسل لنا رسالة
              </h2>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.95rem',
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '1.5rem',
                  textAlign: 'center',
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
                          color: 'var(--text-secondary)',
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
                          backgroundColor: 'var(--bg-input)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)',
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
                          e.currentTarget.style.borderColor = 'var(--border-color)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          color: 'var(--text-secondary)',
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
                          backgroundColor: 'var(--bg-input)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)',
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
                          e.currentTarget.style.borderColor = 'var(--border-color)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          color: 'var(--text-secondary)',
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
                          backgroundColor: 'var(--bg-input)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)',
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
                          e.currentTarget.style.borderColor = 'var(--border-color)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label
                        style={{
                          color: 'var(--text-secondary)',
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
                          backgroundColor: 'var(--bg-input)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)',
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
                          e.currentTarget.style.borderColor = 'var(--border-color)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="rounded-pill fw-bold w-100"
                      style={{
                        backgroundColor: '#E87A20',
                        borderColor: '#E87A20',
                        color: 'white',
                        padding: '14px',
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

            {/* Location Card Below Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{
                marginTop: '2rem',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: isDark
                  ? '0 8px 32px rgba(0,0,0,0.3)'
                  : '0 8px 32px rgba(0,0,0,0.06)',
                border: `1px solid var(--border-color)`,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '0.5rem',
                }}
              >
                <FaMapMarkerAlt size={24} color="#E87A20" />
                <h3
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                  }}
                >
                  غزة، فلسطين
                </h3>
              </div>

              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '1rem',
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '0.5rem',
                }}
              >
                نخدم مجتمعنا في كل مكان
              </p>

              <div
                style={{
                  width: '60px',
                  height: '2px',
                  backgroundColor: '#E87A20',
                  borderRadius: '2px',
                  margin: '0.75rem auto',
                }}
              />

              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.95rem',
                  lineHeight: 1.8,
                  fontFamily: 'Cairo, sans-serif',
                  maxWidth: '500px',
                  margin: '0 auto',
                }}
              >
                نسعى لزيادة التكافل المجتمعي من خلال توفير منصة موثوقة تجمع
                بين أبناء المجتمع الواحد، وتمكنهم من تبادل الخدمات والموارد
                بكل أمان وثقة، ونساهم في بناء مجتمع متكافل ومترابط يعتمد على
                روح التعاون والمحبة.
              </p>
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* WhatsApp Floating Button */}
      <motion.a
        href="https://wa.me/972594720476?text=مرحباً!%20لدي%20استفسار%20بخصوص%20منصة%20بصمة"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: showWhatsApp ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)',
          zIndex: 1000,
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(37, 211, 102, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 211, 102, 0.4)';
        }}
      >
        <FaWhatsapp size={32} />
      </motion.a>
    </div>
  );
};

export default ContactPage;